const express = require('express');
const app = express();

// Set up EJS as view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Serve static files from public folder
app.use(express.static('public'));

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
    console.log(`Server running at http://localhost:${PORT}`);
});