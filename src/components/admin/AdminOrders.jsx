import React, { useState, useEffect } from 'react';
import api from '../../lib/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders', err);
      setError('Failed to load orders');
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error('Error updating order status', err);
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading orders...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 font-outfit">Orders</h1>
          <p className="text-zinc-500 mt-1">Manage and track customer incoming orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-zinc-400">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Transaction ID</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Total</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                  <th className="px-6 py-4 font-semibold">Items</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-zinc-100 px-2 py-1 rounded text-zinc-600">
                        {order.transactionId?.substring(0, 16)}...
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900">
                        {order.firstName} {order.lastName}
                      </div>
                      <div className="text-xs text-zinc-500">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-zinc-900">
                      Rs {order.grandTotal?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer ${
                          order.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          order.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          order.status === 'Shipped' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap text-xs text-zinc-600">
                        {order.items?.length} item(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-xs font-bold text-black border border-zinc-200 px-3 py-1.5 rounded-full hover:bg-zinc-50 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-zinc-100 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold font-outfit">Order Details</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">Customer Info</h3>
                  <p className="font-medium">{selectedOrder.firstName} {selectedOrder.lastName}</p>
                  <p className="text-sm text-zinc-500">{selectedOrder.email}</p>
                  <p className="text-sm text-zinc-500">{selectedOrder.phone || 'No phone provided'}</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">Shipping Address</h3>
                  <p className="text-sm text-zinc-600">
                    {selectedOrder.address ? (
                      <>
                        {selectedOrder.address}<br />
                        {selectedOrder.city}, {selectedOrder.postalCode}
                      </>
                    ) : 'No address provided'}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-4">Order Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-zinc-500">Qty: {item.quantity} {item.size && `• Size: ${item.size}`}</p>
                      </div>
                      <div className="font-bold">
                        Rs {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-zinc-100">
                <span className="font-medium text-zinc-500">Transaction ID</span>
                <span className="font-mono text-sm">{selectedOrder.transactionId}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-lg">Grand Total</span>
                <span className="font-bold text-xl">Rs {selectedOrder.grandTotal?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
