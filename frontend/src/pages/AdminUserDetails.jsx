import React, { useState, useEffect } from 'react';
import { api } from '../helpers/api';
import { toast } from 'react-toastify';
import { IoArrowBack, IoPeopleOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import usePagination from '../hooks/usePagination'; // Adjust path if necessary

const AdminUserDetails = () => {
    const navigate = useNavigate();

    // Use our global usePagination hook for the `/orders/unique-users` endpoint.
    const {
        data: users,
        loading,
        error,
        totalPages,
        page: currentPage,
        jumpToPage: handlePageChange,
        totalItems,
        limit,
        setLimit,
        setPage
    } = usePagination('/orders/unique-users', 10);

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                        <IoArrowBack size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">User Details</h1>
                </div>
            </div>

            {/* Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -z-10 opacity-60"></div>
                    <div className="p-3 bg-green-100/50 text-green-600 rounded-2xl mb-4">
                        <IoPeopleOutline size={32} />
                    </div>
                    <h3 className="text-gray-500 font-medium text-sm mb-1 uppercase tracking-wider">Total Unique Users</h3>
                    {loading ? (
                        <div className="h-9 w-16 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                        <p className="text-3xl font-bold text-gray-800">{totalItems}</p>
                    )}
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-4 text-left">Name</th>
                                <th className="px-6 py-4 text-left">Phone Number</th>
                                <th className="px-6 py-4 text-left">Email</th>
                                <th className="px-6 py-4 text-center">Total Orders</th>
                                <th className="px-6 py-4 text-right">Last Order Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">Loading users...</td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-red-500">{error}</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-400">No users found.</td>
                                </tr>
                            ) : (
                                users.map((user, index) => (
                                    <tr key={user._id || index} className="hover:bg-gray-50 transition-colors text-sm">
                                        <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">{user.name || "Unknown"}</td>
                                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{user.phone || "N/A"}</td>
                                        <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate" title={user.email || ""}>{user.email || "N/A"}</td>
                                        <td className="px-6 py-4 font-bold text-blue-600 text-center">{user.totalOrders}</td>
                                        <td className="px-6 py-4 text-right text-gray-500 text-xs">
                                            {user.lastOrderDate ? new Date(user.lastOrderDate).toLocaleDateString() : 'N/A'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {!loading && users.length > 0 && (
                    <div className="flex flex-col md:flex-row justify-between items-center p-6 border-t border-gray-100 bg-gray-50/30 gap-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                                Showing page <span className="font-semibold text-gray-700">{currentPage}</span> of <span className="font-semibold text-gray-700">{totalPages}</span>
                            </span>
                            <div className="flex items-center gap-2">
                                <label htmlFor="limit" className="text-sm text-gray-500">Rows per page:</label>
                                <select
                                    id="limit"
                                    value={limit}
                                    onChange={(e) => {
                                        setLimit(Number(e.target.value));
                                        setPage(1); // Reset to first page on limit change
                                    }}
                                    className="border border-gray-200 rounded-lg text-sm text-gray-700 p-1 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition shadow-sm"
                            >
                                Previous
                            </button>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition shadow-sm"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUserDetails;
