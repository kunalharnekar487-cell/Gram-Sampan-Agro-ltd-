import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiFileText, FiBarChart2, FiUsers, FiPackage, FiMap, FiCalendar, FiRefreshCw } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import StatsCard from '../../components/ui/StatsCard';

const COLORS = ['#2E7D32', '#66BB6A', '#FFB300', '#EF5350', '#42A5F5', '#AB47BC', '#26A69A', '#FF7043'];

const incomeLabels = {
  below_50000: 'Below ₹50k',
  50000_100000: '₹50k-1L',
  100000_200000: '₹1L-2L',
  200000_300000: '₹2L-3L',
  300000_500000: '₹3L-5L',
  above_500000: 'Above ₹5L',
};

const reportTabs = [
  { key: 'overview', label: 'Overview', icon: FiBarChart2 },
  { key: 'villages', label: 'Village Reports', icon: FiMap },
  { key: 'crops', label: 'Crop Reports', icon: FiFileText },
  { key: 'income', label: 'Income Reports', icon: FiBarChart2 },
  { key: 'stock', label: 'Stock Reports', icon: FiPackage },
  { key: 'monthly', label: 'Monthly Reports', icon: FiCalendar },
];

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [villageData, setVillageData] = useState([]);
  const [cropData, setCropData] = useState({ summerCrops: [], monsoonCrops: [] });
  const [incomeData, setIncomeData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, villageRes, cropRes, incomeRes, stockRes, monthlyRes] = await Promise.all([
        API.get('/reports/dashboard'),
        API.get('/reports/villages'),
        API.get('/reports/crops'),
        API.get('/reports/income'),
        API.get('/reports/stock'),
        API.get('/reports/monthly'),
      ]);

      setStats(statsRes.data.data);
      setVillageData(villageRes.data.data || []);
      setCropData(cropRes.data.data || { summerCrops: [], monsoonCrops: [] });
      setIncomeData(incomeRes.data.data || []);
      setStockData(stockRes.data.data || []);

      const farmers = monthlyRes.data.data?.farmers || [];
      const groups = monthlyRes.data.data?.groups || [];
      const groupMap = {};
      groups.forEach((g) => { groupMap[g._id] = g.count; });
      setMonthlyData(
        farmers.map((f) => ({
          month: getMonthName(f._id),
          farmers: f.count,
          groups: groupMap[f._id] || 0,
        })) || []
      );
    } catch (err) {
      console.error(err);
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (num) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][num - 1] || '';

  const handleExport = (format) => {
    toast.success(`Exporting ${format.toUpperCase()} report...`);
  };

  if (loading) return <LoadingSkeleton type="profile" count={8} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400">Comprehensive reports and data analytics</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAllData} className="btn-outline text-sm"><FiRefreshCw className="inline mr-1" />Refresh</button>
          <button onClick={() => handleExport('pdf')} className="btn-primary text-sm"><FiDownload className="inline mr-1" />Export PDF</button>
          <button onClick={() => handleExport('excel')} className="btn-outline text-sm"><FiDownload className="inline mr-1" />Export Excel</button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {reportTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard icon={FiUsers} label="Total Farmers" value={stats?.totalFarmers || 0} color="green" />
            <StatsCard icon={FiUsers} label="Mahila Groups" value={stats?.totalGroups || 0} color="purple" />
            <StatsCard icon={FiPackage} label="Total Products" value={stats?.totalProducts || 0} color="blue" />
            <StatsCard icon={FiMap} label="Villages" value={stats?.totalVillages || 0} color="orange" />
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
                    <Legend />
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
                    <Pie
                      data={stockData.map((s) => ({ name: s._id, value: s.totalProducts }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stockData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {activeTab === 'villages' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Village-wise Farmer Distribution</h2>
          {villageData.length > 0 ? (
            <div className="space-y-3">
              {villageData.map((v, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 w-8">{i + 1}.</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{v._id || 'Unknown Village'}</p>
                      <p className="text-xs text-gray-500">{v.totalGroups || 0} groups</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-primary-600">{v.totalFarmers} farmers</span>
                    <div className="w-32 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (v.totalFarmers / (villageData[0]?.totalFarmers || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-12 text-gray-500">No village data available</p>
          )}
        </motion.div>
      )}

      {activeTab === 'crops' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Summer Crops</h2>
            {cropData.summerCrops?.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cropData.summerCrops.slice(0, 10).map((c) => ({ name: c._id, farmers: c.count }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    <Bar dataKey="farmers" fill="#FFB300" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center py-12 text-gray-500">No summer crop data</p>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monsoon Crops</h2>
            {cropData.monsoonCrops?.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cropData.monsoonCrops.slice(0, 10).map((c) => ({ name: c._id, farmers: c.count }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    <Bar dataKey="farmers" fill="#42A5F5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center py-12 text-gray-500">No monsoon crop data</p>
            )}
          </motion.div>
        </div>
      )}

      {activeTab === 'income' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Income Distribution</h2>
          {incomeData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeData.filter((d) => d._id).map((d) => ({ name: incomeLabels[d._id] || d._id, count: d.count }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Bar dataKey="count" name="Farmers" fill="#2E7D32" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center py-12 text-gray-500">No income data available</p>
          )}
        </motion.div>
      )}

      {activeTab === 'stock' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stock by Category</h2>
          {stockData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Category</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Total Products</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Total Quantity</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Avg Price</th>
                  </tr>
                </thead>
                <tbody>
                  {stockData.map((s, i) => (
                    <tr key={i} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white capitalize">{s._id}</td>
                      <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{s.totalProducts}</td>
                      <td className="py-3 px-4 text-right text-gray-900 dark:text-white font-medium">{s.totalQuantity} kg</td>
                      <td className="py-3 px-4 text-right text-primary-600">₹{Math.round(s.avgPrice || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-12 text-gray-500">No stock data available</p>
          )}
        </motion.div>
      )}

      {activeTab === 'monthly' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Registration Trend</h2>
          {monthlyData.length > 0 ? (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="farmers" name="Farmers" stroke="#2E7D32" strokeWidth={3} dot={{ fill: '#2E7D32' }} />
                  <Line type="monotone" dataKey="groups" name="Groups" stroke="#66BB6A" strokeWidth={3} dot={{ fill: '#66BB6A' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center py-12 text-gray-500">No monthly data available</p>
          )}
        </motion.div>
      )}
    </div>
  );
}
