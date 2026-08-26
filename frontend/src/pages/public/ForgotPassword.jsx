import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFeather, FiArrowLeft, FiSmartphone, FiMail } from 'react-icons/fi';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [method, setMethod] = useState('mobile');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const identifier = method === 'mobile' ? mobile : email;
  const sentToLabel = method === 'mobile' ? mobile : email;

  const sendOTP = async () => {
    if (!identifier) return toast.error(`Enter your ${method === 'mobile' ? 'mobile number' : 'email'}`);
    if (loading) return;
    setLoading(true);
    try {
      const payload = method === 'mobile' ? { mobile } : { email };
      const { data } = await API.post('/auth/forgot-password', payload);
      toast.success(`OTP sent to ${data.sentTo || identifier}`);
      setStep(2);
      setResendTimer(30);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  const resetPassword = async () => {
    if (password !== confirmPassword) return toast.error('Passwords do not match');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    const code = otp.join('');
    if (code.length !== 6) return toast.error('Enter complete OTP');
    if (loading) return;
    setLoading(true);
    try {
      const payload = { otp: code, password };
      if (method === 'mobile') payload.mobile = mobile;
      else payload.email = email;
      await API.post('/auth/reset-password', payload);
      toast.success('Password reset successfully! Please login.');
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950 py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl"><FiFeather className="text-white" size={32} /></div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
        </div>
        <div className="card">
          {step === 1 ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 text-center">Enter your registered contact to receive OTP</p>

              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <button onClick={() => setMethod('mobile')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${method === 'mobile' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                  <FiSmartphone size={16} /> Mobile
                </button>
                <button onClick={() => setMethod('email')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${method === 'email' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                  <FiMail size={16} /> Email
                </button>
              </div>

              {method === 'mobile' ? (
                <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="Enter mobile number" className="input-field text-center" />
              ) : (
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email address" className="input-field text-center" />
              )}
              <button onClick={sendOTP} disabled={loading} className="btn-primary w-full">{loading ? 'Sending...' : 'Send OTP'}</button>
            </div>
          ) : step === 2 ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 text-center">OTP sent to <strong>{sentToLabel}</strong></p>
              <div className="flex gap-3 justify-center">{otp.map((d, i) => <input key={i} type="text" maxLength={1} value={d} onChange={e => { const n = [...otp]; n[i] = e.target.value; setOtp(n); if (e.target.value && i < 5) document.getElementById(`fp-${i+1}`)?.focus(); }} id={`fp-${i}`} className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary-500 outline-none" />)}</div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New password" className="input-field" />
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="input-field" />
              <button onClick={resetPassword} disabled={loading} className="btn-primary w-full">{loading ? 'Resetting...' : 'Reset Password'}</button>
              <div className="text-center">
                <button onClick={() => { setStep(1); setOtp(['','','','','','']); }} className="text-sm text-gray-500 hover:text-gray-700">Change contact</button>
                <span className="mx-2 text-gray-300">|</span>
                <button onClick={sendOTP} disabled={loading || resendTimer > 0} className="text-sm text-primary-600 hover:text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed">
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto"><span className="text-3xl">✓</span></div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Password Reset Successfully!</h2>
              <Link to="/login" className="btn-primary inline-block">Go to Login</Link>
            </div>
          )}
          <div className="mt-4 text-center"><Link to="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"><FiArrowLeft size={14} /> Back to login</Link></div>
        </div>
      </motion.div>
    </div>
  );
}