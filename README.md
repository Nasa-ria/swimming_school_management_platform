# Swimming School Management Platform 🏊‍♂️✨

A premium, role-based swimming school management system built with **React (Vite)**, **Node.js (Express)**, and **MongoDB (Mongoose)**. This platform provides specialized portals for Administrators, Instructors, and Students to manage their training journeys.



## 🚀 Key Features

### 👤 Student Portal
- **Advanced Dashboard**: Track upcoming classes, progress percentage, and latest coach feedback.
- **My Progress**: Interactive skill visualization with gradient progress bars, level-up achievement badges, and comprehensive evaluation history.
- **Class Management**: Dual view for upcoming and historical swimming sessions.
- **Polymorphic Booking**: Book sessions and buy swimming gear in a unified shopping experience.

### 🏊‍♂️ Instructor Portal
- **Management Dashboard**: Overview of assigned students, today's schedule, and pending assignments.
- **Grading Hub**: Detailed performance evaluation (Grades A-F, scores, and custom feedback) per session.
- **Schedule Control**: Accept or decline session assignments from administrators.
- **Student Insights**: Access to student profiles and historical performance metrics.

### 🛡️ Admin Power Center
- **Student-to-Instructor Pairing**: Directly assign students to personal coaches for long-term tracking.
- **Paid Session Management**: Assign instructors to individual paid bookings with status filtering.
- **Student Overview**: A birds-eye view of all students, including sessions remaining, attendance rates, and progress milestones.
- **Comprehensive Management**: Manage Sessions, Products, Users, and the Blog from a unified interface.

### 🛠️ Technical Highlights
- **Dynamic Sidebar**: A role-aware, responsive navigation hub that adapts to the logged-in user.
- **Role-Based Access Control (RBAC)**: Secure routing using `RoleGuard` to protect sensitive data.
- **Aquatic Design System**: A modern, premium UI/UX with glassmorphism, smooth animations, and an aquatic color palette.
- **Polymorphic Cart**: A unified backend system for handling both physical inventory and training services.

## 📋 Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB Atlas** or a local MongoDB instance
- **npm** (v9 or higher)

## 🛠️ Installation & Setup

### 1. Clone & Install
```bash
git clone https://github.com/USER/swimming-school-js.git
cd swimming-school-js
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
```

Add Paystack keys to the same `.env` when enabling online payments:
```env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
PAYSTACK_CURRENCY=NGN
```

### 3. Database Seeding (Optional)
To populate the platform with sample instructors, students, and sessions:
```bash
node server/seed.js
```

### 4. Run the Application
```bash
# Terminal 1 - Backend (CommonJS)
npm run server

# Terminal 2 - Frontend (Vite/React)
npm run dev
```

## 🌐 Core API Endpoints

- `/api/auth` - Authentication (Login, Register, User profile)
- `/api/student` - Student metrics, progress, and class history
- `/api/instructor` - Student lists, grading, and session status
- `/api/admin` - Global assignments, overview, and management
- `/api/cart` - Polymorphic cart handling (Products + Sessions)

## 📁 Project Structure
```
├── src/                # Frontend (React + Vite)
│   ├── components/     # UI Design System (Sidebar, Cards, Table, etc.)
│   ├── pages/          # Role-based Portal Pages
│   ├── context/        # Auth & Cart State Management
│   └── services/       # Axios API Config
├── server/             # Backend (Express + Mongoose)
│   ├── routes/         # Role-based API logic
│   ├── models/         # MongoDB Schemas
│   └── middleware/     # RBAC & Authentication
```

---

**Built with passion for Alraad Swimming School. 🏊‍♂️💻✅**
