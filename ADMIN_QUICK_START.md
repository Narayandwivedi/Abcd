# Admin Panel - Quick Start Guide

## 🚀 Quick Setup (3 Steps)

### Step 1: Create Admin User

Run this command in the backend directory:

```bash
cd backend
node scripts/createAdmin.js
```

Follow the prompts to enter:
- Admin full name
- Admin email
- Admin password (minimum 6 characters)
- Admin mobile number

### Step 2: Start Backend Server

```bash
cd backend
npm start
```

The backend should start on `http://localhost:4000`

### Step 3: Start Admin Frontend

```bash
cd admin
npm run dev
```

The admin panel should open on `http://localhost:5173`

---

## 🔐 Login to Admin Panel

1. Go to `http://localhost:5173/login`
2. Enter the email and password you created in Step 1
3. Click "Login to Admin Panel"

**Important Security Notice:**
- You have **3 login attempts per 24 hours**
- After 3 failed attempts, your IP will be blocked for 24 hours
- This is a security feature to prevent brute force attacks

---

## 📋 What's Protected?

### Backend Routes (All Protected)
✅ `GET /api/admin/users` - Get all users
✅ `PUT /api/admin/users/:userId/approve` - Approve user
✅ `PUT /api/admin/users/:userId/set-password` - Set user password

### Frontend Pages (All Protected)
✅ Dashboard
✅ Users Management
✅ Vendors Management
✅ Products, Orders, Categories, Payments, Reports, Settings

---

## 🔒 Security Features

1. **Rate Limiting**: 3 login attempts per 24 hours
2. **JWT Authentication**: Secure token-based auth
3. **HTTP-Only Cookies**: Tokens stored securely
4. **Role-Based Access**: Only admin role can access
5. **Protected Routes**: All pages require authentication
6. **Auto Logout**: Session expires after 7 days
7. **Password Hashing**: Bcrypt with salt rounds 10

---

## 🎨 Admin Panel Features

- **Login Page**: Secure login with rate limiting notice
- **Dashboard**: Main overview (customize as needed)
- **Sidebar Navigation**: Easy access to all sections
- **Logout**: Two-step confirmation to prevent accidents
- **Responsive Design**: Works on mobile and desktop
- **Loading States**: Smooth loading indicators
- **Error Handling**: Clear error messages

---

## 🆘 Troubleshooting

### "Too many login attempts"
Wait 24 hours or contact system administrator

### "Unauthorized" Error
Your session expired. Login again.

### Cannot connect to backend
- Check if backend is running on port 4000
- Verify `VITE_BACKEND_URL` in `admin/.env`
- Check CORS settings in `backend/index.js`

### Admin user not found
Run the `createAdmin.js` script again

---

## 📞 Support

For detailed documentation, see `ADMIN_SETUP.md`

---

**Default Login**: Use credentials from Step 1
**Rate Limit**: 3 attempts / 24 hours
**Session Duration**: 7 days
