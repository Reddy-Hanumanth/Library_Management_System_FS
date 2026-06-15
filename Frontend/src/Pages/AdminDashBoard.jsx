import React from 'react'

const AdminDashBoard = () => {

    const AdminUser= localStorage.getItem("adminUser")
  return (
    <div>
        <h1>Admin Dashboard</h1>
        <p>Welcome, {AdminUser}!</p>
    </div>
  )
}

export default AdminDashBoard