import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiGrid, FiPackage, FiFileText, FiAlertCircle, FiCheckCircle, FiClock, FiArrowRight, FiDollarSign } from 'react-icons/fi';
import StatsCard from '../../components/ui/StatsCard';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import Badge from '../../components/ui/Badge';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const requiredFields = ['fullName', 'village', 'landArea', 'farmingType', 'annualIncome', 'sellingMethod'];
const importantFields = ['summerCrops', 'monsoonCrops', 'farmingProblems', 'supportRequired'];

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalProducts: 0, approvedProducts: 0, totalQuantity: 0, products: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const getMissingFields = (p) => {
    const missing = [];
    requiredFields.forEach(f => { if (!p[f] || (Array.isArray(p[f]) && p[f].length === 0)) missing.push(f); });
    importantFields.forEach(f => { if (!p[f] || (Array.isArray(p[f]) && p[f].length === 0)) missing.push(f); });
    return missing;
  };

  const fieldLabels = {
    fullName: 'Full Name', village: 'Village', landArea: 'Land Area',
    farmingType: 'Farming Type', annualIncome: 'Annual Income',
    sellingMethod: 'Selling Method', summerCrops: 'Summer Crops',
    monsoonCrops: 'Monsoon Crops', farmingProblems: 'Farming Problems',
    supportRequired: 'Support Required',
  };

  const fetchData = async () => {
    try {
      const [profileRes, productsRes] = await Promise.all([
        API.get('/farmers/profile'),
        API.get('/products/my'),
      ]);
      setProfile(profileRes.data.data);
      const products = productsRes.data.data || [];
      setStats({
        totalProducts: productsRes.data.pagination?.total || products.length,
        approvedProducts: products.filter(p => p.isApproved).length || 0,
        totalQuantity: products.reduce((s, p) => s + (p.quantity || 0), 0),
        products,
      });
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  if (loading) return <LoadingSkeleton type="profile" count={4} />;

  const cards = [
    { icon: FiUser, label: 'Profile Status', value: profile?.status || 'draft', color: profile?.status === 'approved' ? 'green' : profile?.status === 'rejected' ? 'red' : 'orange', trend: null },
    { icon: FiGrid, label: 'Land Area', value: profile?.landArea ? `${profile.landArea} acres` : 'Not set', color: 'blue' },
    { icon: FiPackage, label: 'My Products', value: stats.totalProducts, color: 'purple' },
    { icon: FiCheckCircle, label: 'Approved Products', value: stats.approvedProducts, color: 'green' },
    { icon: FiDollarSign, label: 'Total Quantity', value: stats.totalQuantity ? `${stats.totalQuantity} kg` : '0 kg', color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">Farmer Dashboard</p>
        </div>
        <Badge status={profile?.status || 'draft'}>{profile?.status || 'Draft'}</Badge>
      </div>

      {profile && getMissingFields(profile).length > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl flex items-start gap-3">
          <FiAlertCircle className="text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="font-medium text-yellow-800 dark:text-yellow-200">Your profile is incomplete</p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">Missing: {getMissingFields(profile).map(f => fieldLabels[f]).join(', ')}</p>
            <Link to="/dashboard/farmer/profile" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:underline">
              Complete profile <FiArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card, i) => <StatsCard key={i} {...card} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Edit Profile', path: '/dashboard/farmer/profile', icon: FiUser, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
              { label: 'Add Crop Info', path: '/dashboard/farmer/crops', icon: FiGrid, color: 'bg-green-50 dark:bg-green-900/20 text-green-600' },
              { label: 'My Products', path: '/dashboard/farmer/products', icon: FiPackage, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' },
              { label: 'Reports', path: '/dashboard/farmer/reports', icon: FiFileText, color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' },
            ].map((item, i) => (
              <Link key={i} to={item.path} className={`p-4 rounded-xl ${item.color} hover:opacity-80 transition-all`}>
                <item.icon size={24} className="mb-2" />
                <p className="text-sm font-medium">{item.label}</p>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Summary</h2>
          <div className="space-y-3">
            {[
              { label: 'Full Name', value: profile?.fullName },
              { label: 'Village', value: profile?.village },
              { label: 'Taluka', value: profile?.taluka },
              { label: 'District', value: profile?.district },
              { label: 'Farming Type', value: profile?.farmingType || 'Not set' },
              { label: 'Annual Income', value: profile?.annualIncome || 'Not set' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-1"><span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span><span className="text-sm font-medium text-gray-900 dark:text-white">{item.value || '-'}</span></div>
            ))}
          </div>
        </motion.div>
      </div>

      {stats.products.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Quantity Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Product</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Category</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Quantity</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.products.map((p) => (
                  <tr key={p._id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{p.name}</td>
                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400 capitalize">{p.category}</td>
                    <td className="py-3 px-4 text-right text-gray-900 dark:text-white font-medium">{p.quantity} {p.unit}</td>
                    <td className="py-3 px-4 text-right">{p.isApproved ? <span className="text-green-600 text-xs font-medium">Approved</span> : <span className="text-orange-600 text-xs font-medium">Pending</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
