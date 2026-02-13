const express = require('express');
const router = express.Router();
const {
    createFood,
    getAllFoods,
    getFoodsByCategory,
    deleteFood,
    getFoodById,
    updateFood
} = require('../controllers/foodController');
const upload = require('../middleware/upload');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, upload, createFood);
router.get('/', getAllFoods);
router.get('/category/:categoryId', getFoodsByCategory);
router.get('/:id', getFoodById);
router.put('/:id', protect, admin, upload, updateFood);
router.delete('/:id', protect, admin, deleteFood);

module.exports = router;
