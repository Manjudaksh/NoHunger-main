const express = require('express');
const router = express.Router();
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const upload = require('../middleware/upload');
const { protect, admin } = require('../middleware/authMiddleware');

// Create a category with image
router.post('/', protect, admin, upload, createCategory);

// Get all categories
router.get('/', getAllCategories);

// Get single category
router.get('/:id', getCategoryById);

// Update category with image
router.put('/:id', protect, admin, upload, updateCategory);

// Delete category
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;
