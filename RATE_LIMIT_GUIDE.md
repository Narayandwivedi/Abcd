# Admin Rate Limiting Guide

## 🎯 Current Configuration

**Simple & Clean Rate Limiting for Admin Login**

```
Window: 1 hour
Max Attempts: 5 per IP
Scope: Per IP address
```

---

## 📊 How It Works

```
Each IP address can make 5 login attempts per hour

Example:
IP: 192.168.1.100
├── Attempt 1 ✅ (allowed)
├── Attempt 2 ✅ (allowed)
├── Attempt 3 ✅ (allowed)
├── Attempt 4 ✅ (allowed)
├── Attempt 5 ✅ (allowed)
└── Attempt 6 ❌ (blocked for 1 hour)

After 1 hour → Counter resets → 5 more attempts allowed
```

---

## 🔧 Configuration

**File:** `backend/middleware/adminRateLimit.js`

```javascript
const adminLoginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,                   // 5 attempts per hour
});
```

### Want to Change Settings?

**More Strict (3 attempts per hour):**
```javascript
windowMs: 60 * 60 * 1000,  // 1 hour
max: 3,                     // 3 attempts
```

**Less Strict (10 attempts per hour):**
```javascript
windowMs: 60 * 60 * 1000,  // 1 hour
max: 10,                    // 10 attempts
```

**Longer Window (24 hours):**
```javascript
windowMs: 24 * 60 * 60 * 1000,  // 24 hours
max: 5,                          // 5 attempts per 24 hours
```

---

## 🚀 Enable/Disable Rate Limiting

### To DISABLE (for development):

**File:** `backend/routes/adminRoute.js`

```javascript
// Comment out the rate limiter
// const { adminLoginLimiter } = require("../middleware/adminRateLimit");

// Remove from login route
router.post("/login", adminLogin);  // No rate limiting
```

### To ENABLE (for production):

```javascript
// Uncomment the rate limiter
const { adminLoginLimiter } = require("../middleware/adminRateLimit");

// Add to login route
router.post("/login", adminLoginLimiter, adminLogin);  // With rate limiting
```

---

## 🧪 Testing

```bash
# 1. Start server
npm start

# 2. Try logging in 6 times in a row with wrong password
# First 5 attempts: Normal error message
# 6th attempt: "Too many login attempts. Please try again after 1 hour."

# 3. Wait 1 hour or restart server
# Counter resets
```

---

## 🔄 Reset Rate Limit

**Quick way:** Just restart your server
```bash
npm start
```

**Why?** Rate limits are stored in memory and reset on server restart.

---

## 📝 What Gets Tracked

✅ **Tracked per IP:**
- Each IP address has its own counter
- Different devices = different IPs = separate counters

✅ **All attempts counted:**
- Successful logins: Counted
- Failed logins: Counted
- Both count towards the limit

---

## 🛡️ Production Recommendations

**For Production (More Strict):**
```javascript
windowMs: 24 * 60 * 60 * 1000,  // 24 hours
max: 3,                          // 3 attempts per day
```

**For Development (More Relaxed):**
```javascript
windowMs: 60 * 60 * 1000,  // 1 hour
max: 10,                    // 10 attempts per hour
```

**Current Setting (Balanced):**
```javascript
windowMs: 60 * 60 * 1000,  // 1 hour
max: 5,                     // 5 attempts per hour ← YOU ARE HERE
```

---

## ⚙️ Advanced Configuration

### Skip Successful Logins

If you want to only count FAILED attempts:

```javascript
const adminLoginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,  // Add this line
});
```

### Custom Message

```javascript
const adminLoginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Custom message here",  // Change this
});
```

---

## 🎯 Summary

**Current Setup:**
- ✅ Simple and clean
- ✅ 5 attempts per hour per IP
- ✅ Works with trust proxy
- ✅ No IPv6 issues
- ✅ Easy to modify

**To change settings:** Edit `backend/middleware/adminRateLimit.js`

**To disable:** Comment out in `backend/routes/adminRoute.js`

**To reset:** Restart server

---

**Questions?** Just edit the numbers in `adminRateLimit.js`! 🚀
