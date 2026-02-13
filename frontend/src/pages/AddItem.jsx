import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataContext } from '../context/UserContext';
import { api } from '../helpers/api';
import { toast } from 'react-toastify';
import { FaUtensils } from 'react-icons/fa';

const AddItem = () => {
    const { admin } = useContext(dataContext);
    const navigate = useNavigate();

    const [itemName, setItemName] = useState("");
    const [itemDesc, setItemDesc] = useState("");
    const [itemPrice, setItemPrice] = useState("");
    const [itemImage, setItemImage] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!admin && !storedUser) {
            navigate('/admin-secret-login');
        } else {
            fetchCategories();
        }
    }, [admin, navigate]);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data.categories || res.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", itemName);
        formData.append("description", itemDesc);
        formData.append("price", itemPrice);
        formData.append("categoryId", selectedCategoryId);
        if (itemImage) formData.append("image", itemImage);

        try {
            setLoading(true);
            await api.post("/foods", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Item added successfully");
            navigate('/admin/item'); // Redirect to listing page
        } catch (error) {
            toast.error("Failed to add item");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans flex justify-center items-center">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><FaUtensils /></span>
                    Add New Food Item
                </h2>
                <form onSubmit={handleAddItem} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Item Name</label>
                            <input
                                type="text"
                                required
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                placeholder="e.g. Cheese Burger"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Price (₹)</label>
                            <input
                                type="number"
                                required
                                value={itemPrice}
                                onChange={(e) => setItemPrice(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                placeholder="e.g. 199"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Category</label>
                            <select
                                required
                                value={selectedCategoryId}
                                onChange={(e) => setSelectedCategoryId(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-white"
                            >
                                <option value="">Select a Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Image (Optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setItemImage(e.target.files[0])}
                                className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Description</label>
                        <textarea
                            rows="3"
                            required
                            value={itemDesc}
                            onChange={(e) => setItemDesc(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                            placeholder="Item description..."
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:translate-y-px transition-all disabled:opacity-70"
                    >
                        {loading ? 'Adding...' : 'Add Food Item'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/item')}
                        className="w-full py-3.5 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddItem;
