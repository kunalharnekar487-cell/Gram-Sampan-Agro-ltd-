import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiPackage, FiGrid, FiFileText, FiUserPlus, FiEdit3, FiDollarSign } from 'react-icons/fi';
import StatsCard from '../../components/ui/StatsCard';
import Badge from '../../components/ui/Badge';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function MahilaDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productStats, setProductStats] = useState({ total: 0, totalQuantity: 0, approved: 0 });

  useEffect(() => {
    Promise.all([
      API.get('/mahila-groups/profile'),
      API.get('/products/my'),
    ])
      .then(([profileRes, productsRes]) => {
        setProfile(profileRes.data.data);
        const products = productsRes.data.data || [];
        setProductStats({
          total: products.length,
          totalQuantity: products.reduce((s, p) => s + (p.quantity || 0), 0),
          approved: products.filter(p => p.isApproved).length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton count={4} />;

  const cards = [
    { icon: FiUsers, label: 'Members', value: profile?.members?.length || 0, color: 'purple' },
    { icon: FiPackage, label: 'Products Listed', value: productStats.total, color: 'green' },
    { icon: FiDollarSign, label: 'Total Quantity', value: productStats.totalQuantity ? `${productStats.totalQuantity} kg` : '0 kg', color: 'orange' },
    { icon: FiGrid, label: 'Machines', value: profile?.machinesAvailable?.length || 0, color: 'blue' },
    { icon: FiFileText, label: 'Status', value: profile?.status || 'draft', color: profile?.status === 'approved' ? 'green' : 'orange' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.groupName || 'Welcome'}</h1>
          <p className="text-gray-500 dark:text-gray-400">Mahila Bachat Gath Dashboard</p>
        </div>
        <Badge status={profile?.status || 'draft'}>{profile?.status || 'Draft'}</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card, i) => <StatsCard key={i} {...card} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Edit Profile', path: '/dashboard/mahila/profile', icon: FiEdit3, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' },
              { label: 'Add Members', path: '/dashboard/mahila/members', icon: FiUserPlus, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
              { label: 'Products', path: '/dashboard/mahila/products', icon: FiPackage, color: 'bg-green-50 dark:bg-green-900/20 text-green-600' },
              { label: 'Reports', path: '/dashboard/mahila/reports', icon: FiFileText, color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' },
            ].map((item, i) => (
              <Link key={i} to={item.path} className={`p-4 rounded-xl ${item.color} hover:opacity-80 transition-all`}>
                <item.icon size={24} className="mb-2" /><p className="text-sm font-medium">{item.label}</p>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Group Summary</h2>
          <div className="space-y-3">
            {[
              { label: 'Group Name', value: profile?.groupName },
              { label: 'Village', value: profile?.village },
              { label: 'Taluka', value: profile?.taluka },
              { label: 'District', value: profile?.district },
              { label: 'Contact', value: profile?.contactNumber },
              { label: 'Annual Income', value: profile?.annualIncome || 'Not set' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between py-1"><span className="text-sm text-gray-500">{item.label}</span><span className="text-sm font-medium text-gray-900 dark:text-white">{item.value || '-'}</span></div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
