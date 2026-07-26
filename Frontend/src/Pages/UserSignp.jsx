// import react from "react";
import { useState} from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {Link} from "react-router-dom";

const UserSignUp = () => {
    const [formData, setFormData] = useState({
        Fullname: "",
        mobile: "",
        email: "",
        password: "",
        confirm_Password: ""
    });


    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {
        setFormData({
            ...formData,                //Speread Existing dat to avoid any kind of deafult modificatio
            [e.target.name]: e.target.value     // Update specific field
        });
    }

        

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirm_Password) {
            toast.error("Password and confirm password do not match!");
            return;
        }
        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long!");
            return;
        } 
        setLoading(true);
        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/api/user_signup/", formData  //or we do both 
                // {
                //     Fullname: formData.Fullname,
                //     mobile: formData.mobile,
                //     email: formData.email,
                //     password: formData.password,
                //     confirm_Password: formData.password
                // },


            );
            if (res.data.success) {
                toast.success(res.data.message || `Registartion successfully! your Student ID is ${res.data.student_id}`);
                setFormData({
                    Fullname: "",
                    mobile: "",
                    email: "",
                    password: "",
                    confirm_Password: ""
                })
                
            } else {
                toast.error(res.data.message || "Registration Failed");
            }
        } catch (error) {
            console.log("Error Response:", error.response);
            console.log("Error Data:", error.response?.data);

            toast.error(
                error.response?.data?.message || "Something went wrong!"
            );
        } 
        finally {
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
                <div className="row mb-2">
                    <div className="col-md-8 mx-auto">
                        <div className="mb-4 text-center">
                            <h4 className="fw-semibold mb-1">
                                <i className="fa-solid fa-key text-primary"></i>User Signup
                            </h4>
                            <p className="text-muted small">Register as a new User </p>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mx-auto">
                                <div className="card border-0 shadow-sm rounded-4">
                                    <div className="card-body p-4">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3">
                                                <label className="form-label small fw-medium">
                                                    Full name
                                                </label>
                                                
                                                    <input
                                                        type="text"
                                                        name="Fullname"
                                                        className="form-control"
                                                        placeholder="Tony Stark"
                                                        required
                                                        value={formData.Fullname}
                                                        onChange={handleChange}
                                                    />
                                                   
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label small fw-medium">
                                                    Contact
                                                </label>
                                                
                                                    <input
                                                        type="text"
                                                        name="mobile"
                                                        maxLength={10}
                                                        className="form-control"
                                                        placeholder="0123123123"
                                                        required
                                                        value={formData.mobile}
                                                        onChange={handleChange}
                                                    />
                                                   
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label small fw-medium">
                                                    Email
                                                </label>
                                                
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="abcdef@gmail.com"
                                                        required
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                    />
                                                   
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label small fw-medium">
                                                    Password
                                                </label>
                                                
                                                    <input
                                                        type="password"
                                                        name="password"

                                                        className="form-control"
                                                        placeholder="*******"
                                                        required
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                    />
                                                   
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label small fw-medium">
                                                    Confirm Password
                                                </label>
                                                
                                                    <input
                                                        type="password"
                                                        name="confirm_Password"
                                                        className="form-control"
                                                        placeholder="*******"
                                                        required
                                                        value={formData.confirm_Password}
                                                        onChange={handleChange}
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
                                                            Registering...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fa-solid fa-user-plus me-2"></i>
                                                            Register
                                                        </>
                                                    )}
                                                </button>
                                                <p className="text-center text-muted small mt-3">Already have an account? <Link to="/login">Login here</Link></p>
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

export default UserSignUp;
