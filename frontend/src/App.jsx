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

import ProtectedAdminRoute from './components/ProtectedAdminRoute'

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-category" element={<AddCategory />} />
        <Route path="/admin-secret-login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
        <Route path="/admin/category" element={<ProtectedAdminRoute><AdminCategory /></ProtectedAdminRoute>} />
        <Route path="/admin/item" element={<ProtectedAdminRoute><AdminItem /></ProtectedAdminRoute>} />
        <Route path="/admin/add-item" element={<ProtectedAdminRoute><AddItem /></ProtectedAdminRoute>} />
        <Route path="/admin/edit-item/:id" element={<ProtectedAdminRoute><EditItem /></ProtectedAdminRoute>} />
        <Route path="/admin/bill" element={<ProtectedAdminRoute><AdminBill /></ProtectedAdminRoute>} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App