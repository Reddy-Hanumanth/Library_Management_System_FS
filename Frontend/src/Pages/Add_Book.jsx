import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Add_Book = () => {
    const [quantity, setQuantity] = useState("");
    const [tittle, setTittle] = useState("");
    const [price, setPrice] = useState("");
    const [isbn, setIsbn] = useState("");

    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");

    const [authors, setAuthors] = useState([]);
    const [author, setAuthor] = useState("");

    const [loadingDropdown, setloadingDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    const [coverfile, setCoverfile] = useState(null);

    const navigate = useNavigate();
    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
        if (!adminUser) {
            navigate("/admin");
        } else {
            fetchDropdowndata();
        }
    }, []);

    const fetchDropdowndata = async () => {
        setloadingDropdown(true);
        try {
            const [authRes, catRes] = await Promise.all([
                axios.get("http://127.0.0.1:8000/api/authors/"),
                axios.get("http://127.0.0.1:8000/api/categories/"),
            ]);
            const actvieCats = catRes.data.filter((c) => c.is_active);
            setCategories(actvieCats);
            setAuthors(authRes.data);
        } catch (error) {
            toast.error("Failed to Load Authores/Categories");
        } finally {
            setloadingDropdown(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(); // Create a FormData object to handle file upload (multiple data types)
        formData.append("title", tittle);
        formData.append("author", author);
        formData.append("category", category);
        formData.append("quantity", quantity);
        formData.append("price", price);
        formData.append("isbn", isbn);
        if (coverfile) {
                formData.append("cover_page", coverfile); // Append the file to the FormData object
        }
        setLoading(true);

        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/api/books/add/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            if (res.data.success) {
                toast.success(res.data.message || "Book Added successfully");
                setTittle("");
                setAuthor("");
                setCategory("");
                setQuantity("");
                setPrice("");
                setIsbn("");
                setCoverfile(null);
                fetchDropdowndata();
            } else {
                toast.error(res.data.message || "failed to add book!");
            }
        } catch (error) {
            toast.error("Somthing went wrong!");
        } finally {
            setLoading(false);
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
                    <div className="col-md-8 mx-auto">
                        <div className="mb-4 text-center">
                            <h4 className="fe-semibold mb-1">
                                <i className="fa-solid fa-book text-primary"></i>Add Books
                            </h4>
                            <p className="text-muted small">
                                {" "}
                                Create new book entries and manage them
                            </p>
                        </div>

                        <div className="row justify-content-center">
                            <div className="col-md-10">
                                <div className="card border-0 shadow-sm rounded-4">
                                    <div className="card-body p-4">
                                        {loadingDropdown ? (
                                            <div className="text-center my-5">
                                                <span
                                                    className="spinner-border text-primary spinner-border-sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSubmit}>
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <label className="form-label">Tittle</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="e.g. Harry Potter and the Sorcerer's Stone"
                                                            required
                                                            value={tittle}
                                                            onChange={(e) => setTittle(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Category</label>
                                                        <select
                                                            className="form-select"
                                                            placeholder="e.g. Fiction, Non-Fiction"
                                                            required
                                                            value={category}
                                                            onChange={(e) => setCategory(e.target.value)}
                                                        >
                                                            <option value="">-- Select Category --</option>
                                                            {categories.map((cat) => (
                                                                <option key={cat.id} value={cat.id}>
                                                                {cat.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    
                                                    <div className="col-md-6">
                                                        <label className="form-label">Author</label>
                                                        <select
                                                            className="form-select"
                                                            placeholder="e.g. Fiction, Non-Fiction"
                                                            required
                                                            value={author}
                                                            onChange={(e) => setAuthor(e.target.value)}
                                                        >
                                                            <option value="">-- Select Author --</option>
                                                            {authors.map((auth) => (
                                                                <option key={auth.id} value={auth.id}>
                                                                {auth.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <label className="form-label">ISBN</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="e.g. 978-04515-2493-5"
                                                            required
                                                            value={isbn}
                                                            onChange={(e) => setIsbn(e.target.value)}
                                                        />
                                                        <p className="small mb-0 text-muted">
                                                            <code>ISBN must be unique for each book.</code>
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="col-md-4">
                                                        <label className="form-label">Price</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="e.g. 199.99"
                                                            min="0"
                                                            step="0.01"
                                                            required
                                                            value={price}
                                                            onChange={(e) => setPrice(e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="col-md-4">
                                                        <label className="form-label">Quantity</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="e.g. 10"
                                                            min="0"
                                                            step="1"
                                                            required
                                                            value={quantity}
                                                            onChange={(e) => setQuantity(e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="col-md-4">
                                                        <label className="form-label">Cover Image</label>
                                                        <input
                                                            type="file"
                                                            className="form-control"
                                                            accept="image/*"
                                                            required
                                                            onChange={(e) => setCoverfile(e.target.files[0])}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mt-4 d-grid">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary fw-semibold"
                                                        disabled={loading}
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <span
                                                                    className="spinner-border spinner-border-sm me-2"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                ></span>
                                                                adding....
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fa-solid fa-plus"></i>Add Book
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* <div className="col-12 col-lg-8">
                                <div className="card border-0 shadow-sm rounded-4">
                                    <div className="card-body p-4">
                                        <h6 className="fw-semibold mb-3">Existing Books</h6>

                                        {books.length === 0 ? (
                                            <p className="text-muted small">No Books Found. Add a New Book</p>
                                        ) : (
                                            <div className="table-responsive">
                                                <table className="table table-hover align-middle">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Title</th>
                                                            <th>Created</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                            {books.map((book, index) => (
                                                                <tr key={book.id}>
                                                                    <td>{index+1}</td>
                                                                    <td>{book.title}</td> 
                                                                    <td>{new Date(book.created_at).toLocaleDateString()}</td> 
                                                                </tr>
                                                            ))}
                                                            
                                                        </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Add_Book;
