import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Manage_books = () => {
  const [editID, setEditID] = useState(null);

  const [editAuthor, setEditAuthor] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editISBN, setEditISBN] = useState("");
  const [editQuantity, setEditQuantity] = useState("");

  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);

  const [loadingList, setLoadingList] = useState(false);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const adminUser = localStorage.getItem("adminUser");

  useEffect(() => {
    if (!adminUser) {
      navigate("/admin");
    } else {
      fetchAll();
    }
  }, []);

  const fetchAll = async () => {
    setLoadingList(true);
    try {
      const [BooksRes, CategoryRes, AuthorRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/books/"),
        axios.get("http://127.0.0.1:8000/api/categories/"),
        axios.get("http://127.0.0.1:8000/api/authors/"),
      ]);

      setBooks(BooksRes.data);
      setCategories(CategoryRes.data);
      setAuthors(AuthorRes.data);
    } catch (error) {
      toast.error("Failed to Load Data");
    } finally {
      setLoadingList(false);
    }
  };

  const startEdit = (book) => {
    setEditID(book.id);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditCategory(book.category);
    setEditISBN(book.isbn);
    setEditPrice(book.price);
    setEditQuantity(book.quantity);
    setEditImagePreview(book.cover_page); // cover_page already has full URL from serializer
    setEditImage(null);
  };

  const startDelete = async (id) => {
    const ok = window.confirm("Are you really want to delete?");

    if (!ok) return;

    try {
      const res = await axios.delete(
        `http://127.0.0.1:8000/api/books/delete/${id}/`,
      );
      if (res.data.success) {
        toast.success(res.data.message || "Book Deleted");
        setBooks((prev) => prev.filter((c) => c.id !== id));
        if (editID === id) {
          cancelEdit();
        }
      } else {
        toast.error(res.data.message || "Delete failed!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const cancelEdit = () => {
    setEditID(null);
    setEditTitle("");
    setEditAuthor("");
    setEditCategory("");
    setEditISBN("");
    setEditPrice("");
    setEditQuantity("");
    setEditImagePreview(null); // Reset to original image
    setEditImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("author", editAuthor);
      formData.append("category", editCategory);
      formData.append("isbn", editISBN);
      formData.append("price", editPrice);
      formData.append("quantity", editQuantity);
      if (editImage) {
        formData.append("cover_page", editImage);
      }
      const res = await axios.put(
        `http://127.0.0.1:8000/api/books/update/${editID}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message || "Book Updated");
        cancelEdit();
        fetchAll();
      } else {
        toast.error(res.data.message || "Update failed!");
      }
    } catch (error) {
      toast.error("Somthing went wrong!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="py-5"
      style={{
        background: "linear-gradient(135deg,#f3f4ff,#fdfbff)",
        minHeight: "100vh",
      }}
    >
      <div className="container">
        <div className="row mb-4">
          <div className="col-12 col-md-10 mx-auto d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div className="mb-4 text-center">
              <h4 className="fw-semibold mb-1">
                <i className="fa-solid fa-books text-primary"></i>Manage Books
              </h4>
              <p className="text-muted small"> View, Edit and delete Books</p>
            </div>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => navigate("/book/add-book")}
            >
              <i className="fa-solid fa-plus"></i>
              Add new
            </button>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h6 className="fw-semibold mb-3">
                  {editID ? "Edit Book" : "select Book to edit"}
                </h6>
                {editID ? (
                  <form onSubmit={handleUpdate}>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">Tittle</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Harry Potter and the Sorcerer's Stone"
                          required
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Category</label>
                        <select
                          className="form-select"
                          placeholder="e.g. Fiction, Non-Fiction"
                          required
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                        >
                          <option value="">-- Select Category --</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label">Author</label>
                        <select
                          className="form-select"
                          placeholder="e.g. Fiction, Non-Fiction"
                          required
                          value={editAuthor}
                          onChange={(e) => setEditAuthor(e.target.value)}
                        >
                          <option value="">-- Select Author --</option>
                          {authors.map((auth) => (
                            <option key={auth.id} value={auth.id}>
                              {auth.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-6">
                        <label className="form-label">Price</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="e.g. 199.99"
                          min="0"
                          step="0.01"
                          required
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                        />
                      </div>

                      <div className="col-6">
                        <label className="form-label">Quantity</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="e.g. 10"
                          min="0"
                          step="1"
                          required
                          value={editQuantity}
                          onChange={(e) => setEditQuantity(e.target.value)}
                        />
                      </div>

                      <div className="col-8">
                        <label className="form-label">Cover Image</label>
                        {editImagePreview && (
                          <div className="mb-2">
                            <img
                              src={editImagePreview}
                              alt="Preview"
                              className="img-fluid rounded"
                              style={{ maxHeight: "60px" }}
                            />
                          </div>
                        )}
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>

                    <div className="mt-4 d-grid">
                      <button
                        type="submit"
                        className="btn btn-primary fw-semibold"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            saving....
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-floppy-disk me-2"></i>Update
                            Book
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary mt-2"
                        onClick={cancelEdit}
                        >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-muted sm">
                    Click on <strong>Edit</strong> button to Edit
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h6 className="fw-semibold mb-3">Book Listing</h6>
                {loadingList ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary"></div>
                  </div>
                ) : books.length === 0 ? (
                  <p className="text-muted small">No books Found...</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="small text-muted">
                        <tr>
                          <th>#</th>
                          <th>Book</th>
                          <th>Category</th>
                          <th>Author</th>
                          <th>ISBN</th>
                          <th>Qty</th>
                          <th>Price</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {books.map((book, index) => (
                          <tr key={book.id}>
                            <td className="small text-muted ">{index + 1}</td>

                            <td
                              className="small text-muted d-flex flex-column  gap-1"
                              style={{ maxWidth: "200px" }}
                            > 
                              <img
                                src={
                                  book.cover_page
                                    ? book.cover_page.startsWith("http")
                                      ? book.cover_page
                                      : `http://127.0.0.1:8000/${book.cover_page.replace(/^\//, "")}`
                                    : "/placeholder.jpg"
                                }
                                alt={book.title}
                                style={{
                                  width: "40px",
                                  height: "55px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                }}
                              />
                              <span>{book.title}</span>
                            </td>
                            <td className="small text-muted">
                              {book.category_name}
                            </td>
                            <td className="small text-muted">
                              {book.author_name}
                            </td>
                            <td className="small text-muted">{book.isbn}</td>
                            <td className="small text-muted">
                              {book.quantity}
                            </td>
                            <td className="small text-muted">${book.price}</td>
                            <td>
                              <div className="d-flex flex-wrap gap-2 justify-content-center">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => startEdit(book)}
                                >
                                  <i className="fa-solid fa-pen-to-square me-2"></i>
                                  Edit
                                </button>

                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => startDelete(book.id)}
                                >
                                  <i className="fa-solid fa-trash me-1"></i>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Manage_books;
