const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'User not found' });

        // Check if password is hashed or plain text (for backward compatibility)
        let isMatch;
        if (user.password.startsWith('$2')) {
            // Password is hashed
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            // Password is plain text (legacy)
            isMatch = (password === user.password);
        }

        if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

        // Check for default passwords
        const defaultPasswords = ['Rit@123', 'college2025'];
        const isDefaultPassword = defaultPasswords.includes(password) || 
                                (user.mustChangePassword && defaultPasswords.includes(user.password));

        if (isDefaultPassword || user.mustChangePassword) {
            return res.status(200).json({ 
                message: 'login-successful', 
                mustChangePassword: true,
                username: user.username 
            });
        }

        return res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Change password
router.post('/change-password', async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check old password
        let isMatch;
        if (user.password.startsWith('$2')) {
            // Password is hashed
            isMatch = await bcrypt.compare(oldPassword, user.password);
        } else {
            // Password is plain text (legacy)
            isMatch = (oldPassword === user.password);
        }

        if (!isMatch) return res.status(401).json({ message: 'Old password is incorrect' });

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        user.mustChangePassword = false; // Reset the flag
        await user.save();

        return res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
