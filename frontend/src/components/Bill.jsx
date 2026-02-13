import React, { useState, useEffect } from "react";
import { IoClose, IoPrintOutline } from "react-icons/io5";

const Bill = ({ items, onClose, isAdmin = false, customerDetails, orderDate }) => {
    const [includeTax, setIncludeTax] = useState(true);
    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const newSubtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
        setSubtotal(newSubtotal);

        const newTax = includeTax ? (newSubtotal * 0.18) : 0;
        setTax(newTax);

        setTotal(newSubtotal + newTax);
    }, [items, includeTax]);

    const handlePrint = () => {
        window.print();
    };

    const formattedDate = orderDate ? new Date(orderDate).toLocaleDateString() : new Date().toLocaleDateString();
    const formattedTime = orderDate ? new Date(orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 print:bg-white print:static print:h-auto print:backdrop-blur-none">
            <div className="bg-white w-[90%] md:w-[400px] rounded-sm shadow-2xl relative animate-fade-in-up print:shadow-none print:w-full print:p-0 font-mono text-sm border border-gray-200">

                {/* Close Button (Hidden in Print) */}
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 md:-right-10 text-white hover:text-red-400 transition-colors print:hidden"
                >
                    <IoClose size={32} />
                </button>

                {/* Receipt Content */}
                <div className="p-6 md:p-8 bg-white" id="receipt">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold font-heading text-gray-900 tracking-wider">NoHunger</h2>
                        <p className="text-gray-500 mt-1 uppercase text-xs tracking-widest">Fine Dining & Takeaway</p>
                        <p className="text-gray-400 text-xs mt-1">123, Flavor Street, Food City</p>

                        <div className="border-b-2 border-dashed border-gray-300 my-4"></div>

                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                            <div className="text-left">
                                <span className="block font-bold font-heading text-gray-700">Bill To:</span>
                                <span>{customerDetails?.name || "Guest"}</span>
                                {customerDetails?.phone && <span className="block">{customerDetails.phone}</span>}
                            </div>
                            <div className="text-right">
                                <span className="block">Date: {formattedDate}</span>
                                <span className="block">Time: {formattedTime}</span>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-4">
                        <table className="w-full text-left">
                            <thead className="border-b border-dashed border-gray-300">
                                <tr className="text-xs text-gray-500 font-heading uppercase">
                                    <th className="py-2 font-normal">Item</th>
                                    <th className="py-2 text-center font-normal">Qty</th>
                                    <th className="py-2 text-right font-normal">Price</th>
                                    <th className="py-2 text-right font-normal">Amt</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800">
                                {items.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-100 last:border-0">
                                        <td className="py-2 font-medium font-heading truncate max-w-[120px] capitalize">{item.name}</td>
                                        <td className="py-2 text-center">{item.qty}</td>
                                        <td className="py-2 text-right">₹{item.price}</td>
                                        <td className="py-2 text-right font-semibold">
                                            ₹{item.price * item.qty}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Separator */}
                    <div className="border-b-2 border-dashed border-gray-300 mb-4"></div>

                    {/* Summary */}
                    <div className="space-y-1 text-gray-600">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax {includeTax ? '(18%)' : '(0%)'}</span>
                            <span>₹{tax.toFixed(2)}</span>
                        </div>

                        <div className="border-b-2 border-dashed border-gray-300 my-2"></div>

                        <div className="flex justify-between text-gray-900 font-bold font-heading text-lg">
                            <span>TOTAL</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center space-y-2">
                        <p className="text-gray-800 font-semibold text-xs border-t border-b border-gray-200 py-2 inline-block px-4">THANK YOU FOR VISITING!</p>
                        <p className="text-[10px] text-gray-400">Please visit again</p>
                    </div>
                </div>

                {/* Actions (Hidden in Print) */}
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex gap-3 print:hidden rounded-b-sm">
                    <div className="flex items-center gap-2 flex-1">
                        <input
                            type="checkbox"
                            id="tax-toggle"
                            checked={includeTax}
                            onChange={() => setIncludeTax(!includeTax)}
                            className="w-4 h-4 text-gray-800 rounded focus:ring-gray-500 border-gray-300"
                        />
                        <label htmlFor="tax-toggle" className="text-xs text-gray-600 font-medium cursor-pointer select-none">
                            Add Tax (18%)
                        </label>
                    </div>

                    {isAdmin ? (
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                        >
                            <IoPrintOutline size={16} /> Print
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors shadow-sm"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>

            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #receipt, #receipt * { visibility: visible; }
                    #receipt {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 0;
                        border: none;
                        box-shadow: none;
                    }
                    @page { margin: 0; size: auto; }
                }
            `}</style>
        </div>
    );
};

export default Bill;
