# Swimming School Management Platform (JavaScript Version)

A comprehensive swimming school application built with **React (JavaScript)**, **Express.js**, and **MySQL**.

## 🚀 Features

- ✅ User Authentication & Profile Management
- ✅ Swimming Session Browsing & Booking
- ✅ Booking Management (View, Cancel)
- ✅ Blog System (Articles, Tips, News)
- ✅ E-Commerce (Products, Shopping Cart, Orders)
- ✅ Social Features (Likes, Comments, Reviews)
- ✅ Admin Dashboard (Manage Sessions, Products, Users)

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your Windows machine:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/installer/)
- **Git** - [Download here](https://git-scm.com/downloads)
- **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Nasa-ria/swimming_school_management_platform.git
cd swimming_school_management_platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Create a MySQL database and run the schema in `database/schema.sql`

### 4. Environment Configuration

Create a `.env` file:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=swimming_school
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

## 🏃‍♂️ Running the Application

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

## 📁 Project Structure

```
├── src/                # Frontend React code
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   └── context/       # State management
├── server/            # Backend Express code
│   ├── routes/        # API routes
│   ├── models/        # Database models
│   └── middleware/    # Middleware
└── database/          # Database scripts
```

## 🌐 API Endpoints

- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/sessions` - Get sessions
- `POST /api/bookings` - Create booking
- `GET /api/blog/posts` - Get blog posts
- `GET /api/products` - Get products

## 💡 Tips for Windows Users

- Use Git Bash or PowerShell
- Ensure MySQL service is running
- Check ports 5000 and 5173 are available

---

**Happy Coding! 🏊‍♂️💻**

