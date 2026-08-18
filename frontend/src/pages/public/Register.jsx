import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFeather, FiUser, FiSmartphone, FiLock, FiMapPin, FiMail, FiArrowLeft, FiCheckCircle, FiSend, FiShield } from 'react-icons/fi';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const roles = [
  { value: 'farmer', label: 'Farmer', icon: '👨‍🌾', desc: 'Register as a Farmer' },
  { value: 'mahila', label: 'Mahila Bachat Gath', icon: '👩‍👩‍👧‍👧', desc: 'Register as SHG' },
  { value: 'crp', label: 'CRP Tai', icon: '👩‍💼', desc: 'Register as CRP Tai' },
  { value: 'admin', label: 'Admin', icon: <FiShield className="text-yellow-500 mx-auto" size={24} />, desc: 'Register as Admin' },
];

export default function Register() {
  const [searchParams] = useSearchParams();
  const isAdminReg = searchParams.get('role') === 'admin';
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', confirmPassword: '', role: isAdminReg ? 'admin' : 'farmer', village: '', taluka: '', district: '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [sentTo, setSentTo] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const { fetchProfile } = useAuth();

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (!form.email && !form.mobile) return toast.error('Enter email or mobile to receive OTP');

    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email, mobile: form.mobile, role: form.role, village: form.village, taluka: form.taluka, district: form.district };
      const { data } = await API.post('/auth/register/send-otp', payload);
      setSentTo(data.sentTo);
      setStep(2);
      setResendTimer(30);
      toast.success(`OTP sent to ${data.sentTo}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const handleVerifyOTP = async () => {
    const code = otp.join('');
    if (code.length !== 6) return toast.error('Enter complete OTP');

    setLoading(true);
    try {
      const { data } = await API.post('/auth/register/verify', {
        email: form.email,
        mobile: form.mobile,
        otp: code,
        password: form.password,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      await fetchProfile();
      toast.success('Registration successful! Welcome aboard.');
      const paths = { admin: '/dashboard/admin', crp: '/dashboard/crp', farmer: '/dashboard/farmer', mahila: '/dashboard/mahila' };
      navigate(paths[data.user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally { setLoading(false); }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`reg-otp-${index + 1}`)?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950 py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/30"><FiFeather className="text-white" size={32} /></div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{step === 1 ? 'Create Account' : 'Verify OTP'}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {step === 1 ? 'Join Gram Sampan Agro Ltd' : `Enter OTP sent to ${sentTo}`}
          </p>
        </div>

        <div className="card min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">I am a</label>
                  <div className="grid grid-cols-4 gap-3">
                    {roles.map((r) => (
                      <button key={r.value} type="button" onClick={() => setForm({...form, role: r.value})} className={`p-3 rounded-xl border-2 text-center transition-all ${form.role === r.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                        <span className={`block mb-1 ${r.value === 'admin' ? '' : 'text-2xl'}`}>{r.icon}</span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{r.label}</span>
                      </button>
                    ))}
                  </div>
                  {isAdminReg && <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"><p className="text-xs text-yellow-700 dark:text-yellow-300 text-center"><FiShield className="inline mr-1" />Admin registration — only for the website owner.</p></div>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label><div className="relative"><FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Full Name" className="input-field pl-10" required /></div></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mobile Number</label><div className="relative"><FiSmartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="tel" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} placeholder="Mobile Number" className="input-field pl-10" required /></div></div>
                </div>

                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label><div className="relative"><FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email (required for OTP)" className="input-field pl-10" required /></div></div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Village</label><div className="relative"><FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={form.village} onChange={e => setForm({...form, village: e.target.value})} placeholder="Village" className="input-field pl-10" /></div></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Taluka</label><input type="text" value={form.taluka} onChange={e => setForm({...form, taluka: e.target.value})} placeholder="Taluka" className="input-field" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">District</label><input type="text" value={form.district} onChange={e => setForm({...form, district: e.target.value})} placeholder="District" className="input-field" /></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label><div className="relative"><FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Min 6 characters" className="input-field pl-10" required /></div></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label><input type="password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} placeholder="Confirm password" className="input-field" required /></div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                  {loading ? 'Sending OTP...' : <><FiSend className="inline mr-2" />Send OTP</>}
                </button>

                {isAdminReg ? (
                  <div className="space-y-3">
                    <p className="text-center text-sm text-gray-500">Already have an admin account? <Link to="/login?role=admin" className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 font-semibold">Sign in</Link></p>
                    <p className="text-center text-sm text-gray-400"><Link to="/register" className="hover:text-gray-600 dark:hover:text-gray-300">← User Registration</Link></p>
                  </div>
                ) : (
                  <>
                    <p className="text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-semibold">Sign in</Link></p>
                    <div className="relative my-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div><div className="relative flex justify-center"><span className="px-4 bg-white dark:bg-gray-900 text-sm text-gray-500">Admin</span></div></div>
                    <Link to="/register?role=admin" className="btn-outline w-full text-center block border-yellow-400 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-600 dark:text-yellow-400 text-sm"><FiShield className="inline mr-1" />Admin Registration</Link>
                  </>
                )}
              </motion.form>
            ) : (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4"><FiCheckCircle className="text-green-600 dark:text-green-400" size={32} /></div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Enter the 6-digit OTP sent to</p>
                  <p className="text-gray-900 dark:text-white font-semibold">{sentTo}</p>
                </div>

                <div className="flex gap-3 justify-center">
                  {otp.map((digit, i) => (
                    <input key={i} id={`reg-otp-${i}`} type="text" maxLength={1} value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all" />
                  ))}
                </div>

                <button onClick={handleVerifyOTP} disabled={loading} className="btn-primary w-full">
                  {loading ? 'Verifying...' : 'Verify & Register'}
                </button>

                <div className="text-center space-y-2">
                  <button onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']); }} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    <FiArrowLeft size={14} /> Change details
                  </button>
                  <br />
                  <button onClick={handleSendOTP} disabled={loading || resendTimer > 0} className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 disabled:text-gray-400 disabled:cursor-not-allowed">
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
