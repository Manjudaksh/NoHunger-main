const Food = require('../models/Food');
const fs = require('fs');
const path = require('path');

// @desc    Create a food item
// @route   POST /api/foods
// @access  Private/Admin
exports.createFood = async (req, res) => {
    try {
        const { name, description, price, categoryId, active } = req.body;

        const food = await Food.create({
            name,
            description,
            price,
            categoryId,
            active,
            image: req.file ? req.file.path : ''
        });

        res.status(201).json(food);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all food items
// @route   GET /api/foods
// @access  Public
const paginate = require('../utils/pagination');

// @desc    Get all food items
// @route   GET /api/foods
// @access  Public
exports.getAllFoods = async (req, res) => {
    try {
        const { skip, limit, getMetadata } = paginate(req.query);

        if (req.query.page || req.query.limit) {
            const foods = await Food.find()
                .populate('categoryId', 'name')
                .skip(skip)
                .limit(limit);
            const total = await Food.countDocuments();

            res.status(200).json({
                foods, // Changed key to match category controller's style (plural of resource) or standard 'data'
                ...getMetadata(total)
            });
        } else {
            const foods = await Food.find().populate('categoryId', 'name');
            res.status(200).json(foods);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get food items by category
// @route   GET /api/foods/category/:categoryId
// @access  Public
exports.getFoodsByCategory = async (req, res) => {
    try {
        const foods = await Food.find({ categoryId: req.params.categoryId });
        res.status(200).json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single food item
// @route   GET /api/foods/:id
// @access  Public
exports.getFoodById = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id).populate('categoryId', 'name');
        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }
        res.status(200).json(food);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update food item
// @route   PUT /api/foods/:id
// @access  Private/Admin
exports.updateFood = async (req, res) => {
    try {
        const { name, description, price, categoryId, active } = req.body;
        let food = await Food.findById(req.params.id);

        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }

        let imagePath = food.image;

        // Handle Image Update
        if (req.file) {
            // Delete old image if exists
            if (food.image && fs.existsSync(food.image)) {
                fs.unlinkSync(food.image);
            }
            imagePath = req.file.path;
        }

        food.name = name || food.name;
        food.description = description || food.description;
        food.price = price || food.price;
        food.categoryId = categoryId || food.categoryId;
        if (active !== undefined) food.active = active;
        food.image = imagePath;

        const updatedFood = await food.save();
        res.status(200).json(updatedFood);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete food item
// @route   DELETE /api/foods/:id
// @access  Private/Admin
exports.deleteFood = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);

        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }

        if (food.image && fs.existsSync(food.image)) {
            fs.unlinkSync(food.image);
        }

        await food.deleteOne();
        res.status(200).json({ message: 'Food removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
