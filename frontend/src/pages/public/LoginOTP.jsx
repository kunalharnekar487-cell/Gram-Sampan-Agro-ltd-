import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFeather, FiArrowLeft } from 'react-icons/fi';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function LoginOTP() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const { fetchProfile } = useAuth();

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const sendOTP = async () => {
    if (!mobile) return toast.error('Enter mobile number');
    if (loading) return;
    setLoading(true);
    try {
      await API.post('/auth/send-otp', { mobile });
      toast.success('OTP sent successfully');
      setStep(2);
      setResendTimer(30);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const verifyOTP = async () => {
    const code = otp.join('');
    if (code.length !== 6) return toast.error('Enter complete OTP');
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await API.post('/auth/verify-otp', { mobile, otp: code });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      await fetchProfile();
      toast.success('Login successful!');
      const paths = { admin: '/dashboard/admin', crp: '/dashboard/crp', farmer: '/dashboard/farmer', mahila: '/dashboard/mahila' };
      navigate(paths[data.user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950 py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/30"><FiFeather className="text-white" size={32} /></div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">OTP Login</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{step === 1 ? 'Enter your mobile number' : 'Enter the OTP sent to your mobile'}</p>
        </div>

        <div className="card">
          {step === 1 ? (
            <div className="space-y-4">
              <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="Enter mobile number" className="input-field text-center text-lg" />
              <button onClick={sendOTP} disabled={loading} className="btn-primary w-full">{loading ? 'Sending...' : 'Send OTP'}</button>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-center text-sm text-gray-500">OTP sent to <strong>{mobile}</strong></p>
              <div className="flex gap-3 justify-center">
                {otp.map((digit, i) => (
                  <input key={i} id={`otp-${i}`} type="text" maxLength={1} value={digit} onChange={e => handleOtpChange(i, e.target.value)} className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none" />
                ))}
              </div>
              <button onClick={verifyOTP} disabled={loading} className="btn-primary w-full">{loading ? 'Verifying...' : 'Verify OTP'}</button>
              <div className="text-center space-y-1">
                <button onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']); }} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Change mobile number</button>
                <br />
                <button onClick={sendOTP} disabled={loading || resendTimer > 0} className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 disabled:text-gray-400 disabled:cursor-not-allowed">
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"><FiArrowLeft size={14} /> Back to password login</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
