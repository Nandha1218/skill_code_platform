document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!username || !password) {
                messageDiv.textContent = 'Please fill in all fields.';
                return;
            }

            fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            .then(res => res.json())
            .then(data => {
                if (data.mustChangePassword) {
                    showChangePasswordForm(data.username || username);
                } else if (data.message === 'Login successful') {
                    messageDiv.textContent = 'Login successful! Redirecting...';
                    setTimeout(() => window.location.href = `/dashboard.html?username=${encodeURIComponent(username)}`, 1500);
                } else {
                    messageDiv.textContent = data.message || 'Login failed.';
                }
            })
            .catch(() => {
                messageDiv.textContent = 'Server error. Please try again.';
            });
        });

        document.getElementById('forgotPassword').addEventListener('click', function (e) {
            e.preventDefault();
            messageDiv.textContent = 'Forgot Password clicked (demo only)';
        });

        document.getElementById('createAccount').addEventListener('click', function (e) {
            e.preventDefault();
            messageDiv.textContent = 'Create Account clicked (demo only)';
        });
    }
});

// Function to show change password form
function showChangePasswordForm(username) {
    const loginContainer = document.querySelector('.login-container');
    loginContainer.innerHTML = `
        <h2>Change Your Password</h2>
        <p style="color: #666; margin-bottom: 20px;">Your account requires a password change for security.</p>
        <form id="changePasswordForm">
            <input type="password" id="oldPassword" placeholder="Current Password" required>
            <input type="password" id="newPassword" placeholder="New Password (min 6 characters)" required>
            <input type="password" id="confirmPassword" placeholder="Confirm New Password" required>
            <button type="submit">Change Password</button>
        </form>
        <div id="message"></div>
        <div style="margin-top: 15px;">
            <a href="#" onclick="location.reload()" style="color: #007bff; text-decoration: none;">← Back to Login</a>
        </div>
    `;

    const messageDiv = document.getElementById('message');

    document.getElementById('changePasswordForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const oldPassword = document.getElementById('oldPassword').value.trim();
        const newPassword = document.getElementById('newPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        // Validation
        if (!oldPassword || !newPassword || !confirmPassword) {
            messageDiv.textContent = 'Please fill in all fields.';
            return;
        }

        if (newPassword.length < 6) {
            messageDiv.textContent = 'New password must be at least 6 characters long.';
            return;
        }

        if (newPassword !== confirmPassword) {
            messageDiv.textContent = 'New passwords do not match.';
            return;
        }

        if (newPassword === oldPassword) {
            messageDiv.textContent = 'New password must be different from current password.';
            return;
        }

        // Show loading state
        const submitBtn = document.querySelector('#changePasswordForm button');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Changing Password...';
        submitBtn.disabled = true;

        fetch('http://localhost:5000/api/auth/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, oldPassword, newPassword })
        })
        .then(res => res.json())
        .then(data => {
            messageDiv.textContent = data.message;
            if (data.message === 'Password changed successfully') {
                messageDiv.style.color = 'green';
                setTimeout(() => {
                    window.location.href = `/dashboard.html?username=${encodeURIComponent(username)}&success=true`;
                }, 2000);
            } else {
                messageDiv.style.color = 'red';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        })
        .catch(() => {
            messageDiv.textContent = 'Server error while changing password.';
            messageDiv.style.color = 'red';
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
}
