import React, { useContext } from 'react'
import Home from './pages/Home'
import AddCategory from './pages/AddCategory'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminCategory from './pages/AdminCategory'
import AdminItem from './pages/AdminItem'
import AddItem from './pages/AddItem'
import EditItem from './pages/EditItem'
import AdminBill from './pages/AdminBill'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-category" element={<AddCategory />} />
        <Route path="/admin-secret-login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/category" element={<AdminCategory />} />
        <Route path="/admin/item" element={<AdminItem />} />
        <Route path="/admin/add-item" element={<AddItem />} />
        <Route path="/admin/edit-item/:id" element={<EditItem />} />
        <Route path="/admin/bill" element={<AdminBill />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App