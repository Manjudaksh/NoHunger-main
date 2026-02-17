const axios = require('axios');

const API_URL = 'http://localhost:5000/api/orders';
const LOGIN_URL = 'http://localhost:5000/api/auth/login';

async function testAdminDiscountLogic() {
    try {
        console.log("Starting Admin Discount Logic Test...");

        // 0. Login as Admin
        console.log("Logging in as Admin...");
        const loginRes = await axios.post(LOGIN_URL, {
            email: 'admin@example.com',
            password: 'adminpassword'
        });
        const token = loginRes.data.token;
        console.log("Login Successful. Token received.");

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // 1. Create Order (Public)
        const orderData = {
            user: { name: "Test User", email: "test@example.com", phone: "9998887776" },
            items: [
                { foodId: "f1", name: "Item 1", price: 1000, qty: 1, discount: 0, tax: 5 }, // 1000 + 50(tax) = 1050
                { foodId: "f2", name: "Item 2", price: 500, qty: 2, discount: 10, tax: 0 }  // (500-50)*2 = 900. No Tax.
            ],
            deliveryFee: 0
        };

        // Expected:
        // Item 1: Price 1000, Tax 5% = 50.
        // Item 2: Price 1000, Disc 10% = 100. Net 900.
        // Subtotal (Gross): 2000.
        // Discount: 100.
        // Order Total (Net): 1900.
        // Tax: 50.
        // Pay You Amount: 1900 + 50 = 1950.

        console.log("Creating Order...");
        const createRes = await axios.post(API_URL, orderData);
        let order = createRes.data.order;
        const orderId = order._id;
        console.log(`Order Created: ${orderId}`);

        // Verify Initial State
        const expectedPayYou = 1950;
        if (order.totalAmount !== expectedPayYou) {
            console.error(`FAILURE: Initial Total Mismatch. Expected ${expectedPayYou}, got ${order.totalAmount}`);
            return;
        } else {
            console.log(`SUCCESS: Initial Total Correct (${order.totalAmount})`);
        }

        // 2. Apply Admin Discount (e.g., 10%)
        // New Logic: Apply on PayYouAmount (1950).
        // Discount Amount = 1950 * 0.10 = 195.
        // Final Total = 1950 - 195 = 1755.

        console.log("Applying Admin Discount 10%...");
        const discRes = await axios.put(`${API_URL}/${orderId}/discount`, { adminDiscountPercentage: 10 }, config);
        order = discRes.data.order;

        console.log(`Admin Discount Amount: ${order.adminDiscount} (Expected: 195)`);
        console.log(`Final Total: ${order.totalAmount} (Expected: 1755)`);
        console.log(`Tax Amount: ${order.taxAmount} (Expected: 50)`);

        if (order.adminDiscount === 195 && order.totalAmount === 1755 && order.taxAmount === 50) {
            console.log("SUCCESS: Admin Discount Logic Correct.");
        } else {
            console.error("FAILURE: Admin Discount Logic Incorrect.");
        }

        // 3. Toggle Tax Off
        // Pay You Amount becomes: 1900 (Tax removed).
        // Admin Discount (10%): 190.
        // Final Total: 1900 - 190 = 1710.

        console.log("Toggling Tax OFF...");
        const taxOffRes = await axios.put(`${API_URL}/${orderId}/tax`, { isTaxApplied: false }, config);
        order = taxOffRes.data.order;

        console.log(`Tax Amount: ${order.taxAmount} (Expected: 0)`);
        console.log(`Admin Discount Amount: ${order.adminDiscount} (Expected: 190)`);
        console.log(`Final Total: ${order.totalAmount} (Expected: 1710)`);

        if (order.taxAmount === 0 && order.adminDiscount === 190 && order.totalAmount === 1710) {
            console.log("SUCCESS: Tax Toggle (OFF) Logic Correct.");
        } else {
            console.error("FAILURE: Tax Toggle (OFF) Logic Incorrect.");
        }

        // 4. Toggle Tax Back ON
        // Should return to State 2.
        console.log("Toggling Tax ON...");
        const taxOnRes = await axios.put(`${API_URL}/${orderId}/tax`, { isTaxApplied: true }, config);
        order = taxOnRes.data.order;

        if (order.adminDiscount === 195 && order.totalAmount === 1755 && order.taxAmount === 50) {
            console.log("SUCCESS: Tax Toggle (ON) Logic Correct.");
        } else {
            console.error("FAILURE: Tax Toggle (ON) Logic Incorrect.");
        }

    } catch (error) {
        console.error("TEST FAILED:", error.message);
        if (error.response) console.error("Response Data:", error.response.data);
    }
}

testAdminDiscountLogic();
