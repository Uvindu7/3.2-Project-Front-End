import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../lib/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const { username, email, password, confirmPassword } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', { username, email, password });
      console.log('Registration Success:', res.data);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error('Registration Error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-black/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-black/5 rounded-full blur-[120px] -z-10 animate-pulse delay-700"></div>

      <div className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-2xl border border-white/50 rounded-[40px] p-10 shadow-2xl relative overflow-hidden group">
          {/* Subtle line at the top */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>

          <div className="mb-10 text-center">
            <button 
              onClick={() => navigate(-1)}
              className="absolute top-8 left-8 text-text-muted hover:text-black transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 brand-font">Join Us</h1>
            <p className="text-text-muted text-sm tracking-wide uppercase">Create your new account</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted tracking-[2px] uppercase px-1">Full Name</label>
              <input 
                type="text" 
                name="username"
                value={username}
                onChange={onChange}
                placeholder="John Doe"
                className="w-full bg-black/[0.03] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all placeholder:text-text-muted/50"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted tracking-[2px] uppercase px-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={email}
                onChange={onChange}
                placeholder="hello@example.com"
                className="w-full bg-black/[0.03] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all placeholder:text-text-muted/50"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted tracking-[2px] uppercase px-1">Password</label>
              <input 
                type="password" 
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Min. 8 characters"
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

            <div className="flex items-start gap-3 px-1 pt-2">
              <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-black/10 accent-black cursor-pointer" required />
              <label htmlFor="terms" className="text-[11px] font-medium text-text-muted leading-snug cursor-pointer">
                I agree to the <a href="#" className="text-black font-bold border-b border-black/20">Terms of Service</a> and <a href="#" className="text-black font-bold border-b border-black/20">Privacy Policy</a>.
              </label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-2xl py-5 text-xs font-bold tracking-[3px] uppercase hover:bg-neutral-800 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-black/10 mt-2 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-text-muted">
              Already have an account?{' '}
              <Link 
                to="/login"
                className="font-bold text-black border-b border-black/20 hover:border-black transition-all ml-1 no-underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

