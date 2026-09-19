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

  useEffect(() => {
    if (!loading && !user) {
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
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight brand-font mb-2">My Account</h1>
              <p className="text-text-muted uppercase text-[10px] font-bold tracking-[2px]">Manage your profile details</p>
            </div>
            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          </div>

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
                    placeholder="••••••••"
                    className="w-full bg-black/[0.03] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all"
                  />
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

          {/* Render Orders Here */}
          <CustomerOrders />

        </div>
      </div>
    </div>
  );
};

export default Profile;
