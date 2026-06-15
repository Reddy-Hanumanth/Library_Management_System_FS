import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom'

const Admin = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        
        
        try{
            const res = await axios.post("http://127.0.0.1:8000/api/admin/login/", {username, password});
            if(res.data.success){
                toast.success(res.data.message || "Login successful!")
                localStorage.setItem("adminUser", res.data.username)
                navigate("/admin/dashboard"); 
            }else{
                toast.error(res.data.message || "Login failed!")
            }

        } catch (error) {
            toast.error("Invalid credentials!") 
        } finally {
            setLoading(false)
        }
    }



  return (
    <div className='py-5' style={{background:"linear-gradient(135deg,#f3f4ff,#fdfbff)", minHeight: "100vh"}}>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-md-5'>
                    <div className='mb-4 text-center'>
                        <h4 className='fe-semibold mb-1'><i className='fa-solid fa-shield-halved text-primary'></i>Admin Sign-in</h4>
                        <p className='text-muted small'> Use the admin account created via <code>createSuperUser</code></p>
                    </div>
                    <div className='card border-0 shadow-sm rounded-4'>
                        <div className='card-body p-4'>
                            <form onSubmit={handleSubmit}>

                                <div className='mb-3'>
                                    <label className='form-label small fw-medium'>Username</label>
                                    <div className='input-group'>
                                        <span className='input-group-text bg-transparent'><i className='fa-regular fa-user'></i></span>
                                        <input type='text' className='form-control' placeholder='Enter your username' required value={username} onChange={(e)=>setUsername(e.target.value)}/>
                                    </div>
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label small fw-medium'>Password</label>
                                    <div className='input-group'>
                                        <span className='input-group-text bg-transparent'><i className='fa-solid fa-key'></i></span>
                                        <input type='password' className='form-control' placeholder='Enter your password' required value={password} onChange={(e)=>setPassword(e.target.value)}/>
                                    </div>
                                </div>

                                <div className='d-grid'>
                                    <button type='submit' className='btn btn-primary fw-semibold' disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                                                Signing In...
                                            </>
                                        ) : (
                                            <>
                                                <i className='fa-solid fa-right-to-bracket'></i> Sign In
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
  )
}

export default Admin