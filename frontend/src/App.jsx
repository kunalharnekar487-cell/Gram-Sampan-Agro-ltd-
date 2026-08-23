import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';
import LoginOTP from './pages/public/LoginOTP';
import Register from './pages/public/Register';
import ForgotPassword from './pages/public/ForgotPassword';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import Terms from './pages/public/Terms';

import FarmerDashboard from './pages/dashboard/FarmerDashboard';
import FarmerProfile from './pages/dashboard/FarmerProfile';
import FarmerProducts from './pages/dashboard/FarmerProducts';

import MahilaDashboard from './pages/dashboard/MahilaDashboard';
import MahilaProfile from './pages/dashboard/MahilaProfile';

import CRPDashboard from './pages/dashboard/CRPDashboard';
import CRPFarmers from './pages/dashboard/CRPFarmers';

import AdminDashboard from './pages/dashboard/AdminDashboard';
import AdminFarmers from './pages/dashboard/AdminFarmers';
import AdminMahilaGroups from './pages/dashboard/AdminMahilaGroups';
import AdminReports from './pages/dashboard/AdminReports';
import Chatbot from './components/Chatbot';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to={`/dashboard/${user.role}`} />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to={`/dashboard/${user.role}`} />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/login-otp" element={<PublicRoute><LoginOTP /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      </Route>

      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to={user ? `/dashboard/${user.role}` : '/login'} />} />

        <Route path="farmer" element={<ProtectedRoute allowedRoles={['farmer']}><FarmerDashboard /></ProtectedRoute>} />
        <Route path="farmer/profile" element={<ProtectedRoute allowedRoles={['farmer']}><FarmerProfile /></ProtectedRoute>} />
        <Route path="farmer/crops" element={<ProtectedRoute allowedRoles={['farmer']}><FarmerProfile /></ProtectedRoute>} />
        <Route path="farmer/products" element={<ProtectedRoute allowedRoles={['farmer']}><FarmerProducts /></ProtectedRoute>} />
        <Route path="farmer/reports" element={<ProtectedRoute allowedRoles={['farmer']}><FarmerDashboard /></ProtectedRoute>} />
        <Route path="farmer/settings" element={<ProtectedRoute allowedRoles={['farmer']}><FarmerProfile /></ProtectedRoute>} />

        <Route path="mahila" element={<ProtectedRoute allowedRoles={['mahila']}><MahilaDashboard /></ProtectedRoute>} />
        <Route path="mahila/profile" element={<ProtectedRoute allowedRoles={['mahila']}><MahilaProfile /></ProtectedRoute>} />
        <Route path="mahila/members" element={<ProtectedRoute allowedRoles={['mahila']}><MahilaProfile /></ProtectedRoute>} />
        <Route path="mahila/products" element={<ProtectedRoute allowedRoles={['mahila']}><FarmerProducts /></ProtectedRoute>} />
        <Route path="mahila/machines" element={<ProtectedRoute allowedRoles={['mahila']}><MahilaProfile /></ProtectedRoute>} />
        <Route path="mahila/reports" element={<ProtectedRoute allowedRoles={['mahila']}><MahilaDashboard /></ProtectedRoute>} />

        <Route path="crp" element={<ProtectedRoute allowedRoles={['crp']}><CRPDashboard /></ProtectedRoute>} />
        <Route path="crp/farmers" element={<ProtectedRoute allowedRoles={['crp']}><CRPFarmers /></ProtectedRoute>} />
        <Route path="crp/mahila-groups" element={<ProtectedRoute allowedRoles={['crp']}><AdminMahilaGroups /></ProtectedRoute>} />
        <Route path="crp/village-reports" element={<ProtectedRoute allowedRoles={['crp']}><AdminReports /></ProtectedRoute>} />
        <Route path="crp/stock" element={<ProtectedRoute allowedRoles={['crp']}><AdminReports /></ProtectedRoute>} />
        <Route path="crp/analytics" element={<ProtectedRoute allowedRoles={['crp']}><AdminDashboard /></ProtectedRoute>} />

        <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="admin/farmers" element={<ProtectedRoute allowedRoles={['admin']}><AdminFarmers /></ProtectedRoute>} />
        <Route path="admin/mahila-groups" element={<ProtectedRoute allowedRoles={['admin']}><AdminMahilaGroups /></ProtectedRoute>} />
        <Route path="admin/crp" element={<ProtectedRoute allowedRoles={['admin']}><AdminFarmers /></ProtectedRoute>} />
        <Route path="admin/products" element={<ProtectedRoute allowedRoles={['admin']}><FarmerProducts /></ProtectedRoute>} />
        <Route path="admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>} />
        <Route path="admin/notifications" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '12px', padding: '12px 16px', fontSize: '14px' } }} />
        <AppRoutes />
        <Chatbot />
      </AuthProvider>
    </Router>
  );
}
