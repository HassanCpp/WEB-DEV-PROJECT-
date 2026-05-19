require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session); 
const flash = require('connect-flash');

const app = express();

// ==========================================
// 1. SETTINGS & BASIC MIDDLEWARE
// ==========================================
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 2. MONGODB CONNECTION
// ==========================================
mongoose.connect('mongodb://127.0.0.1:27017/libaseikhlaq')
.then(() => console.log('✅ Successfully connected to MongoDB!'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ==========================================
// 3. SECURITY, SESSIONS & FLASH MESSAGES
// ==========================================
app.use(session({
    secret: 'libaseikhlaq_super_secret_key_2026', 
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ url: 'mongodb://127.0.0.1:27017/libaseikhlaq' }), 
    cookie: { maxAge: 1000 * 60 * 60 * 24 } 
}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null; 
    res.locals.success_msg = req.flash('success_msg'); 
    res.locals.error_msg = req.flash('error_msg');     
    next();
});

// ==========================================
// 4. IMPORT & MOUNT ROUTES (MVC Pattern)
// ==========================================
const storeRoutes = require('./routes/storeRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const apiRoutes = require('./routes/apiRoutes');

app.use('/', storeRoutes);
app.use('/', authRoutes);
app.use('/admin', adminRoutes); // Automatically prefixes all admin routes with /admin
app.use('/api/v1', apiRoutes);


// ==========================================
// 5. START SERVER
// ==========================================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});