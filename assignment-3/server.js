const express = require('express');
const mongoose = require('mongoose'); // Import Mongoose
const app = express();

// Set up EJS as view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Serve static files from public folder
app.use(express.static('public'));

// --- MONGODB CONNECTION ---
// 'libaseikhlaq' will be the name of your new local database
// --- MONGODB CONNECTION ---
mongoose.connect('mongodb://127.0.0.1:27017/libaseikhlaq')
.then(() => console.log('✅ Successfully connected to MongoDB!'))
.catch(err => console.error('❌ MongoDB connection error:', err));
// Routes
app.get('/', (req, res) => {
    res.render('homepage');
});

app.get('/contact-us', (req, res) => {
    res.render('contact');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

const Product = require('./models/Product'); // Import the model at the top

// ... existing code ...

app.get('/products', async (req, res) => {
    try {
        // 1. EXTRACTION: Get query parameters from the URL
        let { page = 1, category, search, minPrice, maxPrice, sort } = req.query;
        const limit = 8; // Requirement: 8 products per page
        const skip = (page - 1) * limit;

        // 2. FILTERING: Build a dynamic query object
        let query = {};
        
        if (category) query.category = category;
        
        if (search) {
            // 'i' makes it case-insensitive (finds "oud" or "Oud")
            query.name = { $regex: search, $options: 'i' }; 
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // 3. SORTING: Handle price sorting
        let sortQuery = {};
        if (sort === 'price-asc') sortQuery.price = 1;
        if (sort === 'price-desc') sortQuery.price = -1;

        // 4. EXECUTION: Fetch products and total count for pagination math
        const products = await Product.find(query)
            .sort(sortQuery)
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        // 5. RENDERING: Send everything to the EJS template
        res.render('products', {
            products,
            currentPage: Number(page),
            totalPages,
            totalProducts,
            query: req.query // Pass query back to keep filters active in UI
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});