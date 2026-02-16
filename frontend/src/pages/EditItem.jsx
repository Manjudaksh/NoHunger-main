import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dataContext } from '../context/UserContext';
import { api, server } from '../helpers/api';
import { toast } from 'react-toastify';
import { FaEdit, FaArrowLeft, FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import ConfirmDialog from '../components/ConfirmDialog';

const EditItem = () => {
    const { admin } = useContext(dataContext);
    const navigate = useNavigate();
    const { id } = useParams();

    const [itemName, setItemName] = useState("");
    const [itemDesc, setItemDesc] = useState("");
    const [itemPrice, setItemPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [tax, setTax] = useState("");
    const [itemImage, setItemImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [active, setActive] = useState(true);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!admin && !storedUser) {
            navigate('/admin-secret-login');
        } else {
            fetchCategories();
            fetchItemDetails();
        }
    }, [admin, navigate, id]);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data.categories || res.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const fetchItemDetails = async () => {
        try {
            const res = await api.get(`/foods/${id}`);
            const item = res.data;
            setItemName(item.name);
            setItemDesc(item.description);
            setItemPrice(item.price);
            setDiscount(item.discount || 0);
            setTax(item.tax || 0);
            setSelectedCategoryId(item.categoryId?._id || item.categoryId);
            setActive(item.active !== undefined ? item.active : true);
            if (item.image) {
                setPreview(`${server}/${item.image}`);
            }
        } catch (error) {
            console.error("Failed to fetch item details", error);
            toast.error("Failed to load item details");
            navigate('/admin/item');
        } finally {
            setFetching(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setItemImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdateItem = async (e) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const confirmUpdateItem = async () => {
        const formData = new FormData();
        formData.append("name", itemName);
        formData.append("description", itemDesc);
        formData.append("price", itemPrice);
        formData.append("discount", discount);
        formData.append("tax", tax);
        formData.append("categoryId", selectedCategoryId);
        formData.append("active", active);
        if (itemImage) formData.append("image", itemImage);

        try {
            setLoading(true);
            await api.put(`/foods/${id}`, formData);
            toast.success("Item updated successfully");
            navigate('/admin/item');
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update item");
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans flex justify-center items-center">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-fade-in-up">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/admin/item')}
                        className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <FaArrowLeft /> Back to Items
                    </button>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={active}
                            onChange={() => setActive(!active)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900">{active ? 'Active' : 'Inactive'}</span>
                    </label>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Update Food Item</h2>

                <form onSubmit={handleUpdateItem} className="space-y-6">


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Item Name</label>
                            <input
                                type="text"
                                required
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
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
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Discount (%)</label>
                            <input
                                type="number"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                placeholder="e.g. 10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Tax (%)</label>
                            <input
                                type="number"
                                value={tax}
                                onChange={(e) => setTax(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                placeholder="e.g. 5"
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
                            <label className="text-sm font-semibold text-gray-700">Image</label>
                            <div className="relative group">
                                <label className="flex items-center justify-center w-full p-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all">
                                    <div className="flex items-center gap-2 text-gray-500 group-hover:text-orange-600">
                                        <FaCloudUploadAlt />
                                        <span className="text-sm">Change Image</span>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Image Preview */}
                    {preview && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Description</label>
                        <textarea
                            rows="3"
                            required
                            value={itemDesc}
                            onChange={(e) => setItemDesc(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                        ></textarea>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:translate-y-px transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Updating...' : 'Update Item'}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.4s ease-out forwards;
                }
            `}</style>

            <ConfirmDialog
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={confirmUpdateItem}
                title="Update Item?"
                message="Are you sure you want to update the details of this food item?"
                confirmText="Yes, Update"
            />
        </div>
    );
};

export default EditItem;
