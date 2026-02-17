const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'adminpassword';

async function runTest() {
    try {
        console.log("Starting Admin Discount Test...");

        // 1. Login
        console.log("1. Logging in as Admin...");
        let token;
        try {
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD
            });
            token = loginRes.data.token;
            console.log("   -> Logged in successfully.");
        } catch (e) {
            console.error("   -> Login Failed. Ensure seedAdminUser.js has run or credentials are correct.");
            throw e;
        }

        // 2. Create Order
        console.log("2. Creating Test Order...");
        const orderData = {
            user: { name: "Test User", email: "test@test.com", phone: "1234567890" },
            items: [{ foodId: "1", name: "Test Item", price: 100, qty: 1 }],
            deliveryFee: 0
        };
        const createRes = await axios.post(`${API_URL}/orders`, orderData);
        const orderId = createRes.data.order._id;
        const initialTotal = createRes.data.order.totalAmount;
        console.log(`   -> Order Created: ${orderId}, Initial Total: ${initialTotal}`);

        // 3. Apply Valid Discount
        console.log("3. Applying Valid Discount (10)...");
        const discountRes = await axios.put(
            `${API_URL}/orders/${orderId}/discount`,
            { adminDiscount: 10 },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const updatedOrder = discountRes.data.order;
        console.log(`   -> Updated Total: ${updatedOrder.totalAmount}`);
        console.log(`   -> Admin Discount: ${updatedOrder.adminDiscount}`);

        if (updatedOrder.adminDiscount === 10 && updatedOrder.totalAmount === initialTotal - 10) {
            console.log("   -> SUCCESS: Discount applied and total updated correctly.");
        } else {
            console.log("   -> FAILURE: Calculations incorrect.");
        }

        // 4. Test Invalid Discount (Negative)
        console.log("4. Testing Negative Discount (-5)...");
        try {
            await axios.put(
                `${API_URL}/orders/${orderId}/discount`,
                { adminDiscount: -5 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("   -> FAILURE: Negative discount should have been rejected.");
        } catch (e) {
            if (e.response && e.response.status === 400) {
                console.log("   -> SUCCESS: Negative discount rejected (400 Bad Request).");
            } else {
                console.log(`   -> FAILURE: Expected 400, got ${e.response ? e.response.status : e.message}`);
            }
        }

        // 5. Test Excessive Discount
        console.log("5. Testing Excessive Discount (1000)...");
        try {
            await axios.put(
                `${API_URL}/orders/${orderId}/discount`,
                { adminDiscount: 1000 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("   -> FAILURE: Excessive discount should have been rejected.");
        } catch (e) {
            if (e.response && e.response.status === 400) {
                console.log("   -> SUCCESS: Excessive discount rejected (400 Bad Request).");
            } else {
                console.log(`   -> FAILURE: Expected 400, got ${e.response ? e.response.status : e.message}`);
            }
        }

        console.log("Test Completed.");

    } catch (error) {
        console.error("Test Script Error:", error.message);
        if (error.response) console.error("Response Data:", error.response.data);
    }
}

runTest();
