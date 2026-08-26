import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFeather, FiEye, FiEyeOff, FiSmartphone, FiMail, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [searchParams] = useSearchParams();
  const isAdminLogin = searchParams.get('role') === 'admin';
  const [method, setMethod] = useState(isAdminLogin ? 'email' : 'mobile');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if ((method === 'mobile' && !mobile) || (method === 'email' && !email) || !password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const data = method === 'mobile' ? await login(mobile, password) : await login(null, password, email);
      toast.success(`Welcome ${data.user.name}!`);
      const paths = { admin: '/dashboard/admin', crp: '/dashboard/crp', farmer: '/dashboard/farmer', mahila: '/dashboard/mahila' };
      navigate(paths[data.user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950 py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          {isAdminLogin ? (
            <><div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-yellow-500/30"><FiShield className="text-white" size={32} /></div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin / Owner Login</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Secure admin access only</p></>
          ) : (
            <><div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/30"><FiFeather className="text-white" size={32} /></div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to your account</p></>
          )}
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button type="button" onClick={() => setMethod('mobile')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${method === 'mobile' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                <FiSmartphone size={16} /> Mobile
              </button>
              <button type="button" onClick={() => setMethod('email')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${method === 'email' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                <FiMail size={16} /> Email
              </button>
            </div>

            {method === 'mobile' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mobile Number</label>
                <div className="relative"><FiSmartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="Enter mobile number" className="input-field pl-10" /></div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <div className="relative"><FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email address" className="input-field pl-10" /></div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className="input-field pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}</button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" /> Remember me</label>
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">Forgot Password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Signing in...' : 'Sign In'}</button>
          </form>

          {!isAdminLogin && (
            <>
              <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div><div className="relative flex justify-center"><span className="px-4 bg-white dark:bg-gray-900 text-sm text-gray-500">Or login with OTP</span></div></div>
              <Link to="/login-otp" className="btn-outline w-full text-center block">Login with OTP</Link>

              <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div><div className="relative flex justify-center"><span className="px-4 bg-white dark:bg-gray-900 text-sm text-gray-500">Admin Access</span></div></div>
              <Link to="/login?role=admin" className="btn-outline w-full text-center block border-yellow-400 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-600 dark:text-yellow-400"><FiShield className="inline mr-2" />Admin / Owner Login</Link>

              <p className="text-center text-sm text-gray-500 mt-6">Don't have an account? <Link to="/register" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-semibold">Register here</Link></p>
            </>
          )}
          {isAdminLogin && (
            <>
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <p className="text-xs text-yellow-700 dark:text-yellow-300 text-center">This login is for the website owner / admin only. Use your registered email and password.</p>
              </div>
              <div className="text-center mt-4">
                <Link to="/login" className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">← User Login</Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}