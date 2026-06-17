import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
        if (!adminUser) {
            navigate("/admin");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match!");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long!");
            return;
        } 
        setLoading(true);
        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/api/admin/change-password/",
                {
                    username: adminUser,
                    current_password: currentPassword,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword,
                },

            );
            if (res.data.success) {
                console.log(res.data);
                toast.success(res.data.message || "Password changed successfully");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                
            } else {
                toast.error(res.data.message || "Failed to change password");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong!");
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
                                <i className="fa-solid fa-key text-primary"></i>Change Password
                            </h4>
                            <p className="text-muted small"> Update Admin Account Password</p>
                        </div>

                        <div className="row g-4">
                            <div className="col-md-8 mx-auto">
                                <div className="card border-0 shadow-sm rounded-4">
                                    <div className="card-body p-4">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3">
                                                <label className="form-label small fw-medium">
                                                    Current Password
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="fa-solid fa-lock"></i>
                                                    </span>
                                                    <input
                                                        type={showCurrentPassword ? "text" : "password"}
                                                        className="form-control"
                                                        placeholder="enter current password"
                                                        required
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={() =>
                                                            setShowCurrentPassword(!showCurrentPassword)
                                                        }
                                                    >
                                                        <i
                                                            className={`fa-solid ${showCurrentPassword ? "fa-eye-slash" : "fa-eye"}`}
                                                        ></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label small fw-medium">
                                                    New Password
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="fa-solid fa-key"></i>
                                                    </span>
                                                    <input
                                                        type={showNewPassword ? "text" : "password"}
                                                        className="form-control"
                                                        placeholder="enter new password"
                                                        required
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                    >
                                                        <i
                                                            className={`fa-solid ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`}
                                                        ></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label small fw-medium">
                                                    Confirm Password
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="fa-solid fa-key"></i>
                                                    </span>
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        className="form-control"
                                                        placeholder="confirm new password"
                                                        required
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={() =>
                                                            setShowConfirmPassword(!showConfirmPassword)
                                                        }
                                                    >
                                                        <i
                                                            className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}
                                                        ></i>
                                                    </button>
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
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fa-solid fa-floppy-disk me-2"></i>Update
                                                            Password
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
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

export default AdminChangePassword;
