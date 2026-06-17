import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'

import Navabar from './Components/Navabar'
import Admin from './Pages/Admin'
import AdminDashBoard from './Pages/AdminDashBoard'
import Add_Category from './Pages/Add_Category'
import Manage_cateories from './Pages/Manage_categories'
import Add_author from './Pages/Add_author'
import Manage_author from './Pages/Manage_author'
import Add_Book from './Pages/Add_Book'
import Manage_books from './Pages/Manage_books'
import AdminChangePassword from './Pages/AdminChangePassword'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navabar />
    <Toaster position="top-right" />

    <Routes >
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/dashboard" element={<AdminDashBoard />} />
      <Route path="/admin/add-category" element={<Add_Category />} />
      <Route path="/admin/manage-categories" element={<Manage_cateories />} />
      <Route path='/author/add-author' element={<Add_author />} />
      <Route path='/author/manage-author' element={<Manage_author />} />
      <Route path='/book/add-book' element={<Add_Book />} />
      <Route path='/book/manage-book' element={<Manage_books />} />
      <Route path='/admin/change-password' element={<AdminChangePassword />} />
    </Routes>

    </>
  )
}

export default App
