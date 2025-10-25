# Admin Panel Setup Guide

## Security Features Implemented

### Backend Security
- **Admin Authentication Middleware**: All admin routes are protected with JWT-based authentication
- **Rate Limiting**: Admin login has strict rate limiting (3 attempts per 24 hours per IP)
- **Role-Based Access Control**: Only users with `role: "admin"` can access admin endpoints
- **HTTP-Only Cookies**: JWT tokens are stored in HTTP-only cookies for security
- **Password Hashing**: Admin passwords are hashed with bcrypt

### Frontend Security
- **Protected Routes**: All admin pages are protected with authentication guards
- **Auth Context**: Centralized authentication state management
- **Auto-Redirect**: Unauthenticated users are automatically redirected to login
- **Session Persistence**: Admin sessions persist across page refreshes
- **Logout Confirmation**: Two-step logout process to prevent accidental logouts

## Backend Routes

### Public Routes (No Authentication Required)
- `POST /api/admin/login` - Admin login (rate limited: 3 attempts/24h)

### Protected Routes (Requires Admin Authentication)
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/me` - Get current admin info
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:userId/approve` - Approve user and generate certificate
- `PUT /api/admin/users/:userId/set-password` - Set user password

## Frontend Routes

### Public Routes
- `/login` - Admin login page

### Protected Routes (Requires Authentication)
- `/` - Dashboard
- `/users` - User management
- `/vendors` - Vendor management
- `/products` - Product management
- `/orders` - Order management
- `/categories` - Category management
- `/payments` - Payment management
- `/reports` - Reports and analytics
- `/settings` - System settings

## Creating Admin User

Since there is no admin signup endpoint (for security), you need to manually create an admin user in the database:

### Method 1: Using MongoDB Shell

```javascript
// Connect to your MongoDB
use your_database_name

// Hash your password first (use bcrypt with salt rounds 10)
// You can use this Node.js script to generate the hash:
// const bcrypt = require('bcryptjs');
// const hash = bcrypt.hashSync('your_password', 10);
// console.log(hash);

// Insert admin user
db.users.insertOne({
  fullName: "Your Name",
  email: "admin@abcd.com",
  password: "$2a$10$your_hashed_password_here",
  role: "admin",
  mobile: "1234567890",
  isVerified: true,
  paymentVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Method 2: Using Node.js Script

Create a file `backend/scripts/createAdmin.js`:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userModel = require('../models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const password = 'your_secure_password'; // Change this!
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await userModel.create({
      fullName: "Your Name",
      email: "admin@abcd.com",
      password: hashedPassword,
      role: "admin",
      mobile: "1234567890",
      isVerified: true,
      paymentVerified: true
    });

    console.log('Admin created successfully:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
```

Run the script:
```bash
cd backend
node scripts/createAdmin.js
```

## Environment Variables

### Backend (.env)
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production  # or development
```

### Admin Frontend (.env)
```env
VITE_BACKEND_URL=http://localhost:4000  # or your production API URL
```

## Running the Admin Panel

### Development Mode

1. Start the backend:
```bash
cd backend
npm start
```

2. Start the admin frontend:
```bash
cd admin
npm run dev
```

3. Access the admin panel at `http://localhost:5173/login`

### Production Mode

1. Build the admin frontend:
```bash
cd admin
npm run build
```

2. The built files will be in `admin/dist` folder. Deploy to your hosting service.

## Security Best Practices

1. **Strong Passwords**: Always use strong, unique passwords for admin accounts
2. **HTTPS**: Always use HTTPS in production
3. **Environment Variables**: Never commit `.env` files to version control
4. **Rate Limiting**: The 3 login attempts per 24 hours is already configured
5. **Session Timeout**: Admin JWT tokens expire after 7 days
6. **Regular Updates**: Keep all dependencies updated

## Troubleshooting

### "Too many login attempts" Error
- Wait 24 hours before trying again
- This is a security feature to prevent brute force attacks
- Contact system administrator if you're locked out

### "Unauthorized" Error
- Your session may have expired (after 7 days)
- Try logging in again
- Clear cookies and try again

### Cannot Access Admin Panel
- Ensure backend server is running
- Check CORS configuration in `backend/index.js`
- Verify `VITE_BACKEND_URL` in admin `.env` file

## Features

### Login Page
- Email and password authentication
- Show/hide password toggle
- Error message display
- Loading states
- Security notice about rate limiting

### Sidebar
- Dynamic admin name display (from logged-in user)
- Navigation menu with icons
- Logout button with confirmation
- Responsive design (mobile-friendly)

### Protected Pages
- Automatic redirect to login if not authenticated
- Loading spinner during authentication check
- Session persistence across page refreshes
