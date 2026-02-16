import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import { FaUtensils, FaArrowRight, FaShapes, FaSignOutAlt } from 'react-icons/fa';

const AdminDashboard = () => {
    const { admin, setAdmin } = useContext(dataContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setAdmin(null);
        toast.success("Logged out successfully");
        navigate('/admin-secret-login');
    };

    const SelectionCard = ({ title, icon, color, onClick }) => (
        <div
            onClick={onClick}
            className={`cursor-pointer rounded-2xl p-6 shadow-md transition-all hover:shadow-xl hover:-translate-y-1 border border-gray-100 bg-white group`}
        >
            <div className={`w-14 h-14 rounded-full ${color} flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title} Management</h3>
            <p className="text-gray-500 text-sm mb-4">Click to view, add, or edit {title.toLowerCase()}s.</p>
            <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                Go to {title} <FaArrowRight className="ml-1" />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
            <div className="max-w-5xl mx-auto">
                <header className="mb-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">Admin Dashboard</h1>
                        <p className="text-gray-500 text-lg">Manage your restaurant menu with ease.</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-600 text-white px-3 md:px-5 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-sm"
                    >
                        <FaSignOutAlt />
                        <span className="hidden md:inline">Logout</span>
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <SelectionCard
                        title="Category"
                        icon={<FaShapes size={24} />}
                        color="bg-gradient-to-br from-purple-500 to-indigo-600"
                        onClick={() => navigate('/admin/category')}
                    />
                    <SelectionCard
                        title="Item"
                        icon={<FaUtensils size={24} />}
                        color="bg-gradient-to-br from-orange-400 to-pink-500"
                        onClick={() => navigate('/admin/item')}
                    />
                    <SelectionCard
                        title="Bill"
                        icon={<FaUtensils size={24} />}
                        color="bg-gradient-to-br from-blue-400 to-cyan-500"
                        onClick={() => navigate('/admin/bill')}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
