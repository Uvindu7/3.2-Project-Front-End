import React, { useState, useEffect } from 'react';
import api from '../../lib/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ 
    users: 0, 
    reviews: 0,
    products: 0,
    outOfStock: 0,
    orders: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard-stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-20 animate-pulse font-outfit text-zinc-500">Loading dashboard...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-outfit">
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-900">Dashboard</h1>
        <p className="text-zinc-500 mt-1">Overview of sales and inventory.</p>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Revenue */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <p className="text-zinc-500 text-sm font-bold tracking-widest uppercase">Total Revenue</p>
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
          <h3 className="text-4xl font-extrabold">Rs {stats.totalRevenue?.toLocaleString()}</h3>
        </div>

        {/* Orders */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <p className="text-zinc-500 text-sm font-bold tracking-widest uppercase">Total Orders</p>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </div>
          </div>
          <h3 className="text-4xl font-extrabold">{stats.orders}</h3>
        </div>

        {/* Inventory */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <p className="text-zinc-500 text-sm font-bold tracking-widest uppercase">Total Products</p>
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
          </div>
          <h3 className="text-4xl font-extrabold">{stats.products}</h3>
        </div>

        {/* Out of Stock Alert */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <p className="text-zinc-500 text-sm font-bold tracking-widest uppercase">Out of Stock</p>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stats.outOfStock > 0 ? 'bg-red-50 text-red-600' : 'bg-zinc-50 text-zinc-400'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
          </div>
          <h3 className="text-4xl font-extrabold">{stats.outOfStock}</h3>
          {stats.outOfStock > 0 && <p className="text-red-500 text-xs font-bold">Action required!</p>}
        </div>

        {/* Users */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <p className="text-zinc-500 text-sm font-bold tracking-widest uppercase">Total Users</p>
            <div className="w-10 h-10 bg-zinc-100 text-zinc-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
          </div>
          <h3 className="text-4xl font-extrabold">{stats.users}</h3>
        </div>

        {/* Reviews */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <p className="text-zinc-500 text-sm font-bold tracking-widest uppercase">Total Reviews</p>
            <div className="w-10 h-10 bg-zinc-100 text-zinc-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            </div>
          </div>
          <h3 className="text-4xl font-extrabold">{stats.reviews}</h3>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="px-8 py-6 border-b border-zinc-100">
          <h2 className="text-xl font-bold">Recent Sales</h2>
        </div>
        {stats.recentOrders?.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">No recent orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50/50 text-zinc-500">
                <tr>
                  <th className="px-8 py-4 font-semibold">Transaction ID</th>
                  <th className="px-8 py-4 font-semibold">Customer</th>
                  <th className="px-8 py-4 font-semibold">Date</th>
                  <th className="px-8 py-4 font-semibold">Status</th>
                  <th className="px-8 py-4 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {stats.recentOrders?.map(order => (
                  <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-8 py-4 font-mono text-xs text-zinc-600">{order.transactionId?.substring(0,16)}...</td>
                    <td className="px-8 py-4 font-medium text-zinc-900">{order.firstName} {order.lastName}</td>
                    <td className="px-8 py-4 text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-8 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          order.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                          order.status === 'Processing' ? 'bg-blue-50 text-blue-700' :
                          order.status === 'Shipped' ? 'bg-purple-50 text-purple-700' :
                          order.status === 'Delivered' ? 'bg-green-50 text-green-700' :
                          'bg-red-50 text-red-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right font-bold">Rs {order.grandTotal?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;
