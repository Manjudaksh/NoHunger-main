const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Food = require('./models/Food');
const Category = require('./models/Category');

dotenv.config();

const food_items = [
    { "food_name": "Pancakes", "food_category": "breakfast", "type": "veg", "price": 499, "image": "/assets/image1.jpg" },
    { "food_name": "Chicken Soup", "food_category": "soups", "type": "non_veg", "price": 399, "image": "/assets/image2.png" },
    { "food_name": "Minestrone Soup", "food_category": "soups", "type": "veg", "price": 349, "image": "/assets/image3.jpg" },
    { "food_name": "Spaghetti Carbonara", "food_category": "pasta", "type": "non_veg", "price": 999, "image": "/assets/image4.webp" },
    { "food_name": "Veg Alfredo Pasta", "food_category": "pasta", "type": "veg", "price": 899, "image": "/assets/image5.jpeg" },
    { "food_name": "Chicken Alfredo Pasta", "food_category": "pasta", "type": "non_veg", "price": 1099, "image": "/assets/image6.avif" },
    { "food_name": "Paneer Butter Masala", "food_category": "main_course", "type": "veg", "price": 799, "image": "/assets/image7.jpg" },
    { "food_name": "Chicken Biryani", "food_category": "main_course", "type": "non_veg", "price": 1199, "image": "/assets/image8.webp" },
    { "food_name": "Margherita Pizza", "food_category": "pizza", "type": "veg", "price": 649, "image": "/assets/image9.jpeg" },
    { "food_name": "Pepperoni Pizza", "food_category": "pizza", "type": "non_veg", "price": 749, "image": "/assets/image10.jpg" },
    { "food_name": "Veggie Burger", "food_category": "burger", "type": "veg", "price": 499, "image": "/assets/image11.jpeg" },
    { "food_name": "Chicken Burger", "food_category": "burger", "type": "non_veg", "price": 599, "image": "/assets/image12.jpg" },
    { "food_name": "Tomato Soup", "food_category": "soups", "type": "veg", "price": 299, "image": "/assets/image13.jpg" },
    { "food_name": "Egg Sandwich", "food_category": "breakfast", "type": "non_veg", "price": 349, "image": "/assets/image14.webp" },
    { "food_name": "Mushroom Soup", "food_category": "soups", "type": "veg", "price": 349, "image": "/assets/image15.jpg" },
    { "food_name": "Chicken Tikka Masala", "food_category": "main_course", "type": "non_veg", "price": 1199, "image": "/assets/image16.jpg" },
    { "food_name": "Cheese Omelette", "food_category": "breakfast", "type": "non_veg", "price": 399, "image": "/assets/image17.jpeg" },
    { "food_name": "Fettuccine Alfredo", "food_category": "pasta", "type": "veg", "price": 949, "image": "/assets/image18.jpg" },
    { "food_name": "Garlic Bread", "food_category": "pizza", "type": "veg", "price": 299, "image": "/assets/image19.jpg" },
    { "food_name": "Fish and Chips", "food_category": "main_course", "type": "non_veg", "price": 1099, "image": "/assets/image20.jpg" },
    { "food_name": "Hash Browns", "food_category": "breakfast", "type": "veg", "price": 249, "image": "/assets/image21.jpg" },
    { "food_name": "Vegetable Soup", "food_category": "soups", "type": "veg", "price": 329, "image": "/assets/image22.jpg" },
    { "food_name": "Egg Fried Rice", "food_category": "main_course", "type": "non_veg", "price": 599, "image": "/assets/image23.jpg" },
    { "food_name": "Hawaiian Pizza", "food_category": "pizza", "type": "non_veg", "price": 799, "image": "/assets/image24.jpg" },
    { "food_name": "Pasta Primavera", "food_category": "pasta", "type": "veg", "price": 899, "image": "/assets/image25.jpg" }
];

const categoryImages = {
    "All": "https://media.istockphoto.com/id/908663850/photo/various-fast-food-products.jpg?s=612x612&w=0&k=20&c=8uGF9iSmuMPHTghrIu1FR6m1a1Y6qPrvLZQYuTDcoaY=",
    "breakfast": "https://thumbs.dreamstime.com/b/poha-23333662.jpg",
    "soups": "https://www.inspiredtaste.net/wp-content/uploads/2018/10/Homemade-Vegetable-Soup-Recipe-2-1200.jpg",
    "pasta": "https://s.lightorangebean.com/media/20240914160809/Spicy-Penne-Pasta_-done.png",
    "main_course": "https://ranveerbrar.com/wp-content/uploads/2021/02/Matar-paneer-1-scaled-scaled.jpg",
    "pizza": "https://hips.hearstapps.com/hmg-prod/images/classic-cheese-pizza-recipe-2-64429a0cb408b.jpg?crop=0.6666666666666667xw:1xh;center,top&resize=1200:*",
    "burger": "https://www.allrecipes.com/thmb/5JVfA7MxfTUPfRerQMdF-nGKsLY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/25473-the-perfect-basic-burger-DDMFS-4x3-56eaba3833fd4a26a82755bcd0be0c54.jpg"
};

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Re-seed Categories with correct images
        await Category.deleteMany({}); // Start fresh to ensure images are correct
        const categoryMap = {};

        // Define categories explicitly to control order/images
        const categoriesToCreate = [
            "All", "breakfast", "soups", "pasta", "main_course", "pizza", "burger"
        ];

        for (const catName of categoriesToCreate) {
            const newCat = await Category.create({
                name: catName,
                description: "Delicious " + catName,
                image: categoryImages[catName] || "https://placehold.co/400"
            });
            categoryMap[catName.toLowerCase()] = newCat._id;
            console.log(`Created Category: ${catName}`);
        }

        // 2. Re-seed Foods with correct local images
        const foodDocs = food_items.map(item => {
            const catId = categoryMap[item.food_category.toLowerCase()];
            if (!catId) return null;
            return {
                name: item.food_name,
                description: item.type,
                price: item.price,
                categoryId: catId,
                image: item.image // Using the local path now
            };
        }).filter(item => item !== null);

        if (foodDocs.length > 0) {
            await Food.deleteMany({});
            await Food.insertMany(foodDocs);
            console.log(`${foodDocs.length} Food items imported with images!`);
        } else {
            console.log('No foods to import or categories mismatch.');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedDB();
