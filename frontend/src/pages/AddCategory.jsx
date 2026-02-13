import React, { useState, useContext, useEffect } from "react";
import { api } from "../helpers/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { dataContext } from "../context/UserContext";
import { FaCloudUploadAlt, FaShapes, FaArrowLeft, FaTimes } from "react-icons/fa";

const AddCategory = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { admin } = useContext(dataContext);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!admin && !storedUser) {
            navigate('/admin-secret-login');
        }
    }, [admin, navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setErrors({ ...errors, image: null });
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreview(null);
    };

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = "Category name is required";
        if (name.length < 3) newErrors.name = "Name must be at least 3 characters";
        // Image is optional based on previous requirements, so no error here unless strictly required again.
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        if (image) {
            formData.append("image", image);
        }

        try {
            const res = await api.post("/categories", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.status === 201) {
                toast.success("Category added successfully");
                navigate("/admin/category");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to add category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans flex items-center justify-center">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-fade-in-up">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/admin/category')}
                        className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <FaArrowLeft /> Back to Categories
                    </button>
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                        <FaShapes />
                    </div>
                </div>

                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Add New Category</h2>
                    <p className="text-gray-500 mt-2">Create a new category to organize your menu items.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 block">
                            Category Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) setErrors({ ...errors, name: null });
                            }}
                            className={`w-full p-3 rounded-lg border ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-purple-500'} focus:ring-2 focus:border-transparent outline-none transition-all`}
                            placeholder="e.g. Beverages"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Description Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 block">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                            placeholder="Describe this category..."
                        ></textarea>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 block">Category Image</label>

                        {!preview ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-purple-400 transition-all relative group">
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="p-4 bg-purple-50 text-purple-600 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                    <FaCloudUploadAlt size={24} />
                                </div>
                                <p className="text-gray-700 font-medium">Click to upload image</p>
                                <p className="text-gray-400 text-xs mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                            </div>
                        ) : (
                            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 group">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                                    >
                                        <FaTimes size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:translate-y-px transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                "Create Category"
                            )}
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
        </div>
    );
};

export default AddCategory;
