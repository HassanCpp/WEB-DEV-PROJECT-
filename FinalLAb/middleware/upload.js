const multer = require('multer');
const path = require('path');

// 1. Configure Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Tell Multer to save files in the public/uploads folder
        cb(null, './public/uploads'); 
    },
    filename: function (req, file, cb) {
        // Create a unique filename: "image-1678901234.jpg"
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// 2. File Filter (Security)
const fileFilter = (req, file, cb) => {
    // Only accept files that are images (jpeg, png, etc.)
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

// 3. Initialize Multer
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB
});

module.exports = upload;