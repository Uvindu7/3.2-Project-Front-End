import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useModal } from '../../context/ModalContext';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showConfirm, showAlert } = useModal();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/admin/reviews');
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (reviewId) => {
    showConfirm('Delete Review', 'Are you sure you want to delete this review? This action cannot be undone.', async () => {
      try {
        await api.delete(`/admin/reviews/${reviewId}`);
        fetchReviews();
        showAlert('Success', 'Review deleted successfully', 'success');
      } catch (err) {
        console.error('Failed to delete review', err);
        showAlert('Error', 'Failed to delete review', 'error');
      }
    }, 'Delete Review');
  };

  if (loading) return <div className="animate-pulse">Loading reviews...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {reviews.length === 0 && (
        <div className="col-span-full p-10 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
          No reviews available yet.
        </div>
      )}
      {reviews.map((r) => (
        <div key={r.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
                {r.user?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{r.user?.username || 'Anonymous'}</h4>
                <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex gap-1 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl flex-1 text-sm text-gray-700 italic border border-gray-100">
            "{r.comment}"
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Product ID: {r.productId}
            </span>
            <button 
              onClick={() => confirmDelete(r.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
            >
              Delete Review
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminReviews;
