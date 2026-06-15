import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Add_Category = () => {
    const [name, setName] = useState("");
    const [status, setStatus] = useState("1");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false)

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
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/categories/");
            console.log(res.data);
            
            setCategories(res.data);
        } catch (error) {
            toast.error("Failed to Load Categories");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/categories/add/", {
                name,
                status,
            });
            if (res.data.success) {
                toast.success(res.data.message || "Category created");
                setName("");
                setStatus("1");
                fetchCategories();
            } else {
                toast.error(res.data.message || "Somthing went wrong");
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
                                <i className="fa-solid fa-layer-group text-primary"></i>Add
                                Category
                            </h4>
                            <p className="text-muted small">
                                {" "}
                                Create new book categories and manage their active status
                            </p>
                        </div>

                        <div className="row g-4">
                            <div className="col-12 col-lg-4">
                                <div className="card border-0 shadow-sm rounded-4">
                                    <div className="card-body p-4">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3">
                                                <label className="form-label small fw-medium">
                                                    Category Name
                                                </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="e.g. Programmin, Science,..."
                                                        required
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
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
                                                                checked={status==="1"}
                                                                onChange={(e) => setStatus(e.target.value)}
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
                                                                checked={status==="0"}
                                                                onChange={(e) => setStatus(e.target.value)}
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
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span
                                                                className="spinner-border spinner-border-sm me-2"
                                                                role="status"
                                                                aria-hidden="true"
                                                            ></span>
                                                            creating....
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fa-solid fa-plus"></i>Create Category
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-8">
                                <div className="card border-0 shadow-sm rounded-4">
                                    <div className="card-body p-4">
                                        <h6 className="fw-semibold mb-3">Existing categories</h6>

                                        {categories.length === 0 ? (
                                            <p className="text-muted small">No categories Found. Add Book Categories</p>
                                        ) : (
                                            <div className="table-responsive">
                                                <table className="table table-hover align-middle">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Name</th>
                                                            <th>Status</th>
                                                            <th>Created</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                            {categories.map((cat, index) => (
                                                                <tr key={cat.id}>
                                                                    <td>{index+1}</td>
                                                                    <td>{cat.name}</td> 
                                                                    <td>{cat.is_active ? (
                                                                        <span className="badge bg-success-subtle text-success border border-success-subtle">Active</span>
                                                                    ) : (<span className="badge bg-danger-subtle text-dark border border-danger-subtle">Inactive</span>)}</td>
                                                                    <td>{new Date(cat.created_at).toLocaleDateString()}</td> 
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
            </div>
        </div>
    );
};

export default Add_Category;
