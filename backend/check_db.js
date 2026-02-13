const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Food = require('./models/Food');

dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const categoryCount = await Category.countDocuments();
        const foodCount = await Food.countDocuments();

        console.log(`Categories: ${categoryCount}`);
        console.log(`Foods: ${foodCount}`);

        if (foodCount > 0) {
            const food = await Food.findOne();
            console.log("Single Food Item:", {
                name: food.name,
                image: food.image
            });
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkData();
