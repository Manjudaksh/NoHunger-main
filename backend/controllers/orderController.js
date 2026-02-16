const Order = require('../models/Order');
const paginate = require('../utils/pagination');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { user, items } = req.body;

        // Calculate totals based on items
        let subtotal = 0;
        let totalDiscount = 0;
        let totalTax = 0;

        const processedItems = items.map(item => {
            const price = parseFloat(item.price);
            const qty = parseInt(item.qty);
            const discountPercent = parseFloat(item.discount || 0);
            const taxPercent = parseFloat(item.tax || 0);

            const discountAmount = price * (discountPercent / 100);
            const priceAfterDiscount = price - discountAmount;
            const taxAmountItem = priceAfterDiscount * (taxPercent / 100);
            // const finalPrice = priceAfterDiscount + taxAmountItem; // Per item final price

            subtotal += price * qty;
            totalDiscount += discountAmount * qty;
            totalTax += taxAmountItem * qty;

            return {
                ...item,
                discount: discountPercent,
                tax: taxPercent
            };
        });

        // Fixed delivery fee for now
        const deliveryFee = 20;

        const totalAmount = (subtotal - totalDiscount) + totalTax + deliveryFee;

        const newOrder = new Order({
            user,
            items: processedItems,
            subtotal,
            discountAmount: totalDiscount,
            taxAmount: totalTax,
            deliveryFee,
            isTaxApplied: totalTax > 0, // Set flag if tax exists
            totalAmount
        });

        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
        console.error("Create Order Error:", error);
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

// Toggle Tax for an Order (Admin Only)
exports.toggleOrderTax = async (req, res) => {
    try {
        const { id } = req.params;
        const { isTaxApplied } = req.body; // true or false

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Recalculate based on current items and stored subtotal
        // We can trust stored subtotal or recalculate it. Let's recalculate for safety or trust stored.
        // Trust stored subtotal for now as items don't change financially        
        let newTaxAmount = 0;
        if (isTaxApplied) {
            newTaxAmount = order.subtotal * 0.02; // 2% Tax
        }

        const newTotalAmount = order.subtotal + newTaxAmount + order.deliveryFee;

        // Update fields
        order.isTaxApplied = isTaxApplied;
        order.taxAmount = newTaxAmount;
        order.totalAmount = newTotalAmount;

        await order.save();

        res.status(200).json({ message: `Tax ${isTaxApplied ? 'enabled' : 'disabled'}`, order });
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
