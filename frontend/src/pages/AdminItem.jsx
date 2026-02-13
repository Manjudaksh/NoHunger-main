import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataContext } from '../context/UserContext';
import { server, api } from '../helpers/api'; // Ensure api is imported for delete
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaUtensils } from 'react-icons/fa';
import usePagination from '../hooks/usePagination';

const AdminItem = () => {
    const { admin } = useContext(dataContext);
    const navigate = useNavigate();

    // Use custom pagination hook
    const {
        data: foods,
        loading,
        page,
        totalPages,
        totalItems,
        nextPage,
        prevPage,
        jumpToPage,
        refresh
    } = usePagination('/foods', 10);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!admin && !storedUser) {
            navigate('/admin-secret-login');
        }
    }, [admin, navigate]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await api.delete(`/foods/${id}`);
                refresh(); // Refresh list using hook
                toast.success("Food Item Deleted");
            } catch (error) {
                console.error(error);
                toast.error("Failed to delete item");
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/edit-item/${id}`);
    };

    // Check local storage one last time for render safety
    const isAuthenticated = admin || localStorage.getItem("user");

    if (!isAuthenticated) return null;

    return (
        <div className='w-full min-h-screen bg-gray-50 p-6 md:p-8 font-sans'>
            <div className='max-w-7xl mx-auto'>
                {/* Header Section */}
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
                    <div>
                        <h1 className='text-3xl font-extrabold font-heading text-gray-800 tracking-tight'>Food Item Management</h1>
                        <p className='text-gray-500 mt-1 text-sm'>Manage your restaurant's food items.</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/add-item')}
                        className='bg-gradient-to-r from-orange-500 to-pink-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:from-orange-600 hover:to-pink-600 transition-all shadow-md active:scale-95'
                    >
                        <FaPlus className="text-sm" />
                        <span className="font-semibold">Add New Item</span>
                    </button>
                </div>

                {/* Content Table */}
                <div className='bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden'>
                    <div className="overflow-x-auto">
                        <table className='w-full text-left border-collapse'>
                            <thead className='bg-gray-50/50 border-b border-gray-200'>
                                <tr>
                                    <th className='p-4 text-xs font-bold font-heading text-gray-500 uppercase tracking-wider w-24'>Image</th>
                                    <th className='p-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Name</th>
                                    <th className='p-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Category</th>
                                    <th className='p-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Price</th>
                                    <th className='p-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Description</th>
                                    <th className='p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-gray-500">Loading food items...</td>
                                    </tr>
                                ) : (
                                    <>
                                        {foods.map((food) => (
                                            <tr key={food._id} className='hover:bg-orange-50/30 transition-colors duration-200 group'>
                                                <td className='p-4'>
                                                    <div className="w-12 h-12 overflow-hidden rounded-lg shadow-sm border border-gray-200 shrink-0">
                                                        {food.image ? (
                                                            <img
                                                                src={`${server}/${food.image}`}
                                                                alt={food.name}
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
                                                    <p className="font-semibold font-heading text-gray-800 text-sm capitalize">{food.name}</p>
                                                </td>
                                                <td className='p-4'>
                                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded border border-blue-200">
                                                        {food.categoryId?.name || 'Uncategorized'}
                                                    </span>
                                                </td>
                                                <td className='p-4'>
                                                    <p className="font-bold font-heading text-gray-800 text-sm">₹{food.price}</p>
                                                </td>
                                                <td className='p-4'>
                                                    <p className="text-gray-500 text-sm truncate max-w-xs">{food.description || <span className="italic text-gray-300">No description</span>}</p>
                                                </td>
                                                <td className='p-4 text-right'>
                                                    <div className='flex justify-end gap-2 text-gray-400'>
                                                        <button
                                                            onClick={() => handleEdit(food._id)}
                                                            className='p-2 hover:bg-blue-100 hover:text-blue-600 rounded-full transition-colors'
                                                            title="Edit Item"
                                                        >
                                                            <FaEdit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(food._id)}
                                                            className='p-2 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors'
                                                            title="Delete Item"
                                                        >
                                                            <FaTrash size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {foods.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="p-12 text-center text-gray-400">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <FaUtensils size={40} className="text-gray-200" />
                                                        <p>No items found.</p>
                                                        <button
                                                            onClick={() => navigate('/admin/add-item')}
                                                            className="text-orange-500 hover:underline text-sm font-medium mt-2"
                                                        >
                                                            Add your first food item
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
                                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
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
        </div>
    );
};

export default AdminItem;
