const Product = require('../models/Product');
const Order = require('../models/Order'); // <-- NEW: Imported the Order model

// ==========================================
// EXISTING PRODUCT CRUD LOGIC
// ==========================================

const getDashboard = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.render('admin-dashboard', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

const renderAddProduct = (req, res) => res.render('admin-add-product');

const addProduct = async (req, res) => {
    try {
        const { name, price, stock, category } = req.body;
        
        const imagePath = req.file ? '/uploads/' + req.file.filename : '/sale.png';
        
        const newProduct = new Product({
            name: name,
            price: Number(price),
            stock: Number(stock),
            category: category,
            image: imagePath 
        });

        await newProduct.save();
        req.flash('success_msg', 'Product successfully added!');
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to add product.');
        res.redirect('/admin/products/add');
    }
};

const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Product deleted successfully.');
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to delete product.');
        res.redirect('/admin');
    }
};

const renderEditProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.redirect('/admin');
        res.render('admin-edit-product', { product });
    } catch (err) {
        console.error(err);
        res.redirect('/admin');
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, price, stock, category } = req.body;
        
        let updateData = {
            name: name,
            price: Number(price),
            stock: Number(stock),
            category: category
        };

        if (req.file) {
            updateData.image = '/uploads/' + req.file.filename;
        }
        
        await Product.findByIdAndUpdate(req.params.id, updateData);

        req.flash('success_msg', 'Product updated successfully.');
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to update product.');
        res.redirect(`/admin/products/edit/${req.params.id}`);
    }
};

// ==========================================
// NEW: LIVE SALES DASHBOARD LOGIC
// ==========================================

// Helper function to calculate math
const getSalesStats = async () => {
    // 1. Count total orders
    const totalOrders = await Order.countDocuments();
    
    // 2. Add up all 'totalAmount' fields
    const revenueResult = await Order.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    
    // If no orders exist yet, default to 0
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // 3. NEW: Fetch the 5 most recent transactions
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
    
    return { totalOrders, totalRevenue, recentOrders };
};

// Route 1: Render the initial HTML page
const renderSalesDashboard = async (req, res) => {
    try {
        const stats = await getSalesStats();
        res.render('admin-sales', { stats }); 
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// Route 2: Send JSON data for the jQuery AJAX polling
const getSalesDataAPI = async (req, res) => {
    try {
        const stats = await getSalesStats();
        res.json(stats); 
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
};

// --- Make sure the new functions are exported! ---
module.exports = { 
    getDashboard, 
    renderAddProduct, 
    addProduct, 
    deleteProduct, 
    renderEditProduct, 
    updateProduct,
    renderSalesDashboard, 
    getSalesDataAPI       
};