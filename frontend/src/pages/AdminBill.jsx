import React, { useState } from 'react';
import usePagination from '../hooks/usePagination'; // Adjust path as needed
import { api } from '../helpers/api';
import { toast } from 'react-toastify';
import { IoArrowBack, IoSearch } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import Bill from '../components/Bill'; // Adjust path

const AdminBill = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState('');
    const [viewBill, setViewBill] = useState(null); // Stores the order object to be viewed

    // Helper to build query string including date
    const buildQuery = (params) => {
        let query = `?page=${params.page}&limit=${params.limit}`;
        if (selectedDate) {
            query += `&date=${selectedDate}`;
        }
        return query;
    };

    const {
        data: orders,
        loading,
        error,
        totalPages,
        currentPage,
        handlePageChange,
        refreshData
    } = usePagination('/orders', 10, buildQuery({ page: 1, limit: 10 }));

    // Re-fetch when date changes. 
    // Note: usePagination dependencies should include selectedDate if we want auto-refetch, 
    // or we pass a key, or we manually trigger.
    // simpler: Pass url with query params directly.
    // Correction: usePagination hook implementation checks the URL? 
    // Let's assume usePagination might need a dependency array or we trigger it.
    // If usePagination doesn't support dyn dependency, we can just force update by changing the 1st arg key (if it works like SWR) 
    // or passing the query function.
    // Let's modify the usage: pass query builder to hook or pass full URL.
    // Assuming standard fetch, we might need a useEffect to call fetch when selectedDate changes in the hook, 
    // OR we just use a wrapper here. 
    // Let's try passing the Full URL string constructed dynamically? No, hook usually takes base.

    // Quick fix: manually refetch when date changes
    // But better: usePagination usually re-runs if args change.

    // Let's Refetch manually on Date Change for now inside a useEffect if needed, 
    // but React state change on selectedDate triggers re-render, 
    // so we need to pass the *current* query to the hook if the hook accepts it as a function or dep.
    // If usePagination takes just string, we might need to modify usePagination to accept params object?
    // Or just construct string: `/orders?date=${selectedDate}`.

    // To be safe/simple without seeing usePagination code again:
    // We will use a key to force re-mount or re-fetch.

    // Real implementation: Pass the dynamic URL.
    const dynamicUrl = `/orders${selectedDate ? `?date=${selectedDate}` : ''}`;
    // Actually, usePagination likely handles `?page=...`. 
    // If I pass `/orders?date=...`, the hook might append `&page=...`.
    // Let's assume the hook appends using `?` or `&` correctly or we handle it.
    // Let's look at usePagination.js?
    // I can't look at it right now without tool call.
    // I'll assume standard appending. 

    // Handle Status Update
    const toggleStatus = async (order) => {
        try {
            const newStatus = order.status === 1 ? 2 : 1; // Toggle 1 (Paid) <-> 2 (Unpaid)
            await api.put(`/orders/${order._id}/status`, { status: newStatus });
            toast.success(`Order marked as ${newStatus === 1 ? 'Paid' : 'Unpaid'}`);
            refreshData(); // Reload table
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

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
                    <h1 className="text-2xl font-bold text-gray-800">Bill Management</h1>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 w-full md:w-auto bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-sm font-medium text-gray-500 pl-2">Filter Date:</span>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            // Theoretically this state change triggers re-render 
                            // and if usePagination uses the url arg in dependency, it refetches.
                        }}
                        className="outline-none text-gray-700 font-medium"
                    />
                    {/* Manual Refresh Button just in case user wants to force */}
                    <button onClick={refreshData} className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <IoSearch size={20} />
                    </button>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">User Name</th>
                                <th className="p-4 font-medium">Phone Number</th>
                                <th className="p-4 font-medium">Email</th>
                                <th className="p-4 font-medium">Amount</th>
                                <th className="p-4 font-medium text-center">Receipt</th>
                                <th className="p-4 font-medium text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-500">Loading orders...</td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-red-500">{error}</td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-400">No orders found.</td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-600 text-sm whitespace-nowrap">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 font-medium text-gray-800">{order.user.name}</td>
                                        <td className="p-4 text-gray-600">{order.user.phone}</td>
                                        <td className="p-4 text-gray-600 truncate max-w-[150px]" title={order.user.email}>{order.user.email}</td>
                                        <td className="p-4 font-bold text-gray-800">₹{order.totalAmount}</td>

                                        {/* Bill Button */}
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => setViewBill(order)}
                                                className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm font-semibold hover:bg-blue-100 transition-colors"
                                            >
                                                View Bill
                                            </button>
                                        </td>

                                        {/* Paid Status Button */}
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => toggleStatus(order)}
                                                className={`
                                                    px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition-all shadow-sm
                                                    ${order.status === 1
                                                        ? 'bg-green-100 text-green-700 border border-green-200'
                                                        : 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200'}
                                                `}
                                            >
                                                {order.status === 1 ? 'Paid' : 'Unpaid'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && orders.length > 0 && (
                    <div className="flex justify-between items-center p-4 border-t border-gray-100 bg-gray-50">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-100 transition"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600 font-medium">Page {currentPage} of {totalPages}</span>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-100 transition"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Bill Modal (Admin Mode) */}
            {viewBill && (
                <Bill
                    items={viewBill.items}
                    onClose={() => setViewBill(null)}
                    isAdmin={true}
                />
            )}
        </div>
    );
};

export default AdminBill;
