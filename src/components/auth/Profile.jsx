import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CustomerOrders from './CustomerOrders';

const Profile = () => {
  const { user, updateProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('account');

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login');
    }
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username,
        email: user.email
      }));
    }
  }, [user, loading, navigate]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (formData.password && formData.password !== formData.confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords do not match' });
    }

    setUpdating(true);
    try {
      const updateData = {
        username: formData.username,
        email: formData.email
      };
      if (formData.password) {
        updateData.password = formData.password;
      }

      await updateProfile(updateData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex justify-center bg-[#fafafa]">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-black/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight brand-font mb-2">My Account</h1>
              <p className="text-text-muted uppercase text-[10px] font-bold tracking-[2px]">
                {activeTab === 'account' ? 'Manage your profile details' : 'View your order history'}
              </p>
            </div>
            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-black/10 mb-8 pb-1">
            <button 
              onClick={() => setActiveTab('account')}
              className={`text-xs font-bold tracking-widest uppercase pb-2 border-b-2 transition-all ${activeTab === 'account' ? 'border-black text-black' : 'border-transparent text-text-muted hover:text-black'}`}
            >
              Account Details
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`text-xs font-bold tracking-widest uppercase pb-2 border-b-2 transition-all ${activeTab === 'orders' ? 'border-black text-black' : 'border-transparent text-text-muted hover:text-black'}`}
            >
              My Orders
            </button>
          </div>

          {activeTab === 'account' && (
            <form onSubmit={handleSubmit} className="space-y-8">
              {message.text && (
                <div className={`p-4 rounded-2xl text-xs font-bold uppercase tracking-wider ${message.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                  {message.text}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted tracking-[2px] uppercase px-1">Username</label>
                  <input 
                    type="text" 
                    name="username"
                    value={formData.username}
                    onChange={onChange}
                    className="w-full bg-black/[0.03] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all"
                    pattern="[a-zA-Z\s]*[a-zA-Z][a-zA-Z\s]*"
                    title="Full Name must contain at least one letter and can only include letters and spaces."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted tracking-[2px] uppercase px-1">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    className="w-full bg-black/[0.03] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-black/5">
                <h3 className="text-[12px] font-extrabold tracking-wider uppercase mb-6">Change Password (leave blank to keep current)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted tracking-[2px] uppercase px-1">New Password</label>
                    <input 
                      type="password" 
                      name="password"
                      value={formData.password}
                      onChange={onChange}
                      placeholder="Min. 8 chars, 1 Uppercase, 1 Number, 1 Special"
                      minLength="8"
                      pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}"
                      title="Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
                      className="w-full bg-black/[0.03] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all"
                    />
                    {formData.password && (
                      <div className="px-2 pt-1 text-[10px] text-text-muted flex flex-col gap-1">
                        <div className="font-bold tracking-wider uppercase mb-1">Password must contain:</div>
                        <div className={`flex items-center gap-1.5 ${formData.password.length >= 8 ? 'text-emerald-500' : ''}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${formData.password.length >= 8 ? 'bg-emerald-500' : 'bg-black/20'}`}></div>
                          At least 8 characters
                        </div>
                        <div className={`flex items-center gap-1.5 ${/[A-Z]/.test(formData.password) ? 'text-emerald-500' : ''}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-emerald-500' : 'bg-black/20'}`}></div>
                          One uppercase letter (A-Z)
                        </div>
                        <div className={`flex items-center gap-1.5 ${/[a-z]/.test(formData.password) ? 'text-emerald-500' : ''}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(formData.password) ? 'bg-emerald-500' : 'bg-black/20'}`}></div>
                          One lowercase letter (a-z)
                        </div>
                        <div className={`flex items-center gap-1.5 ${/\d/.test(formData.password) ? 'text-emerald-500' : ''}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${/\d/.test(formData.password) ? 'bg-emerald-500' : 'bg-black/20'}`}></div>
                          One number (0-9)
                        </div>
                        <div className={`flex items-center gap-1.5 ${/[\W_]/.test(formData.password) ? 'text-emerald-500' : ''}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${/[\W_]/.test(formData.password) ? 'bg-emerald-500' : 'bg-black/20'}`}></div>
                          One special character (@, !, #, etc.)
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted tracking-[2px] uppercase px-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={onChange}
                      placeholder="••••••••"
                      className="w-full bg-black/[0.03] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  disabled={updating}
                  className="w-full bg-black text-white rounded-2xl py-5 text-xs font-bold tracking-[3px] uppercase hover:bg-neutral-800 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-black/10 disabled:opacity-50"
                >
                  {updating ? 'Saving Changes...' : 'Update Profile'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'orders' && (
            <div className="mt-4">
              <CustomerOrders />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
