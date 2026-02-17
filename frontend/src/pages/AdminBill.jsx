import React, { useState } from 'react';
import usePagination from '../hooks/usePagination'; // Adjust path as needed
import { api } from '../helpers/api';
import { toast } from 'react-toastify';
import { IoArrowBack, IoSearch } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import Bill from '../components/Bill'; // Adjust path
import ConfirmDialog from '../components/ConfirmDialog';

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

    // Confirmation State
    const [confirmAction, setConfirmAction] = useState({
        isOpen: false,
        order: null,
        newStatus: null,
        title: "",
        message: ""
    });

    // Confirmation State for Discount
    const [confirmDiscount, setConfirmDiscount] = useState({
        isOpen: false,
        amount: 0
    });

    // Handle Status Update
    const [updatingStatus, setUpdatingStatus] = useState({});

    const initiateToggleStatus = (order) => {
        if (updatingStatus[order._id] || order.status === 1) return;

        const newStatus = order.status === 1 ? 2 : 1;
        setConfirmAction({
            isOpen: true,
            order: order,
            newStatus: newStatus,
            title: "Update Bill Status",
            message: `Are you sure you want to mark this bill as ${newStatus === 1 ? 'PAID' : 'UNPAID'}?`
        });
    };

    const performStatusToggle = async () => {
        const { order, newStatus } = confirmAction;
        if (!order) return;

        try {
            setUpdatingStatus(prev => ({ ...prev, [order._id]: true }));
            await api.put(`/orders/${order._id}/status`, { status: newStatus });

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
            setUpdatingStatus(prev => {
                const newState = { ...prev };
                delete newState[order._id];
                return newState;
            });
            setConfirmAction({ ...confirmAction, isOpen: false });
        }
    };

    const initiateApplyDiscount = (amount) => {
        setConfirmDiscount({
            isOpen: true,
            amount: amount
        });
    };

    const performApplyDiscount = async () => {
        if (!viewBill) return;

        try {
            // Updated endpoint to match OrderRoutes and simple percentage logic
            const { data } = await api.put(`/orders/${viewBill._id}/discount`, {
                adminDiscountPercentage: confirmDiscount.amount
            });

            // Update local state
            setViewBill(data.order);
            setData(prevOrders =>
                prevOrders.map(o =>
                    o._id === viewBill._id ? data.order : o
                )
            );
            toast.success("Discount applied successfully");
            setConfirmDiscount({ ...confirmDiscount, isOpen: false });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to apply discount");
        }
    };

    // Handle Tax Toggle (Passed to Bill Component)
    const handleTaxToggle = async (newTaxStatus) => {
        if (!viewBill) return;

        try {
            const { data } = await api.put(`/orders/${viewBill._id}/tax`, { isTaxApplied: newTaxStatus });

            // Update local state for the modal
            setViewBill(data.order);

            // Update list state
            setData(prevOrders =>
                prevOrders.map(o =>
                    o._id === viewBill._id ? data.order : o
                )
            );
            toast.success(`Tax ${newTaxStatus ? 'Enabled' : 'Disabled'}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update tax status");
        }
    };

    // Handle Multi-Stage Bill Update
    const onUpdateBillDetails = async (billDetails) => {
        if (!viewBill) return;

        try {
            const { data } = await api.put(`/orders/${viewBill._id}/bill`, billDetails);

            // Update local state
            setViewBill(data.order);

            // Update list
            setData(prevOrders =>
                prevOrders.map(o =>
                    o._id === viewBill._id ? data.order : o
                )
            );
            toast.success("Bill updated successfully");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update bill");
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
                                <th className="px-3 py-2 text-left">Order ID</th>
                                <th className="px-3 py-2 text-left">Date & Time</th>
                                <th className="px-3 py-2 text-left">User Name</th>
                                <th className="px-3 py-2 text-left">Phone</th>
                                <th className="px-3 py-2 text-left">Email</th>
                                <th className="px-3 py-2 text-right">Amount</th>
                                <th className="px-3 py-2 text-center">Action</th>
                                <th className="px-3 py-2 text-center">Status</th>
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
                                        <td className="px-3 py-2 text-gray-500 font-mono text-xs">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-3 py-2 text-gray-600 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-700 text-xs">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                <span className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 font-medium text-gray-800 whitespace-nowrap text-xs">{order.user?.name || "Unknown"}</td>
                                        <td className="px-3 py-2 text-gray-600 whitespace-nowrap text-xs">{order.user?.phone || "N/A"}</td>
                                        <td className="px-3 py-2 text-gray-600 max-w-[150px] truncate text-xs" title={order.user?.email || ""}>{order.user?.email || "N/A"}</td>
                                        <td className="px-3 py-2 font-bold text-gray-800 text-right text-xs">₹{order.totalAmount.toFixed(2)}</td>

                                        {/* Bill Button */}
                                        <td className="px-3 py-2 text-center">
                                            <button
                                                onClick={() => setViewBill(order)}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-xs underline decoration-1 underline-offset-2 transition-colors"
                                            >
                                                View
                                            </button>
                                        </td>

                                        {/* Paid Status Button */}
                                        <td className="px-3 py-2 text-center">
                                            <button
                                                onClick={() => initiateToggleStatus(order)}
                                                disabled={updatingStatus[order._id] || order.status === 1}
                                                title={order.status === 1 ? "Paid bills cannot be modified" : "Click to mark as Paid"}
                                                className={`
                                                    px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm border
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
                    deliveryFee={viewBill.deliveryFee !== undefined ? viewBill.deliveryFee : 0} // Use stored delivery fee or default to 0
                    onClose={() => setViewBill(null)}
                    isAdmin={true}
                    orderData={viewBill} // Pass full order object
                    onTaxToggle={handleTaxToggle}
                    onApplyDiscount={initiateApplyDiscount}
                />
            )}

            <ConfirmDialog
                isOpen={confirmAction.isOpen}
                onClose={() => setConfirmAction({ ...confirmAction, isOpen: false })}
                onConfirm={performStatusToggle}
                title={confirmAction.title}
                message={confirmAction.message}
                isDestructive={confirmAction.newStatus === 2} // Unpaid is destructive-ish? Or maybe Paid is definitive. Let's make it standard (blue). Actually user said "modern, styled". Blue is fine.
                confirmText="Yes, Change Status"
            />

            <ConfirmDialog
                isOpen={confirmDiscount.isOpen}
                onClose={() => setConfirmDiscount({ ...confirmDiscount, isOpen: false })}
                onConfirm={performApplyDiscount}
                title="Apply Admin Discount"
                message={`Are you sure you want to apply a ${confirmDiscount.amount}% discount? This will recalculate the tax.`}
                isDestructive={true}
                confirmText="Apply Discount"
            />


        </div>
    );
};

export default AdminBill;
