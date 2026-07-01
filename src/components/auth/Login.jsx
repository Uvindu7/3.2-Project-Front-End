import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const { login } = useAuth();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      alert('Login successful!');
      navigate('/');
    } catch (err) {
      console.error('Login Error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-black/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-black/5 rounded-full blur-[120px] -z-10 animate-pulse delay-700"></div>

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
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 brand-font">Welcome Back</h1>
            <p className="text-text-muted text-sm tracking-wide uppercase">Login to your account</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
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
              <div className="flex justify-between px-1">
                <label className="text-[10px] font-bold text-text-muted tracking-[2px] uppercase">Password</label>
                <a href="#" className="text-[10px] font-bold text-black tracking-[2px] uppercase opacity-70 hover:opacity-100 transition-opacity">Forgot?</a>
              </div>
              <input 
                type="password" 
                name="password"
                value={password}
                onChange={onChange}
                placeholder="••••••••"
                className="w-full bg-black/[0.03] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all placeholder:text-text-muted/50"
                required
              />
            </div>

            <div className="flex items-center gap-3 px-1 pt-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-black/10 accent-black cursor-pointer" />
              <label htmlFor="remember" className="text-[11px] font-medium text-text-muted cursor-pointer">Remember me for 30 days</label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-2xl py-5 text-xs font-bold tracking-[3px] uppercase hover:bg-neutral-800 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-black/10 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-text-muted">
              Don't have an account?{' '}
              <Link 
                to="/register"
                className="font-bold text-black border-b border-black/20 hover:border-black transition-all ml-1 no-underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

