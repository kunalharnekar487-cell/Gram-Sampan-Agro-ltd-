import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiUser, FiUsers, FiGrid, FiFileText, FiSettings, FiLogOut, FiChevronLeft, FiChevronRight, FiPackage, FiBarChart2, FiBell, FiShield, FiMap, FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Modal from '../ui/Modal';

const menuItems = {
  admin: [
    { label: 'Dashboard', icon: FiHome, path: '/dashboard/admin' },
    { label: 'Farmers', icon: FiUser, path: '/dashboard/admin/farmers' },
    { label: 'Mahila Groups', icon: FiUsers, path: '/dashboard/admin/mahila-groups' },
    { label: 'CRP Management', icon: FiShield, path: '/dashboard/admin/crp' },
    { label: 'Products', icon: FiPackage, path: '/dashboard/admin/products' },
    { label: 'Reports', icon: FiBarChart2, path: '/dashboard/admin/reports' },
    { label: 'Notifications', icon: FiBell, path: '/dashboard/admin/notifications' },
    { label: 'Settings', icon: FiSettings, path: '/dashboard/admin/settings' },
  ],
  crp: [
    { label: 'Dashboard', icon: FiHome, path: '/dashboard/crp' },
    { label: 'Farmers', icon: FiUser, path: '/dashboard/crp/farmers' },
    { label: 'Mahila Groups', icon: FiUsers, path: '/dashboard/crp/mahila-groups' },
    { label: 'Village Reports', icon: FiMap, path: '/dashboard/crp/village-reports' },
    { label: 'Stock', icon: FiPackage, path: '/dashboard/crp/stock' },
    { label: 'Analytics', icon: FiBarChart2, path: '/dashboard/crp/analytics' },
  ],
  farmer: [
    { label: 'Dashboard', icon: FiHome, path: '/dashboard/farmer' },
    { label: 'My Profile', icon: FiUser, path: '/dashboard/farmer/profile' },
    { label: 'Crop Information', icon: FiGrid, path: '/dashboard/farmer/crops' },
    { label: 'My Products', icon: FiPackage, path: '/dashboard/farmer/products' },
    { label: 'Reports', icon: FiFileText, path: '/dashboard/farmer/reports' },
    { label: 'Settings', icon: FiSettings, path: '/dashboard/farmer/settings' },
  ],
  mahila: [
    { label: 'Dashboard', icon: FiHome, path: '/dashboard/mahila' },
    { label: 'Group Profile', icon: FiUsers, path: '/dashboard/mahila/profile' },
    { label: 'Members', icon: FiUser, path: '/dashboard/mahila/members' },
    { label: 'Products', icon: FiPackage, path: '/dashboard/mahila/products' },
    { label: 'Machines', icon: FiGrid, path: '/dashboard/mahila/machines' },
    { label: 'Reports', icon: FiFileText, path: '/dashboard/mahila/reports' },
  ],
};

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const items = menuItems[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Modal isOpen={showLogout} onClose={() => setShowLogout(false)} size="sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiAlertTriangle className="text-red-500" size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Confirm Logout</h3>
          <p className="text-sm text-gray-500 mb-6">Are you sure you want to log out?</p>
          <div className="flex gap-3">
            <button onClick={() => setShowLogout(false)} className="btn-outline flex-1 text-sm">Cancel</button>
            <button onClick={handleLogout} className="btn-primary flex-1 text-sm bg-red-600 hover:bg-red-700">Logout</button>
          </div>
        </div>
      </Modal>

      <motion.aside
      initial={{ width: collapsed ? 72 : 260 }}
      animate={{ width: collapsed ? 72 : 260 }}
      className="fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-30 overflow-hidden flex flex-col"
    >
      <div className="flex items-center justify-between p-4 h-20 border-b border-gray-100 dark:border-gray-800">
        {!collapsed && (
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white text-sm">Gram Sampan</h2>
            <p className="text-xs text-primary-600 capitalize">{user?.role}</p>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-3' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={20} />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <button onClick={() => setShowLogout(true)} className={`sidebar-link w-full ${collapsed ? 'justify-center' : ''}`}>
          <FiLogOut size={20} />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </motion.aside>
    </>
  );
}
