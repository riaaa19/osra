# OSRA Authentication Guide

## Overview
OSRA supports three user roles:
- **Admin** - Wholesaler platform administrator
- **Middleman** - Reseller/distributor
- **Retailer** - End customer (future role)

---

## Sign Up (Registration)

### For Middlemen/Resellers

**URL:** `/register`

**Form Fields:**
1. **Full Name** - Your personal name
2. **Email Address** - For account login
3. **WhatsApp Phone Number** - Must be valid for OTP verification
4. **Business/Store Name** - Your store/business name
5. **Password** - Minimum 8 characters

**Process:**
```
1. Fill in all required fields
2. Click "Create Account"
3. Account is created with status: "pending"
4. Redirected to OTP verification page
5. Enter OTP sent to your WhatsApp number
6. Account becomes "active" after OTP verification
7. Access middleman dashboard at /middleman
```

**Your Store Link Format:**
```
osra.com/store/{business-name-slug}
Example: osra.com/store/rahul-boutique
```

---

## Login

### Regular Email/Password Login

**URL:** `/login`

**Form Fields:**
1. **Email Address** - Registered email
2. **Password** - Account password
3. **Role Selection** - Choose "Admin Wholesaler" or "Middleman Reseller"

**Login Flow:**
```
1. Enter email and password
2. Select your role
3. Click "Login"
4. System validates credentials
5. Fetches your profile role from database
6. Redirects to appropriate dashboard:
   - Admin → /admin
   - Middleman → /middleman
```

---

## Dashboard Access

### Admin Dashboard
- **URL:** `/admin`
- **Access:** Admin role only
- **Features:**
  - View inventory
  - Manage products
  - View all orders
  - Manage middlemen & retailers
  - Analytics & reporting
  - Ledger management
  - Returns management

### Middleman Dashboard
- **URL:** `/middleman`
- **Access:** Middleman role
- **Features:**
  - View store link
  - Check account status
  - View orders
  - Marketplace access
  - Analytics
  - Store customization
  - Claims management

---

## Demo Accounts (For Testing)

Quick login without signup:

**Admin Demo:**
- Click "Admin Demo" button on login page
- Credentials: `admin@osra.in` / `osra1234`
- Auto-redirects to `/admin` dashboard

**Middleman Demo:**
- Click "Middleman Demo" button on login page
- Credentials: `middleman@osra.in` / `osra1234`
- Auto-redirects to `/middleman` dashboard

---

## Password Requirements

- Minimum 8 characters
- Must be strong (recommended: mix of letters, numbers, symbols)
- Store securely

## Account Security

- Passwords are hashed using Supabase auth
- OTP verification for phone numbers
- Session persistence enabled
- Auto logout on inactivity (configurable)

## Forgot Password

- **URL:** `/forgot-password`
- Click "Forgot Password?" link on login page
- Enter your email
- Follow recovery link sent to email
- Reset password

---

## Common Issues

### "Please fill in all fields"
- Ensure all form fields are completed before submitting

### "Password must be at least 8 characters"
- Use a longer password (minimum 8 characters)

### "Email already registered"
- This email is already associated with an account
- Use a different email or reset password

### "Invalid OTP"
- Check SMS for correct OTP code
- OTP expires after 10 minutes
- Request new OTP if needed

---

## API Endpoints (Backend)

### Authentication
- `POST /auth/v1/signup` - Create new account
- `POST /auth/v1/signin` - Login with credentials
- `POST /auth/v1/signout` - Logout

### Profile Management
- `GET /profiles/{id}` - Get user profile
- `PUT /profiles/{id}` - Update profile
- `POST /profiles` - Create profile

### Middleman Specific
- `POST /middlemen` - Register as middleman
- `GET /middlemen` - List middlemen
- `PUT /middlemen/{id}` - Update middleman info

---

## Support

For issues or questions:
- Check this guide first
- Review error messages carefully
- Contact support team
