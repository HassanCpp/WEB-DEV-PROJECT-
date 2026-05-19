const mongoose = require('mongoose');

// Import your models
const Order = require('./models/Order');
const Product = require('./models/Product'); // Included just in case you want to seed products later!

// 1. Connect to MongoDB (Use your exact connection string)
mongoose.connect('mongodb://127.0.0.1:27017/libaseikhlaq')
    .then(() => console.log('Successfully connected to MongoDB for seeding!'))
    .catch(err => console.error('Connection error:', err));

// 2. The Seeding Function
const seedDatabase = async () => {
    try {
        // Optional: Clear out the old orders so you have a clean slate every time you run this
        await Order.deleteMany({});
        console.log('🗑️  Old orders cleared.');

        // Generate the fake orders
        const fakeOrders = [
            { totalAmount: 4500, status: 'Completed', createdAt: new Date(Date.now() - 86400000 * 2) }, // 2 days ago
            { totalAmount: 12500, status: 'Processing', createdAt: new Date(Date.now() - 86400000) },   // 1 day ago
            { totalAmount: 3200, status: 'Completed', createdAt: new Date(Date.now() - 3600000) },      // 1 hour ago
            { totalAmount: 8900, status: 'Shipped', createdAt: new Date(Date.now() - 1800000) },        // 30 mins ago
            { totalAmount: 5500, status: 'Completed', createdAt: new Date() }                           // Just now
        ];

        // Insert them into the database
        await Order.insertMany(fakeOrders);
        console.log('✅ 5 Fake Orders successfully seeded!');

    } catch (err) {
        console.error('❌ Error seeding database:', err);
    } finally {
        // 3. Disconnect from the database so the script stops running
        mongoose.connection.close();
        console.log('🔌 Disconnected from MongoDB.');
    }
};

// Execute the function
seedDatabase();