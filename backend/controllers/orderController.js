const Order = require('../models/Order');
const paginate = require('../utils/pagination');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { user, items, totalAmount } = req.body;

        const newOrder = new Order({
            user,
            items,
            totalAmount
        });

        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders (with pagination and optional date filter)
exports.getAllOrders = async (req, res) => {
    try {
        const { skip, limit, getMetadata } = paginate(req.query);
        const { date } = req.query;

        let query = {};

        // Date filter (matches the entire day)
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            query.createdAt = {
                $gte: startDate,
                $lte: endDate
            };
        }

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments(query);

        res.status(200).json({
            orders,
            ...getMetadata(total)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order status (Paid/Unpaid)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
