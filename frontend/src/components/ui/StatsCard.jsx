import { motion } from 'framer-motion';

const colorMap = {
  green: 'from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 text-green-600 dark:text-green-400',
  blue: 'from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/20 text-blue-600 dark:text-blue-400',
  purple: 'from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/20 text-purple-600 dark:text-purple-400',
  orange: 'from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/20 text-orange-600 dark:text-orange-400',
  red: 'from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/20 text-red-600 dark:text-red-400',
  yellow: 'from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/20 text-yellow-600 dark:text-yellow-400',
};

const iconBgMap = {
  green: 'bg-green-100 dark:bg-green-800/40',
  blue: 'bg-blue-100 dark:bg-blue-800/40',
  purple: 'bg-purple-100 dark:bg-purple-800/40',
  orange: 'bg-orange-100 dark:bg-orange-800/40',
  red: 'bg-red-100 dark:bg-red-800/40',
  yellow: 'bg-yellow-100 dark:bg-yellow-800/40',
};

export default function StatsCard({ icon: Icon, label, value, color = 'green', trend }) {
  const gradient = colorMap[color] || colorMap.green;
  const iconBg = iconBgMap[color] || iconBgMap.green;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{label}</p>
    </motion.div>
  );
}
