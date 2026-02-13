const Category = require('../models/Category');
const fs = require('fs');
const path = require('path');

// @desc    Create a category
// @route   POST /api/categories
// @access  Public
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        console.log(req.body);

        const category = await Category.create({
            name,
            description,
            image: req.file ? req.file.path.replace(/\\/g, "/") : ''
        });

        console.log("New Category Created:", category);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const paginate = require('../utils/pagination');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getAllCategories = async (req, res) => {
    try {
        const { skip, limit, getMetadata } = paginate(req.query);

        // Always paginate for consistency, or check if query params exist if you strictly want to support non-paginated
        // Replicating previous logic: if page/limit exists, paginate. Else return all.
        // Using the utility's default behavior, it will default to page 1 limit 10 if not present, which changes behavior from "return all".
        // To strictly maintain "return all if no params", we can check req.query.page

        if (req.query.page || req.query.limit) {
            const categories = await Category.find().skip(skip).limit(limit);
            const total = await Category.countDocuments();

            res.status(200).json({
                categories,
                ...getMetadata(total)
            });
        } else {
            // No pagination (backward compatibility)
            const categories = await Category.find();
            res.status(200).json(categories);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Public
exports.updateCategory = async (req, res) => {
    try {
        const { name, description, removeImage } = req.body;
        let category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        let imagePath = category.image;

        console.log("Update Body:", req.body);
        console.log("Update File:", req.file);

        // Handle Image Update or Removal
        if (req.file) {
            // New image uploaded: Delete old image if exists
            if (category.image && fs.existsSync(category.image)) {
                try {
                    fs.unlinkSync(category.image);
                } catch (err) {
                    console.error("Failed to delete old image:", err);
                }
            }
            imagePath = req.file.path.replace(/\\/g, "/");
        } else if (removeImage === 'true') {
            // Explicit removal requested: Delete old image if exists
            if (category.image && fs.existsSync(category.image)) {
                try {
                    fs.unlinkSync(category.image);
                } catch (err) {
                    console.error("Failed to delete old image:", err);
                }
            }
            imagePath = ''; // Or null, depending on your schema. Empty string is safer for file paths usually.
        }

        category.name = name || category.name;
        category.description = description || category.description;
        category.image = imagePath;

        const updatedCategory = await category.save();
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Public
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Delete image
        if (category.image && fs.existsSync(category.image)) {
            fs.unlinkSync(category.image);
        }

        await category.deleteOne();
        res.status(200).json({ message: 'Category removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
