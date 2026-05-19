const Product = require('../models/Product');

const renderHomepage = (req, res) => res.render('homepage');

const renderContact = (req, res) => res.render('contact');

const getProducts = async (req, res) => {
    try {
        let { page = 1, category, search, minPrice, maxPrice, sort } = req.query;
        const limit = 8; 
        const skip = (page - 1) * limit;

        let query = {};
        if (category) query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' }; 
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let sortQuery = {};
        if (sort === 'price-asc') sortQuery.price = 1;
        if (sort === 'price-desc') sortQuery.price = -1;

        const products = await Product.find(query).sort(sortQuery).skip(skip).limit(limit);
        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        res.render('products', {
            products,
            currentPage: Number(page),
            totalPages,
            totalProducts,
            query: req.query 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

module.exports = { renderHomepage, renderContact, getProducts };