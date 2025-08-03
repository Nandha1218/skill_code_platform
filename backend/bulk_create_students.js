const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/student_login', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Bulk create users
async function createBulkUsers() {
    const defaultPassword = 'Rit@123'; // Consistent with auth.js
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    const students = [];
    
    for (let i = 1; i <= 50; i++) {
        students.push({
            username: `student${i}`,
            email: `student${i}@college.edu`,
            password: hashedPassword,
            mustChangePassword: true
        });
    }
    
    try {
        await User.insertMany(students, { ordered: false });
        console.log('Bulk students created with default password: Rit@123');
        console.log('All students must change their password on first login');
    } catch (err) {
        console.log('Some users may already exist:', err.message);
    }
    mongoose.disconnect();
}

createBulkUsers();
