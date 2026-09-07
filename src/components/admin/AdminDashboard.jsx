import React, { useState, useEffect } from 'react';
import api from '../../lib/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, reviews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, reviewsRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/reviews')
        ]);
        setStats({
          users: usersRes.data.length,
          reviews: reviewsRes.data.length
        });
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-20 animate-pulse">Loading dashboard...</div>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="w-14 h-14 bg-black text-white rounded-xl flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Users</p>
            <h3 className="text-3xl font-bold">{stats.users}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="w-14 h-14 bg-black text-white rounded-xl flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Reviews</p>
            <h3 className="text-3xl font-bold">{stats.reviews}</h3>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-4">Welcome to Liyara Admin</h3>
        <p className="text-gray-600">
          Use the sidebar to manage users and review customer feedback. This dashboard provides a central hub to monitor platform activity.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
