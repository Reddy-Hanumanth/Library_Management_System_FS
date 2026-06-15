import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Manage_author = () => {
    const [editID, setEditID] = useState(null);
    const [editName, setEditName] = useState("");
    const [authors, setAuthores] = useState([]);
    const [loadingList, setLoadingList] = useState(false)
    const [saving, setSaving] = useState(false)

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
        setLoadingList(true);
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/authors/");
            setAuthores(res.data);
        } catch (error) {
            toast.error("Failed to Load Authores");
        }
        finally {
            setLoadingList(false);
        }
    };

    const startEdit = (auth) => {
        setEditID(auth.id);
        setEditName(auth.name)
    }

    const startDelete = async (id) => {
        const ok = window.confirm("Are you really want to delete?");
        
        if (!ok) return;

        try {
            const res = await axios.delete(`http://127.0.0.1:8000/api/authors/delete/${id}/`);
            if (res.data.success) {
                toast.success(res.data.message || "Author Deleted");
                setAuthores((prev) => prev.filter((c)=>c.id !== id))
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
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await axios.put(`http://127.0.0.1:8000/api/authors/update/${editID}/`, {
                name: editName,
            });
            if (res.data.success) {
                toast.success(res.data.message || "Author Updated");
                cancelEdit()
                fetchauthor()
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
                                <i className="fa-solid fa-layer-group text-primary"></i>Manage Author
                            </h4>
                            <p className="text-muted small">
                                {" "}
                                View, Edit and delete Author's
                            </p>
                        </div>
                        <button className="btn btn-outline-primary btn-sm" onClick={() => navigate("/author/add-author")}> 
                            <i className="fa-solid fa-plus"></i>
                            Add new
                        </button>
                    </div>
                </div>



                <div className="row g-4">
                    <div className="col-12 col-lg-3">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <h6 className="fw-semibold mb-3">{editID ? "Edit Author" : "select Author to edit"}</h6>
                                {editID ? (
                                    <form onSubmit={handleUpdate}>
                                        <div className="mb-3">
                                            <label className="form-label small fw-medium">
                                                Author Name
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
                                                        <i className="fa-solid fa-plus"></i>Update Author
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
                                <h6 className="fw-semibold mb-3">Author Listing</h6>
                                {loadingList ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary">

                                        </div>
                                    </div>
                                ) : authors.length === 0 ? (
                                    <p className="text-muted small">No authors Found...</p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="small text-muted">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Name</th>
                                                    <th>Created</th>
                                                    <th>Updated</th>
                                                    <th className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {authors.map((auth, index) => (
                                                    <tr key={auth.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{auth.name}</td>
                                                        <td className="small text-muted">{new Date(auth.created_at).toLocaleDateString()}</td>
                                                        <td>{new Date(auth.updated_at).toLocaleDateString()}</td>
                                                        <td>
                                                            <div className="d-flex flex-column flex-md-row gap-2 justify-content-center">
                                                                <button className="btn btn-sm btn-outline-primary"  onClick={() => startEdit(auth)}>
                                                                    <i className="fa-solid fa-pen-to-square me-1"></i>
                                                                    Edit
                                                                </button>

                                                                <button className="btn btn-sm btn-outline-danger" onClick={()=>startDelete(auth.id)}>
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
export default Manage_author;
