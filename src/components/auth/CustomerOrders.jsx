import React, { useState, useEffect } from 'react';
import api from '../../lib/api';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/payment/my-orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      await api.put(`/payment/my-orders/${orderId}/cancel`);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'Cancelled' } : order
      ));
    } catch (err) {
      console.error('Failed to cancel order', err);
      alert(err.response?.data?.error || "Failed to cancel order");
    }
  };

  if (loading) return <div className="py-12 text-center text-zinc-500 animate-pulse font-outfit">Loading your orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="py-12 text-center border-t border-black/5 mt-12">
        <h3 className="text-xl font-bold font-outfit mb-2">No Orders Yet</h3>
        <p className="text-zinc-500 text-sm">When you place an order, it will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map(order => (
          <div key={order.id} className="bg-white border border-zinc-100 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 pb-6 border-b border-zinc-50">
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Order Placed</p>
                <p className="font-medium text-sm">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total</p>
                <p className="font-medium text-sm">Rs {order.grandTotal.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Status</p>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full inline-block ${
                  order.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                  order.status === 'Processing' ? 'bg-blue-50 text-blue-700' :
                  order.status === 'Shipped' ? 'bg-purple-50 text-purple-700' :
                  order.status === 'Delivered' ? 'bg-green-50 text-green-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="text-right flex flex-col justify-between h-full">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Transaction ID</p>
                  <p className="font-mono text-xs text-zinc-500">{order.transactionId}</p>
                </div>
                {order.status === 'Pending' && (
                  <button 
                    onClick={() => handleCancelOrder(order.id)}
                    className="mt-3 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors self-end"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-zinc-50/50 p-4 rounded-2xl">
                  <div>
                    <p className="font-bold text-sm">{item.name}</p>
                    <p className="text-xs text-zinc-500 mt-1">Qty: {item.quantity} {item.size && `• Size: ${item.size}`}</p>
                  </div>
                  <div className="font-bold text-sm">
                    Rs {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default CustomerOrders;
