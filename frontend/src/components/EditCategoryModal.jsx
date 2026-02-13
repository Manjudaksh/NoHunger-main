import React, { useState, useEffect } from 'react';
import { FaTimes, FaCamera, FaTrash } from 'react-icons/fa';
import { api, server } from '../helpers/api';
import { toast } from 'react-toastify';

const EditCategoryModal = ({ isOpen, onClose, category, onUpdate }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [removeImage, setRemoveImage] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (category) {
            setName(category.name || '');
            setDescription(category.description || '');
            if (category.image) {
                setImagePreview(`${server}/${category.image}`);
                setRemoveImage(false);
            } else {
                setImagePreview(null);
                setRemoveImage(true); // Technically true if no image exists
            }
            setSelectedImage(null);
        }
    }, [category, isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
            setRemoveImage(false);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setSelectedImage(null);
        setRemoveImage(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);

            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            // Critical: Backend expects 'true' string or boolean that converts to string
            formData.append('removeImage', removeImage);

            const res = await api.put(`/categories/${category._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success("Category Updated Successfully");
            onUpdate(res.data); // Update parent state
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update category");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
                >
                    <FaTimes size={20} />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Category</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Section */}
                    <div className="flex flex-col items-center mb-4">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-400 text-sm">No Image</span>
                                )}
                            </div>

                            {/* Overlay Buttons */}
                            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                <label className="cursor-pointer text-white hover:text-blue-200 p-2">
                                    <FaCamera />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                                {imagePreview && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="text-white hover:text-red-200 p-2"
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Click to change</p>
                    </div>

                    {/* Inputs */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Category Name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Category Description"
                            rows="3"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition shadow-lg shadow-blue-500/30"
                        >
                            {loading ? 'Updating...' : 'Update Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCategoryModal;
