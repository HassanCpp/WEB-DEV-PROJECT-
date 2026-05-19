const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        default: 'customer' 
    }
});

// Hash password before saving to database (Modern Async approach, NO 'next' used!)
userSchema.pre('save', async function() {
    // If password is not modified, skip this process
    if (!this.isModified('password')) {
        return;
    }
    
    // Scramble the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);