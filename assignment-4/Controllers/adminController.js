const Product = require('../models/Product');

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
        // Removed 'image' from here because it's no longer simple text in req.body
        const { name, price, stock, category } = req.body;
        
        // Handle the physical file uploaded via Multer
        // If a file was uploaded, generate its new path. Otherwise, use a default image.
        const imagePath = req.file ? '/uploads/' + req.file.filename : '/sale.png';
        
        const newProduct = new Product({
            name: name,
            price: Number(price),
            stock: Number(stock),
            category: category,
            image: imagePath // Save the Multer-generated path to MongoDB
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
        
        // Prepare the basic data to update
        let updateData = {
            name: name,
            price: Number(price),
            stock: Number(stock),
            category: category
        };

        // If the admin uploaded a NEW image, add it to the update object
        // If they didn't upload a new image, this gets skipped and the old image is kept!
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

module.exports = { getDashboard, renderAddProduct, addProduct, deleteProduct, renderEditProduct, updateProduct };