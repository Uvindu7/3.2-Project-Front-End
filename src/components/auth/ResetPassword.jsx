import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', isSuccess: false });

  const { email, code, newPassword, confirmPassword } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setToast({ show: true, message: 'Passwords do not match', isSuccess: false });
      setTimeout(() => setToast({ show: false, message: '', isSuccess: false }), 4000);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email,
        code,
        newPassword
      });
      setToast({ show: true, message: res.data.message || 'Password reset successful!', isSuccess: true });
      setTimeout(() => {
        setToast({ show: false, message: '', isSuccess: false });
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: err.response?.data?.message || 'Invalid or expired code.', isSuccess: false });
      setTimeout(() => {
        setToast({ show: false, message: '', isSuccess: false });
      }, 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Toast Alert */}
      {toast.show && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border transition-all duration-300
          ${toast.isSuccess 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800' 
            : 'bg-rose-500/15 border-rose-500/30 text-rose-800'
          }`}
        >
          {toast.isSuccess ? (
            <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg className="w-5 h-5 text-rose-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          )}
          <span className="text-xs font-bold tracking-wider uppercase">{toast.message}</span>
        </div>
      )}

      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-black/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-black/5 rounded-full blur-[120px] -z-10 animate-pulse delay-700"></div>

      <div className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-2xl border border-white/50 rounded-[40px] p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>

          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 brand-font">Reset Password</h1>
            <p className="text-text-muted text-sm tracking-wide uppercase">Enter the code sent to your email and your new password</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted tracking-[2px] uppercase px-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={email}
                onChange={onChange}
                className="w-full bg-black/[0.03] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all placeholder:text-text-muted/50"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted tracking-[2px] uppercase px-1">Reset Code</label>
              <input 
                type="text" 
                name="code"
                value={code}
                onChange={onChange}
                placeholder="6-digit code"
                className="w-full bg-black/[0.03] border-none rounded-2xl px-6 py-4 text-sm font-mono tracking-widest focus:ring-2 focus:ring-black/5 outline-none transition-all placeholder:text-text-muted/50"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted tracking-[2px] uppercase px-1">New Password</label>
              <input 
                type="password" 
                name="newPassword"
                value={newPassword}
                onChange={onChange}
                placeholder="••••••••"
                className="w-full bg-black/[0.03] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all placeholder:text-text-muted/50"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted tracking-[2px] uppercase px-1">Confirm Password</label>
              <input 
                type="password" 
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                placeholder="••••••••"
                className="w-full bg-black/[0.03] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all placeholder:text-text-muted/50"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-2xl py-5 text-xs font-bold tracking-[3px] uppercase hover:bg-neutral-800 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-black/10 disabled:opacity-50"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-text-muted">
              Remember your password?{' '}
              <Link 
                to="/login"
                className="font-bold text-black border-b border-black/20 hover:border-black transition-all ml-1 no-underline"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
