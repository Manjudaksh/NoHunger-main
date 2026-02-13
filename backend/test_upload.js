const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const uploadCategory = async () => {
    try {
        const form = new FormData();
        form.append('name', 'Test Category');
        form.append('description', 'This is a test category');

        // Create a dummy image file if it doesn't exist
        const imagePath = path.join(__dirname, 'test_image.jpg');
        if (!fs.existsSync(imagePath)) {
            fs.writeFileSync(imagePath, 'dummy image content');
        }

        form.append('image', fs.createReadStream(imagePath));

        const response = await axios.post('http://localhost:5000/api/categories', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log('Upload successful:', response.data);
    } catch (error) {
        console.error('Upload failed:', error.response ? error.response.data : error.message);
    }
};

uploadCategory();
