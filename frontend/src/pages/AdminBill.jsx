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

    const endpoint = selectedDate ? `/orders?date=${selectedDate}` : '/orders';

    const {
        data: orders,
        loading,
        error,
        totalPages,
        currentPage,
        handlePageChange,
        refreshData,
        setData,
        setPage // Extract setPage to reset pagination on filter change
    } = usePagination(endpoint, 10);



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
    const [updatingStatus, setUpdatingStatus] = useState({});

    // Handle Status Update
    const toggleStatus = async (order) => {
        // Prevent multiple clicks or editing paid orders
        if (updatingStatus[order._id] || order.status === 1) return;

        try {
            // Set loading state for this specific order
            setUpdatingStatus(prev => ({ ...prev, [order._id]: true }));

            const newStatus = order.status === 1 ? 2 : 1; // Toggle 1 (Paid) <-> 2 (Unpaid)

            // Call API
            await api.put(`/orders/${order._id}/status`, { status: newStatus });

            // Update UI locally without refetching
            setData(prevOrders =>
                prevOrders.map(o =>
                    o._id === order._id ? { ...o, status: newStatus } : o
                )
            );

            toast.success(`Order marked as ${newStatus === 1 ? 'Paid' : 'Unpaid'}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update status");
        } finally {
            // Clear loading state
            setUpdatingStatus(prev => {
                const newState = { ...prev };
                delete newState[order._id];
                return newState;
            });
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
                            setPage(1); // Reset to first page when filter changes
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
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-4 py-3">Order ID</th>
                                <th className="px-4 py-3">Date & Time</th>
                                <th className="px-4 py-3">User Name</th>
                                <th className="px-4 py-3">Phone</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3 text-right">Amount</th>
                                <th className="px-4 py-3 text-center">Action</th>
                                <th className="px-4 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="p-8 text-center text-gray-500">Loading orders...</td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="8" className="p-8 text-center text-red-500">{error}</td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="p-8 text-center text-gray-400">No orders found.</td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors text-sm">
                                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{order.user?.name || "Unknown"}</td>
                                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{order.user?.phone || "N/A"}</td>
                                        <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate" title={order.user?.email || ""}>{order.user?.email || "N/A"}</td>
                                        <td className="px-4 py-3 font-bold text-gray-800 text-right">₹{order.totalAmount}</td>

                                        {/* Bill Button */}
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => setViewBill(order)}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-xs underline decoration-1 underline-offset-2 transition-colors"
                                            >
                                                View Bill
                                            </button>
                                        </td>

                                        {/* Paid Status Button */}
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => toggleStatus(order)}
                                                disabled={updatingStatus[order._id] || order.status === 1}
                                                title={order.status === 1 ? "Paid bills cannot be modified" : "Click to mark as Paid"}
                                                className={`
                                                    px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm border
                                                    ${updatingStatus[order._id]
                                                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-wait'
                                                        : order.status === 1
                                                            ? 'bg-green-50 text-green-600 border-green-200 cursor-not-allowed'
                                                            : 'bg-white text-red-600 border-red-200 hover:bg-red-50 cursor-pointer'}
                                                `}
                                            >
                                                {updatingStatus[order._id] ? '...' : (order.status === 1 ? 'Paid' : 'Unpaid')}
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
                    customerDetails={viewBill.user}
                    orderDate={viewBill.createdAt}
                    deliveryFee={20}
                    onClose={() => setViewBill(null)}
                    isAdmin={true}
                />
            )}
        </div>
    );
};

export default AdminBill;
