const axios = require('axios');

const API_URL = 'http://localhost:4000/api/orders'; // Assuming default port
const SAMPLE_ORDER = {
    user: {
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890"
    },
    items: [
        {
            foodId: "food1",
            name: "Pizza",
            price: 500,
            qty: 1,
            discount: 10, // 10% = 50 discount. Price after disc = 450.
            tax: 5        // 5% of 450 = 22.5. Final = 472.5
        },
        {
            foodId: "food2",
            name: "Burger",
            price: 200,
            qty: 2,
            discount: 0,
            tax: 0
        }
    ],
    deliveryFee: 20
};

// Expected:
// Item 1: 500 * 1. Disc: 50. Tax: 22.5. Total: 472.5
// Item 2: 200 * 2 = 400. Disc: 0. Tax: 0. Total: 400.
// Subtotal: 500 + 400 = 900.
// Total Discount: 50.
// Total Tax: 22.5.
// Delivery: 20.
// Grand Total: (900 - 50) + 22.5 + 20 = 892.5.

async function testOrder() {
    try {
        console.log("Sending order...");
        const response = await axios.post(API_URL, SAMPLE_ORDER);
        const order = response.data.order;

        console.log("Order Created:", order._id);
        console.log("Subtotal:", order.subtotal, "(Expected: 900)");
        console.log("Discount Amount:", order.discountAmount, "(Expected: 50)");
        console.log("Tax Amount:", order.taxAmount, "(Expected: 22.5)");
        console.log("Total Amount:", order.totalAmount, "(Expected: 892.5)");

        console.log("Item 1 Discount:", order.items[0].discount, "(Expected: 10)");
        console.log("Item 1 Tax:", order.items[0].tax, "(Expected: 5)");

        if (order.subtotal === 900 && order.discountAmount === 50 && order.taxAmount === 22.5 && order.totalAmount === 892.5) {
            console.log("SUCCESS: Calculations match.");
        } else {
            console.log("FAILURE: Calculations do not match.");
        }

    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

testOrder();
