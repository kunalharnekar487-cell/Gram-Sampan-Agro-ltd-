import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiUser, FiShield, FiPackage, FiCheckCircle, FiXCircle, FiClock, FiMap, FiDollarSign, FiBarChart2, FiRefreshCw, FiList, FiBell, FiSun, FiCloud, FiAlertTriangle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatsCard from '../../components/ui/StatsCard';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const COLORS = ['#2E7D32', '#66BB6A', '#FFB300', '#EF5350', '#42A5F5', '#AB47BC'];

const incomeLabels = {
  'below_50000': 'Below ₹50k', '50000_100000': '₹50k-1L',
  '100000_200000': '₹1L-2L', '200000_300000': '₹2L-3L',
  '300000_500000': '₹3L-5L', 'above_500000': 'Above ₹5L',
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [villageData, setVillageData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [cropData, setCropData] = useState({ summerCrops: [], monsoonCrops: [] });
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [statsRes, villageRes, monthlyRes, stockRes, cropRes, incomeRes] = await Promise.all([
        API.get('/reports/dashboard'),
        API.get('/reports/villages'),
        API.get('/reports/monthly'),
        API.get('/reports/stock'),
        API.get('/reports/crops'),
        API.get('/reports/income'),
      ]);
      setStats(statsRes.data.data);
      setVillageData(villageRes.data.data?.slice(0, 10) || []);
      const farmers = monthlyRes.data.data?.farmers || [];
      const groups = monthlyRes.data.data?.groups || [];
      const groupMap = {};
      groups.forEach(g => { groupMap[g._id] = g.count; });
      setMonthlyData(farmers.map(f => ({ month: getMonthName(f._id), farmers: f.count, groups: groupMap[f._id] || 0 })) || []);
      setStockData(stockRes.data.data?.map(s => ({ name: s._id, value: s.totalProducts })) || []);
      setCropData(cropRes.data.data || { summerCrops: [], monsoonCrops: [] });
      setIncomeData(incomeRes.data.data?.filter(d => d._id).map(d => ({ name: incomeLabels[d._id] || d._id, value: d.count })) || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const getMonthName = (num) => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][num - 1] || '';

  if (loading) return <LoadingSkeleton type="profile" count={8} />;

  const isCRP = user?.role === 'crp';

  const statCards = [
    { icon: FiUsers, label: 'Total Farmers', value: stats?.totalFarmers || 0, color: 'green' },
    { icon: FiUser, label: 'Mahila Groups', value: stats?.totalGroups || 0, color: 'purple' },
    { icon: FiShield, label: 'CRP Tais', value: isCRP ? '-' : (stats?.totalCRPs || 0), color: 'blue' },
    { icon: FiPackage, label: 'Products', value: stats?.totalProducts || 0, color: 'orange' },
    { icon: FiDollarSign, label: 'Total Quantity', value: stats?.totalQuantity ? `${stats.totalQuantity} kg` : 0, color: 'green' },
    { icon: FiMap, label: 'Villages', value: stats?.totalVillages || 0, color: 'green' },
    { icon: FiCheckCircle, label: 'Approved', value: stats?.approvals?.approved || 0, color: 'green' },
    { icon: FiClock, label: 'Pending', value: stats?.approvals?.submitted || 0, color: 'orange' },
    { icon: FiXCircle, label: 'Rejected', value: stats?.approvals?.rejected || 0, color: 'red' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isCRP ? 'Analytics' : 'Admin Dashboard'}</h1><p className="text-gray-500 dark:text-gray-400">Complete platform overview</p></div>
        <button onClick={fetchAll} className="btn-outline text-sm"><FiRefreshCw className="inline mr-1" />Refresh</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => <StatsCard key={i} {...card} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Registrations</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="farmers" name="Farmers" fill="#2E7D32" radius={[4, 4, 0, 0]} />
                <Bar dataKey="groups" name="Groups" fill="#66BB6A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stock by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stockData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                  {stockData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><FiSun className="text-yellow-500" /> Summer Crops</h2>
          {cropData.summerCrops?.length > 0 ? (
            <div className="space-y-2">
              {cropData.summerCrops.slice(0, 8).map((crop, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{crop._id}</span>
                  <span className="text-sm text-gray-500">{crop.count} farmer{crop.count > 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-center py-8 text-gray-500">No crop data available</p>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><FiCloud className="text-blue-500" /> Monsoon Crops</h2>
          {cropData.monsoonCrops?.length > 0 ? (
            <div className="space-y-2">
              {cropData.monsoonCrops.slice(0, 8).map((crop, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{crop._id}</span>
                  <span className="text-sm text-gray-500">{crop.count} farmer{crop.count > 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-center py-8 text-gray-500">No crop data available</p>}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Villages by Farmers</h2>
          {villageData.length > 0 ? (
            <div className="space-y-2">
              {villageData.map((v, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="flex items-center gap-3"><span className="text-sm text-gray-400 w-6">{i + 1}.</span><span className="text-sm font-medium text-gray-900 dark:text-white">{v._id || 'Unknown'}</span></div>
                  <div className="flex items-center gap-3"><span className="text-sm font-bold text-primary-600">{v.totalFarmers}</span><div className="w-24 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-primary-500 rounded-full" style={{ width: `${Math.min(100, (v.totalFarmers / (villageData[0]?.totalFarmers || 1)) * 100)}%` }} /></div></div>
                </div>
              ))}
            </div>
          ) : <p className="text-center py-8 text-gray-500">No village data available</p>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><FiDollarSign className="text-green-500" /> Income Distribution</h2>
          {incomeData.length > 0 ? (
            <div className="space-y-2">
              {incomeData.map((inc, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{inc.name}</span>
                  <div className="flex items-center gap-3"><span className="text-sm text-gray-500">{inc.value} farmer{inc.value > 1 ? 's' : ''}</span><div className="w-20 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(100, (inc.value / (incomeData[0]?.value || 1)) * 100)}%` }} /></div></div>
                </div>
              ))}
            </div>
          ) : <p className="text-center py-8 text-gray-500">No income data available</p>}
        </motion.div>
      </div>

      {stats?.lowStockCount > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-start gap-3">
          <FiAlertTriangle className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="font-medium text-red-800 dark:text-red-200">Low Stock Alert</p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{stats.lowStockCount} product{stats.lowStockCount > 1 ? 's' : ''} {' '} with quantity below 10{stats.lowStockProducts?.length > 0 && (
              <span>: {stats.lowStockProducts.map(p => `${p.name} (${p.quantity} ${p.unit})`).join(', ')}</span>
            )}</p>
          </div>
        </motion.div>
      )}

      {!isCRP && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Manage Farmers', path: '/dashboard/admin/farmers', icon: FiUsers, color: 'bg-green-50 dark:bg-green-900/20 text-green-600' },
                { label: 'Manage Groups', path: '/dashboard/admin/mahila-groups', icon: FiList, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' },
                { label: 'Manage CRP', path: '/dashboard/admin/crp', icon: FiShield, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
                { label: 'Products', path: '/dashboard/admin/products', icon: FiPackage, color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' },
                { label: 'Reports', path: '/dashboard/admin/reports', icon: FiBarChart2, color: 'bg-red-50 dark:bg-red-900/20 text-red-600' },
                { label: 'Notifications', path: '/dashboard/admin/notifications', icon: FiBell, color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600' },
              ].map((item, i) => (
                <Link key={i} to={item.path} className={`p-4 rounded-xl ${item.color} hover:opacity-80 transition-all`}>
                  <item.icon size={24} className="mb-2" /><p className="text-sm font-medium">{item.label}</p>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}