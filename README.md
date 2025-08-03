<<<<<<< HEAD
# Login System with Password Change Feature

This is a complete login system with automatic password change requirement for users with default passwords.

## Features

- **Secure Login**: Username/password authentication
- **Default Password Detection**: Automatically detects users with default passwords
- **Forced Password Change**: Users with default passwords must change them before accessing the system
- **Password Hashing**: All passwords are securely hashed using bcrypt
- **Bulk User Creation**: Script to create multiple test users
- **Responsive UI**: Modern, user-friendly interface
- **Beautiful Dashboard**: Complete dashboard with user stats and features

## Default Passwords

The system recognizes these default passwords:
- `Rit@123`
- `college2025`

Users with these passwords will be forced to change them on first login.

## Quick Start

### Option 1: Using the batch file (Windows)
```bash
# Double-click start.bat or run:
./start.bat
```

### Option 2: Manual setup

#### 1. Install Dependencies
```bash
cd login-page/backend
npm install
```

#### 2. Start MongoDB
Make sure MongoDB is running on `localhost:27017`

#### 3. Create Test Users
```bash
cd login-page/backend
node bulk_create_students.js
```

This creates 50 test users (student1, student2, ..., student50) with default password `Rit@123`.

#### 4. Start the Server
```bash
cd login-page/backend
node server.js
```

The server will run on `http://localhost:5000`

#### 5. Access the Application

Open your browser and go to:
- **Main Application**: `http://localhost:5000`
- **Test Interface**: `http://localhost:5000/test_login.html`

## Testing

### Test Credentials

- **Username**: `student1` (or any student1-student50)
- **Default Password**: `Rit@123`

### Test Flow

1. Login with default credentials
2. System detects default password
3. Redirected to password change form
4. Enter new password (minimum 6 characters)
5. Password is changed and user is redirected to dashboard

### Test Page

Open `http://localhost:5000/test_login.html` for a comprehensive test interface.

## API Endpoints

### POST `/api/auth/login`
Login endpoint that checks for default passwords.

**Request:**
```json
{
  "username": "student1",
  "password": "Rit@123"
}
```

**Response (default password):**
```json
{
  "message": "login-successful",
  "mustChangePassword": true,
  "username": "student1"
}
```

### POST `/api/auth/change-password`
Change password endpoint with validation.

**Request:**
```json
{
  "username": "student1",
  "oldPassword": "Rit@123",
  "newPassword": "newSecurePassword123"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **Backward Compatibility**: Supports both hashed and plain text passwords
- **Password Validation**: Minimum 6 characters required
- **Default Password Detection**: Multiple default passwords supported
- **Session Management**: Proper redirect after password change

## File Structure

```
login-page/
├── backend/
│   ├── models/
│   │   └── User.js          # User schema with mustChangePassword field
│   ├── routes/
│   │   └── auth.js          # Authentication endpoints
│   ├── bulk_create_students.js  # Script to create test users
│   ├── server.js            # Express server with static file serving
│   └── package.json
├── public/                  # Additional static files
├── dashboard.html           # Beautiful dashboard page
├── index.html              # Main login page
├── script.js               # Frontend JavaScript
├── styles.css              # CSS styles
├── test_login.html         # Test interface
├── start.bat               # Windows startup script
└── README.md               # This file
```

## Troubleshooting

### Server Not Starting
- Check if MongoDB is running
- Verify all dependencies are installed
- Check if port 5000 is available

### Login Issues
- Ensure users exist in database
- Check if using correct default password
- Verify server is running on correct port

### Password Change Issues
- Ensure new password is at least 6 characters
- Check if old password is correct
- Verify network connectivity to server

### Dashboard Not Loading
- Make sure you're accessing via `http://localhost:5000/dashboard.html`
- Check that the server is running
- Verify MongoDB connection

## Customization

### Change Default Password
Edit `backend/bulk_create_students.js` and `backend/routes/auth.js` to use different default passwords.

### Modify Password Requirements
Update the validation in `backend/routes/auth.js` to change minimum password length or add complexity requirements.

### Update UI
Modify `index.html`, `script.js`, and `styles.css` to customize the appearance and behavior.

### Dashboard Features
The dashboard includes:
- User welcome message
- Course progress tracking
- Achievements display
- Practice sessions
- Community features
- Learning statistics
- Logout functionality 
=======
# skill_code_platform
>>>>>>> 028d028d00ab1e282bfef3a3af421dec16882ff0
