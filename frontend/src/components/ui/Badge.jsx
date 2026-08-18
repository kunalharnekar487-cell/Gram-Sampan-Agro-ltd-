const statusStyles = {
  draft: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  submitted: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  approved: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  rejected: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  active: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  inactive: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  available: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  out_of_stock: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  discontinued: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
};

export default function Badge({ status, children }) {
  return (
    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-600'}`}>
      {children || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
