const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Make dotenv optional
try {
    require('dotenv').config();
} catch (error) {
    console.log('dotenv not found, using default environment');
}

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the parent directory (login-page folder)
app.use(express.static(path.join(__dirname, '..')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/student_login', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Debug logging for MongoDB connection and login route
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to', mongoose.connection.name);
});
mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

// Routes
app.use('/api/auth', authRoutes);

// Serve the main login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Serve the dashboard (now in main directory)
app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dashboard.html'));
});

// Serve the test page
app.get('/test_login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'test_login.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access the application at: http://localhost:${PORT}`);
    console.log(`Test page available at: http://localhost:${PORT}/test_login.html`);
    console.log(`Dashboard available at: http://localhost:${PORT}/dashboard.html`);
});
