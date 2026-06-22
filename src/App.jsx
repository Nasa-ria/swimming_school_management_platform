import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RoleGuard from './components/RoleGuard';

// Pages — public
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Sessions from './pages/Sessions';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import OrderSuccess from './pages/OrderSuccess';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Unauthorized from './pages/Unauthorized';

// Pages — authenticated
import MyBookings from './pages/MyBookings';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
// Pages — instructor
import InstructorDashboard from './pages/instructor/Dashboard';
import MyStudents from './pages/instructor/MyStudents';
import InstructorSessions from './pages/instructor/InstructorSessions';
import GradingHub from './pages/instructor/GradingHub';

// Pages — admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminSessions from './pages/admin/ManageSessions';
import AdminAssignments from './pages/admin/ManageAssignments';
import AdminPaidSessions from './pages/admin/ManagePaidSessions';
import AdminStudentOverview from './pages/admin/StudentOverview';
import AdminProducts from './pages/admin/ManageProducts';
import AdminOrders from './pages/admin/ManageOrders';
import AdminUsers from './pages/admin/ManageUsers';
import AdminBlog from './pages/admin/ManageBlog';

// Pages — student
import StudentDashboard from './pages/student/Dashboard';
import MyClasses from './pages/student/MyClasses';
import MyProgress from './pages/student/MyProgress';

import DashboardLayout from './components/DashboardLayout';
import Toast from './components/Toast';
import './index.css';

const DashboardRoute = ({ children }) => (
  <DashboardLayout>{children}</DashboardLayout>
);

function AppRoutes() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/instructor') ||
    location.pathname.startsWith('/student');

  return (
    <>
      <Toast />
      <Navbar />
      <main className="main-content-saas">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ProductDetails />} />
          <Route path="/order-success" element={<RoleGuard><OrderSuccess /></RoleGuard>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Authenticated (Any role) */}
          <Route path="/profile" element={<RoleGuard><Profile /></RoleGuard>} />
          <Route path="/cart" element={<RoleGuard><Cart /></RoleGuard>} />
          <Route path="/orders" element={<RoleGuard><MyBookings /></RoleGuard>} />

          {/* User Role */}
          <Route path="/bookings" element={<RoleGuard allowedRoles={['user']}><MyBookings /></RoleGuard>} />

          {/* Student Role */}
          <Route path="/student/dashboard" element={<RoleGuard allowedRoles={['student', 'admin']}><DashboardRoute><StudentDashboard /></DashboardRoute></RoleGuard>} />
          <Route path="/student/classes" element={<RoleGuard allowedRoles={['student', 'admin']}><DashboardRoute><MyClasses /></DashboardRoute></RoleGuard>} />
          <Route path="/student/progress" element={<RoleGuard allowedRoles={['student', 'admin']}><DashboardRoute><MyProgress /></DashboardRoute></RoleGuard>} />
          <Route path="/student/feedback" element={<RoleGuard allowedRoles={['student', 'admin']}><DashboardRoute><MyProgress /></DashboardRoute></RoleGuard>} />
          <Route path="/student/lessons" element={<RoleGuard allowedRoles={['student', 'admin']}><DashboardRoute><MyProgress /></DashboardRoute></RoleGuard>} />

          {/* Instructor Role */}
          <Route path="/instructor" element={<RoleGuard allowedRoles={['instructor', 'admin']}><DashboardRoute><InstructorDashboard /></DashboardRoute></RoleGuard>} />
          <Route path="/instructor/students" element={<RoleGuard allowedRoles={['instructor', 'admin']}><DashboardRoute><MyStudents /></DashboardRoute></RoleGuard>} />
          <Route path="/instructor/sessions" element={<RoleGuard allowedRoles={['instructor', 'admin']}><DashboardRoute><InstructorSessions /></DashboardRoute></RoleGuard>} />
          <Route path="/instructor/performance" element={<RoleGuard allowedRoles={['instructor', 'admin']}><DashboardRoute><GradingHub /></DashboardRoute></RoleGuard>} />

          {/* Admin Role */}
          <Route path="/admin" element={<RoleGuard allowedRoles={['admin']}><DashboardRoute><AdminDashboard /></DashboardRoute></RoleGuard>} />
          <Route path="/admin/sessions" element={<RoleGuard allowedRoles={['admin']}><DashboardRoute><AdminSessions /></DashboardRoute></RoleGuard>} />
          <Route path="/admin/orders" element={<RoleGuard allowedRoles={['admin']}><DashboardRoute><AdminOrders /></DashboardRoute></RoleGuard>} />
          <Route path="/admin/assignments" element={<RoleGuard allowedRoles={['admin']}><DashboardRoute><AdminAssignments /></DashboardRoute></RoleGuard>} />
          <Route path="/admin/paid-sessions" element={<RoleGuard allowedRoles={['admin']}><DashboardRoute><AdminPaidSessions /></DashboardRoute></RoleGuard>} />
          <Route path="/admin/student-overview" element={<RoleGuard allowedRoles={['admin']}><DashboardRoute><AdminStudentOverview /></DashboardRoute></RoleGuard>} />
          <Route path="/admin/products" element={<RoleGuard allowedRoles={['admin']}><DashboardRoute><AdminProducts /></DashboardRoute></RoleGuard>} />
          <Route path="/admin/users" element={<RoleGuard allowedRoles={['admin']}><DashboardRoute><AdminUsers /></DashboardRoute></RoleGuard>} />
          <Route path="/admin/blog" element={<RoleGuard allowedRoles={['admin']}><DashboardRoute><AdminBlog /></DashboardRoute></RoleGuard>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
