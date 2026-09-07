import React, { useState, useEffect } from 'react';
import api from '../../lib/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error('Failed to delete user', err);
      alert('Failed to delete user. See console for details.');
    }
  };

  if (loading) return <div className="animate-pulse">Loading users...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Joined Date</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                      {u.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="font-semibold text-gray-800">{u.username || 'N/A'}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-600">{u.email}</td>
                <td className="p-4 text-gray-600">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="p-4">
                  {u.isAdmin ? (
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-xs font-bold tracking-wide">ADMIN</span>
                  ) : (
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-bold tracking-wide">USER</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  {!u.isAdmin && (
                    <button 
                      onClick={() => handleDelete(u.id)}
                      className="text-rose-500 hover:text-rose-700 font-medium px-3 py-1 rounded hover:bg-rose-50 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
