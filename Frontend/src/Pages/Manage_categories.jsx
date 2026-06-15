import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Manage_cateories = () => {
    const [editID, setEditID] = useState(null);
    const [editName, setEditName] = useState("");
    const [editStatus, setEditStatus] = useState("1");
    const [categories, setCategories] = useState([]);
    const [loadingList, setLoadingList] = useState(false)
    const [saving, setSaving] = useState(false)

    const navigate = useNavigate();
    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
        if (!adminUser) {
            navigate("/admin");
        } else {
            fetchCategories();
        }
    }, []);

    const fetchCategories = async () => {
        setLoadingList(true);
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/categories/");

            setCategories(res.data);
        } catch (error) {
            toast.error("Failed to Load Categories");
        }
        finally {
            setLoadingList(false);
        }
    };

    const startEdit = (cat) => {
        setEditID(cat.id);
        setEditName(cat.name)
        setEditStatus(cat.is_active ? "1" : "0");
    }

    const startDelete = async (id) => {
        const ok = window.confirm("Are you realyl want to delete?");
        
        if (!ok) return;

        try {
            const res = await axios.delete(`http://127.0.0.1:8000/api/categories/delete/${id}/`);
            if (res.data.success) {
                toast.success(res.data.message || "Category Deleted");
                setCategories((prev) => prev.filter((c)=>c.id !== id))
            } else {
                toast.error(res.data.message || "Delate failed!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Somthing went wrong!");
        }
    }


    const cancelEdit = () => {
        setEditID(null);
        setEditName("")
        setEditStatus("1");
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await axios.put(`http://127.0.0.1:8000/api/categories/update/${editID}/`, {
                name: editName,
                status: editStatus,
            });
            if (res.data.success) {
                toast.success(res.data.message || "Category Updated");
                cancelEdit()
                fetchCategories()
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
                    <div className="col-md-10 mx-auto d-flex justify-content-around align-items-center">
                        <div className="mb-4 text-center">
                            <h4 className="fe-semibold mb-1">
                                <i className="fa-solid fa-layer-group text-primary"></i>Manage Categories
                                Category
                            </h4>
                            <p className="text-muted small">
                                {" "}
                                View, Edit and delete categories
                            </p>
                        </div>
                        <button className="btn btn-outline-primary btn-sm" onClick={() => navigate("/admin/add-category")}>Add new</button>
                    </div>
                </div>



                <div className="row g-4">
                    <div className="col-12 col-lg-3">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <h6 className="fw-semibold mb-3">{editID ? "Edit Category" : "select category to edit"}</h6>
                                {editID ? (
                                    <form onSubmit={handleUpdate}>
                                        <div className="mb-3">
                                            <label className="form-label small fw-medium">
                                                Category Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="e.g. Programmin, Science,..."
                                                required
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small fw-medium">
                                                Status
                                            </label>
                                            <div className="d-flex gap-3">
                                                <div className="form-check">
                                                    <input
                                                        type="radio"
                                                        className="form-control-input"
                                                        value="1"
                                                        checked={editStatus === "1"}
                                                        onChange={(e) => setEditStatus(e.target.value)}
                                                        id="status-active"
                                                        name="status"
                                                    />
                                                    <label className="form-check-label small mx-2" htmlFor="status-active">Active</label>
                                                </div>
                                                <div className="form-check ">
                                                    <input
                                                        type="radio"
                                                        className="form-control-input"
                                                        value="0"
                                                        checked={editStatus === "0"}
                                                        onChange={(e) => setEditStatus(e.target.value)}
                                                        id="status-inactive"
                                                        name="status"
                                                    />
                                                    <label className="form-check-label small mx-2" htmlFor="status-inactive">Inactive</label>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="d-grid">
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
                                                        updating....
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fa-solid fa-plus"></i>Update Category
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <p className="text-muted sm">Click on <strong>Edit</strong> button to Edit</p>
                                )}

                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-9">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <h6 className="fw-semibold mb-3">categories Listing</h6>
                                {loadingList ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary">

                                        </div>
                                    </div>
                                ) : categories.length === 0 ? (
                                    <p className="text-muted small">No categories Found...</p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="small text-muted">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Name</th>
                                                    <th>Status</th>
                                                    <th>Created</th>
                                                    <th>Updated</th>
                                                    <th className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {categories.map((cat, index) => (
                                                    <tr key={cat.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{cat.name}</td>
                                                        <td>{cat.is_active ? (
                                                            <span className="badge bg-success-subtle text-success border border-success-subtle">Active</span>
                                                        ) : (<span className="badge bg-danger-subtle text-dark border border-danger-subtle">Inactive</span>)}</td>
                                                        <td className="small text-muted">{new Date(cat.created_at).toLocaleDateString()}</td>
                                                        <td>{new Date(cat.updated_at).toLocaleDateString()}</td>
                                                        <td>
                                                            <div className="d-flex flex-column flex-md-row gap-2 justify-content-center">
                                                                <button className="btn btn-sm btn-outline-primary"  onClick={() => startEdit(cat)}>
                                                                    <i className="fa-solid fa-pen-to-square me-1"></i>
                                                                    Edit
                                                                </button>

                                                                <button className="btn btn-sm btn-outline-danger" onClick={()=>startDelete(cat.id)}>
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

} 
export default Manage_cateories;
