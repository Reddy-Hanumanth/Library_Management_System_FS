import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Add_author = () => {
    const [name, setName] = useState("");
    const [authors, setAuthores] = useState([])
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();
    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
        if (!adminUser) {
            navigate("/admin");
        } else {
            fetchauthor();
        }
    }, []);

    const fetchauthor = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/authors/");
            setAuthores(res.data);
        } catch (error) {
            toast.error("Failed to Load Authores");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/authors/add/", {
                name                
            });
            if (res.data.success) {
                toast.success(res.data.message || "Author created");
                setName("");
                fetchauthor();
            } else {
                toast.error(res.data.message || "somthing went wrong!");
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
                                <i className="fa-solid fa-user-pen text-primary"></i>Add
                                Author
                            </h4>
                            <p className="text-muted small">
                                {" "}
                                Create new book Author and manage them
                            </p>
                        </div>

                        <div className="row g-4">
                            <div className="col-12 col-lg-4">
                                <div className="card border-0 shadow-sm rounded-4">
                                    <div className="card-body p-4">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3">
                                                <label className="form-label small fw-medium">
                                                    Author Name
                                                </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="e.g. J.K> Rowling,..."
                                                        required
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                    />
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
                                                            adding....
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fa-solid fa-plus"></i>Add Author
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
                                        <h6 className="fw-semibold mb-3">Existing Author</h6>

                                        {authors.length === 0 ? (
                                            <p className="text-muted small">No Author Found. Add Book Author</p>
                                        ) : (
                                            <div className="table-responsive">
                                                <table className="table table-hover align-middle">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Name</th>
                                                            <th>Created</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                            {authors.map((auth, index) => (
                                                                <tr key={auth.id}>
                                                                    <td>{index+1}</td>
                                                                    <td>{auth.name}</td> 
                                                                    <td>{new Date(auth.created_at).toLocaleDateString()}</td> 
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

export default Add_author;
