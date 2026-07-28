import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProductReviews.css';

// SVG Star Icon Helper
const Star = ({ filled, onClick, onMouseEnter, onMouseLeave, size = 18, className = "" }) => (
  <svg
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={`star-svg ${className}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? '#FFC700' : 'none'}
    stroke={filled ? '#FFC700' : '#CCCCCC'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ProductReviews = ({ productId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/reviews?productId=${productId}`);
        setReviews(res.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Could not load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setSubmitError('Please select a star rating between 1 and 5.');
      return;
    }
    if (!comment.trim()) {
      setSubmitError('Please write a review comment.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await api.post('/reviews', {
        productId,
        rating,
        comment,
      });

      // Add new review to top of the list
      setReviews((prevReviews) => [res.data, ...prevReviews]);
      setSubmitSuccess(true);
      setRating(0);
      setComment('');

      // Auto-clear success message after 4s
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      console.error('Error submitting review:', err);
      const errMsg = err.response?.data?.message || 'Failed to submit review. Try logging in again.';
      setSubmitError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper calculation functions
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  // Count per stars (1 - 5)
  const ratingDistribution = [0, 0, 0, 0, 0]; // index 0 for 1 star, index 4 for 5 stars
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingDistribution[review.rating - 1]++;
    }
  });

  return (
    <div className="product-reviews-section">
      <h3 className="section-title">Customer Reviews</h3>

      <div className="reviews-grid">
        {/* Rating Summary Section */}
        <div className="reviews-summary-card">
          <div className="rating-big-column">
            <span className="rating-big-num">{averageRating}</span>
            <div className="rating-stars-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  filled={star <= Math.round(Number(averageRating))}
                  size={20}
                />
              ))}
            </div>
            <span className="reviews-count-lbl">Based on {totalReviews} reviews</span>
          </div>

          <div className="rating-bars-column">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingDistribution[stars - 1];
              const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={stars} className="rating-bar-row">
                  <span className="bar-label">{stars} Star</span>
                  <div className="bar-bg">
                    <div className="bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="bar-count-val">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Create Review Form Section */}
        <div className="reviews-action-card">
          {user ? (
            <form onSubmit={handleSubmit} className="review-form">
              <h4 className="card-title">Share Your Thoughts</h4>
              <p className="card-subtitle">Tell us what you like or dislike about this product.</p>

              <div className="form-group">
                <label className="form-label">YOUR RATING</label>
                <div className="rating-select-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      filled={star <= (hoverRating || rating)}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      size={28}
                      className="interactive-star"
                    />
                  ))}
                  {rating > 0 && <span className="selected-rating-text">{rating} out of 5 stars</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">YOUR REVIEW</label>
                <textarea
                  className="form-textarea"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What is your review about the quality, size, drape of the apparel?"
                  rows={4}
                  required
                />
              </div>

              {submitError && <div className="review-error-banner">{submitError}</div>}
              {submitSuccess && <div className="review-success-banner">Review submitted successfully! Thank you.</div>}

              <button
                type="submit"
                disabled={submitting}
                className="btn-submit-review"
              >
                {submitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
              </button>
            </form>
          ) : (
            <div className="auth-prompt-container">
              <h4 className="card-title">Write a Review</h4>
              <p className="auth-prompt-text">
                Only registered members of our clothing store can leave reviews. 
                Please sign in to your count or create a new password to share your thoughts.
              </p>
              <button
                className="btn-auth-redirect"
                onClick={() => navigate('/login')}
              >
                SIGN IN TO REVIEW
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review List Section */}
      <div className="reviews-list-container">
        <h4 className="sub-section-title">Reviewed items ({totalReviews})</h4>

        {loading ? (
          <div className="reviews-loader">
            <div className="spinner" />
            <span>Loading reviews...</span>
          </div>
        ) : error ? (
          <div className="reviews-error-banner">{error}</div>
        ) : reviews.length === 0 ? (
          <div className="empty-reviews-state">
            <span className="empty-icon">⭐</span>
            <p className="empty-text">No reviews have been written for this product yet.</p>
            <p className="empty-subtext">Be the first to share your opinion!</p>
          </div>
        ) : (
          <div className="reviews-list">
            {reviews.map((rev) => {
              const initial = rev.user?.username ? rev.user.username.charAt(0).toUpperCase() : '?';
              const dateStr = rev.createdAt 
                ? new Date(rev.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Recent';

              return (
                <div key={rev.id} className="review-item-card">
                  <div className="review-item-header">
                    <div className="reviewer-avatar">{initial}</div>
                    <div className="reviewer-meta">
                      <span className="reviewer-name">{rev.user?.username || 'Anonymous User'}</span>
                      <span className="review-date">{dateStr}</span>
                    </div>
                    <div className="reviewer-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          filled={star <= rev.rating}
                          size={14}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="review-item-body">
                    <p className="review-comment-text">{rev.comment}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
