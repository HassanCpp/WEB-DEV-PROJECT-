const User = require('../models/User');
const bcrypt = require('bcryptjs');

const renderLogin = (req, res) => res.render('login');

const renderRegister = (req, res) => res.render('register');

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        
        if (user) {
            req.flash('error_msg', 'That email is already registered.');
            return res.redirect('/login');
        }

        user = new User({ name, email, password });
        await user.save();

        req.flash('success_msg', 'Registration successful! You can now log in.');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'An error occurred during registration.');
        res.redirect('/login');
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            req.flash('error_msg', 'Invalid email or password.');
            return res.redirect('/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error_msg', 'Invalid email or password.');
            return res.redirect('/login');
        }

        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        req.flash('success_msg', `Welcome back, ${user.name}!`);
        if (user.role === 'admin') {
            res.redirect('/admin'); 
        } else {
            res.redirect('/'); 
        }
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'An error occurred during login.');
        res.redirect('/login');
    }
};

const logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};

module.exports = { renderLogin, renderRegister, registerUser, loginUser, logoutUser };