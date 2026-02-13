import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataContext } from '../context/UserContext';
import { api, server } from '../helpers/api';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaLayerGroup } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';
import EditCategoryModal from '../components/EditCategoryModal';
import usePagination from '../hooks/usePagination';

const AdminCategory = () => {
    const { admin } = useContext(dataContext);
    const navigate = useNavigate();

    // Use custom pagination hook
    const {
        data: categories,
        loading,
        page,
        totalPages,
        totalItems,
        nextPage,
        prevPage,
        jumpToPage,
        refresh
    } = usePagination('/categories', 10);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!admin && !storedUser) {
            navigate('/admin-secret-login');
        }
    }, [admin, navigate]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await api.delete(`/categories/${id}`);
                refresh(); // Refresh data using hook
                toast.success("Category Deleted");
            } catch (error) {
                console.error(error);
                toast.error("Failed to delete category");
            }
        }
    };

    const handleEdit = (id) => {
        const categoryToEdit = categories.find(cat => cat._id === id);
        if (categoryToEdit) {
            setCurrentCategory(categoryToEdit);
            setIsEditModalOpen(true);
        }
    };

    const handleUpdate = () => {
        refresh(); // Refresh data using hook
    };

    // Check local storage one last time for render safety
    const isAuthenticated = admin || localStorage.getItem("user");

    if (!isAuthenticated) return null;

    return (
        <div className='w-full min-h-screen bg-gray-50 p-6 md:p-8 font-sans'>
            <div className='max-w-7xl mx-auto'>
                {/* Header Section */}
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                            <IoArrowBack size={24} />
                        </button>
                        <div>
                            <h1 className='text-3xl font-extrabold font-heading text-gray-800 tracking-tight'>Category Management</h1>
                            <p className='text-gray-500 mt-1 text-sm'>Manage your food categories efficiently.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/add-category')}
                        className='bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:from-green-600 hover:to-green-700 transition-all shadow-md active:scale-95'
                    >
                        <FaPlus className="text-sm" />
                        <span className="font-semibold">Add New Category</span>
                    </button>
                </div>

                {/* Stats Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
                            <FaLayerGroup size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Categories</p>
                            <h3 className="text-2xl font-bold text-gray-800">{totalItems}</h3>
                        </div>
                    </div>
                </div>

                {/* Content Table */}
                <div className='bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden'>
                    <div className="overflow-x-auto">
                        <table className='w-full text-left border-collapse'>
                            <thead className='bg-gray-50/50 border-b border-gray-200'>
                                <tr>
                                    <th className='p-4 text-xs font-bold font-heading text-gray-500 uppercase tracking-wider w-24'>Image</th>
                                    <th className='p-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Name</th>
                                    <th className='p-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Description</th>
                                    <th className='p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-gray-500">Loading categories...</td>
                                    </tr>
                                ) : (
                                    <>
                                        {categories.map((category) => (
                                            <tr key={category._id} className='hover:bg-blue-50/30 transition-colors duration-200 group'>
                                                <td className='p-4'>
                                                    <div className="w-12 h-12 overflow-hidden rounded-lg shadow-sm border border-gray-200 shrink-0">
                                                        {category.image ? (
                                                            <img
                                                                src={`${server}/${category.image}`}
                                                                alt={category.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                                                                No Img
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className='p-4'>
                                                    <p className="font-semibold font-heading text-gray-800 text-sm capitalize">{category.name}</p>
                                                </td>
                                                <td className='p-4'>
                                                    <p className="text-gray-500 text-sm truncate max-w-xs">{category.description || <span className="italic text-gray-300">No description</span>}</p>
                                                </td>
                                                <td className='p-4 text-right'>
                                                    <div className='flex justify-end gap-2 text-gray-400'>
                                                        <button
                                                            onClick={() => handleEdit(category._id)}
                                                            className='p-2 hover:bg-blue-100 hover:text-blue-600 rounded-full transition-colors'
                                                            title="Edit Category"
                                                        >
                                                            <FaEdit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(category._id)}
                                                            className='p-2 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors'
                                                            title="Delete Category"
                                                        >
                                                            <FaTrash size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {categories.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="p-12 text-center text-gray-400">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <FaLayerGroup size={40} className="text-gray-200" />
                                                        <p>No categories found.</p>
                                                        <button
                                                            onClick={() => navigate('/add-category')}
                                                            className="text-blue-500 hover:underline text-sm font-medium mt-2"
                                                        >
                                                            Add your first category
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex flex-col md:flex-row justify-between items-center p-6 border-t border-gray-100 bg-gray-50/30 gap-4">
                            <span className="text-sm text-gray-500">
                                Showing page <span className="font-semibold text-gray-700">{page}</span> of <span className="font-semibold text-gray-700">{totalPages}</span>
                            </span>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={prevPage}
                                    disabled={page === 1}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium text-gray-600 transition-all shadow-sm hover:shadow-md"
                                >
                                    Previous
                                </button>

                                <div className="hidden sm:flex gap-1">
                                    {[...Array(totalPages)].map((_, index) => {
                                        const pageNum = index + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => jumpToPage(pageNum)}
                                                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${page === pageNum
                                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={nextPage}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium text-gray-600 transition-all shadow-sm hover:shadow-md"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {isEditModalOpen && (
                <EditCategoryModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    category={currentCategory}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default AdminCategory;
