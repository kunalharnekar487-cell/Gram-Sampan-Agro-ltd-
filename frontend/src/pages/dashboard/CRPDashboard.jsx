import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiUser, FiMap, FiPackage, FiCheckCircle, FiClock, FiBarChart2, FiSearch, FiDownload, FiArrowUp, FiTag, FiDollarSign, FiAlertTriangle } from 'react-icons/fi';
import StatsCard from '../../components/ui/StatsCard';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const categoryLabels = {
  vegetables: 'Vegetables', fruits: 'Fruits', grains: 'Grains',
  spices: 'Spices', pickles: 'Pickles', papad: 'Papad',
  masala: 'Masala', handmade: 'Handmade', organic: 'Organic', other: 'Other',
};

export default function CRPDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/reports/dashboard')
      .then(res => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton count={6} />;

  const totalQty = stats?.categorySummary?.reduce((s, c) => s + c.totalQuantity, 0) || 0;
  const totalValue = stats?.categorySummary?.reduce((s, c) => s + c.totalQuantity * c.avgPrice, 0) || 0;

  const roleBadge = (role) => {
    if (role === 'farmer') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    if (role === 'mahila') return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CRP Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome, {user?.name}</p>
        </div>
        <Link to="/dashboard/crp/stock" className="btn-outline text-sm flex items-center gap-2">
          <FiDownload size={14} /> Export
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={FiUsers} label="Total Farmers" value={stats?.totalFarmers || 0} color="green" />
        <StatsCard icon={FiUser} label="Mahila Groups" value={stats?.totalGroups || 0} color="purple" />
        <StatsCard icon={FiPackage} label="Total Products" value={stats?.totalProducts || 0} color="green" />
        <StatsCard icon={FiDollarSign} label="Total Quantity" value={stats?.totalQuantity ? `${stats.totalQuantity} kg` : 0} color="orange" />
      </div>

      {stats?.lowStockCount > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-start gap-3">
          <FiAlertTriangle className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="font-medium text-red-800 dark:text-red-200">Low Stock Alert</p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{stats.lowStockCount} product{stats.lowStockCount > 1 ? 's' : ''} with quantity below 10{stats.lowStockProducts?.length > 0 && (
              <span>: {stats.lowStockProducts.map(p => `${p.name} (${p.quantity} ${p.unit})`).join(', ')}</span>
            )}</p>
          </div>
        </motion.div>
      )}

      {stats?.categorySummary?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Product Summary by Category</h2>
            <div className="flex gap-4 text-sm">
              <span className="text-gray-500"><strong className="text-gray-900 dark:text-white">{totalQty}</strong> total qty</span>
              <span className="text-gray-500"><strong className="text-gray-900 dark:text-white">₹{totalValue.toLocaleString()}</strong> estimated value</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Category</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Products</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Total Qty</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Avg Price</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Est. Value</th>
                </tr>
              </thead>
              <tbody>
                {stats.categorySummary.map((cat, i) => (
                  <tr key={cat._id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{categoryLabels[cat._id] || cat._id}</td>
                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{cat.totalProducts}</td>
                    <td className="py-3 px-4 text-right text-gray-900 dark:text-white font-medium">{cat.totalQuantity} kg</td>
                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">₹{Math.round(cat.avgPrice)}</td>
                    <td className="py-3 px-4 text-right text-primary-600 dark:text-primary-400 font-medium">₹{Math.round(cat.totalQuantity * cat.avgPrice).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Product Submissions</h2>
          {stats?.products?.length > 0 ? (
            <div className="space-y-3">
              {stats.products.slice(0, 6).map((product) => (
                <div key={product._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${roleBadge(product.userId?.role)}`}>
                        {product.userId?.role}
                      </span>
                      <span className="text-xs text-gray-500">{product.userId?.name}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium text-gray-900 dark:text-white">{product.quantity} {product.unit}</p>
                    <p className="text-sm text-gray-500">₹{product.price}/{product.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">No products submitted yet</p>
          )}
          <Link to="/dashboard/crp/stock" className="mt-4 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium inline-block">View all products →</Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Approvals</h2>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
              {stats?.pendingProducts?.length || 0} pending
            </span>
          </div>
          {stats?.pendingProducts?.length > 0 ? (
            <div className="space-y-3">
              {stats.pendingProducts.slice(0, 5).map((product) => (
                <div key={product._id} className="flex items-center justify-between p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{product.userId?.name} · {product.village}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium text-gray-900 dark:text-white">{product.quantity} {product.unit}</p>
                    <p className="text-xs text-orange-600">Awaiting review</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiCheckCircle size={40} className="mx-auto text-green-400 mb-2" />
              <p className="text-gray-500">All products approved</p>
            </div>
          )}
          {stats?.pendingProducts?.length > 0 && (
            <Link to="/dashboard/crp/stock" className="mt-4 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium inline-block">Review pending →</Link>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { label: 'View Farmers', path: '/dashboard/crp/farmers', icon: FiUsers, color: 'bg-green-50 dark:bg-green-900/20 text-green-600', desc: 'Manage farmer profiles' },
          { label: 'View SHGs', path: '/dashboard/crp/mahila-groups', icon: FiUser, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600', desc: 'Manage Mahila groups' },
          { label: 'Village Reports', path: '/dashboard/crp/village-reports', icon: FiMap, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600', desc: 'View village data' },
          { label: 'Stock Overview', path: '/dashboard/crp/stock', icon: FiPackage, color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600', desc: 'All products & stock' },
          { label: 'Search', path: '/dashboard/crp/farmers', icon: FiSearch, color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600', desc: 'Search records' },
          { label: 'Analytics', path: '/dashboard/crp/analytics', icon: FiBarChart2, color: 'bg-red-50 dark:bg-red-900/20 text-red-600', desc: 'View analytics' },
        ].map((item, i) => (
          <Link key={i} to={item.path} className="card flex items-center gap-4 p-4 hover:shadow-lg transition-all">
            <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
              <item.icon size={24} />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}