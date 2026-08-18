import { motion } from 'framer-motion';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300',
  danger: 'px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transform hover:scale-105 shadow-lg shadow-red-500/30 transition-all duration-300',
};

const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' };

export default function Button({ children, variant = 'primary', size = 'md', className = '', disabled, onClick, type = 'button', icon: Icon, loading }) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${variants[variant]} ${sizes[size]} ${className} ${(disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''} inline-flex items-center justify-center gap-2`}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
      ) : Icon ? <Icon size={20} /> : null}
      {children}
    </motion.button>
  );
}
