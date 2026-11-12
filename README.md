# 🛍️ AU Fashion – Premium Clothing Store

**AU Fashion** is a full-stack e-commerce web application developed using React.js, Node.js, Express.js, and MongoDB. It provides a modern online shopping experience with secure authentication, product management, order tracking, and an admin dashboard.

## 🚀 Features

### 👤 User Features
- User Registration and Login
- Email OTP Verification
- Forgot and Reset Password
- Personal Profile Management
- Change Password
- Browse and Search Products
- Product Categories
- Shopping Cart Management
- Wishlist Management
- Secure Checkout
- Order History and Tracking
- Order Details and Summary

### 🛡️ Admin Features
- Admin Dashboard
- Add, Update and Delete Products
- Manage Customer Orders
- View Order Details
- Update Order Status
- Inventory and Stock Management

### 🔐 Security Features
- JWT Authentication
- Role-Based Authorization
- Password Hashing using bcrypt
- Protected Routes
- Email OTP Verification
- Input Validation

## 🛠️ Tech Stack

**Frontend**
- React.js
- Tailwind CSS
- React Router DOM
- Axios
- React Icons

**Backend**
- Node.js
- Express.js
- REST APIs
- JWT Authentication
- Nodemailer

**Database**
- MongoDB
- Mongoose

## 📂 Project Structure

```text
AU-Fashion/
│
├── abu-ubaidha-clothes-shop/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── data/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
│
└── abu-ubaidha-shop-backend/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── server.js
    └── package.json
```

## ⚙️ Installation and Setup

### 1. Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Frontend Setup

```bash
cd abu-ubaidha-clothes-shop
npm install
npm run dev
```

### 3. Backend Setup

```bash
cd abu-ubaidha-shop-backend
npm install
npm run dev
```

### 4. Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email
EMAIL_PASS=your_gmail_app_password
```

Never upload your actual `.env` file or expose passwords and API secrets.

## 🛒 Application Modules

1. Home Page
2. Product Listing
3. Product Details
4. Shopping Cart
5. Wishlist
6. User Authentication
7. Email OTP Verification
8. User Profile
9. User Dashboard
10. Order Management
11. Admin Dashboard
12. Product Management

## 🎯 Project Objective

The main objective of AU Fashion is to develop a user-friendly and secure online shopping platform that simplifies the shopping experience while providing efficient product, inventory, and order management for administrators.

## 👨‍💻 Developer

**Abu Ubaidha**

Project: AU Fashion – Premium Clothing Store

---

⭐ If you find this project interesting, feel free to explore the repository!
