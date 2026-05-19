const Product = require('../models/Product');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. JWT Login (Stateless Authentication)
const apiLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

        // Generate the JWT Token (The Digital Passport)
        // Payload includes user ID and role. Expires in 1 hour.
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ 
            success: true, 
            message: 'Login successful', 
            token: token // Handing the passport to the client!
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// 2. Get All Products (Public)
const getApiProducts = async (req, res) => {
    try {
        let { page = 1, category, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (category) query.category = category;

        const products = await Product.find(query).skip(skip).limit(Number(limit));
        
        res.json({ success: true, count: products.length, data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// 3. Get Single Product (Public)
const getApiProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        
        res.json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Invalid ID or Server error' });
    }
};

// 4. Get User Profile (Protected - Requires JWT)
const getApiProfile = async (req, res) => {
    try {
        // req.user.id comes from our verifyToken middleware!
        const user = await User.findById(req.user.id).select('-password'); // '-password' hides the hash from the JSON output
        
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// 5. Submit an Order (Protected - Requires JWT)
const submitApiOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        // In a real app, we would save this to an Order model.
        // For this lab, we simulate the database action and return a success JSON.
        res.json({ 
            success: true, 
            message: 'Order placed successfully!', 
            order_details: {
                userId: req.user.id, // We know exactly who ordered it because of the JWT!
                productId: productId,
                quantity: quantity,
                status: 'Processing'
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { apiLogin, getApiProducts, getApiProductById, getApiProfile, submitApiOrder };