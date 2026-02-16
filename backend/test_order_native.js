const http = require('http');

const data = JSON.stringify({
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
            discount: 10,
            tax: 5
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
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/orders',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log("Sending request to http://localhost:5000/api/orders");

const req = http.request(options, (res) => {
    let body = '';

    console.log(`Status Code: ${res.statusCode}`);

    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        try {
            console.log("Response Body:", body);
            const parsed = JSON.parse(body);
            if (res.statusCode === 201) {
                const order = parsed.order;
                console.log("Order Created ID:", order._id);
                console.log("Subtotal:", order.subtotal);
                console.log("Total Tax:", order.taxAmount);
                console.log("Total Discount:", order.discountAmount);
                console.log("Total Amount:", order.totalAmount);

                // Assertions
                const valid =
                    order.subtotal === 900 &&
                    order.discountAmount === 50 &&
                    order.taxAmount === 22.5 &&
                    order.totalAmount === 892.5;

                if (valid) {
                    console.log("VERIFICATION SUCCESS: All calculations match.");
                } else {
                    console.log("VERIFICATION FAILURE: Calculations mismatch.");
                }
            } else {
                console.log("Request failed with status:", res.statusCode);
            }
        } catch (e) {
            console.error("Failed to parse response:", e);
        }
    });
});

req.on('error', (error) => {
    console.error("Request Error:", error);
});

req.write(data);
req.end();
