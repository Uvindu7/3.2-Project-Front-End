import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useCart } from '../../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';

// Load Stripe once outside component to avoid re-rendering
const STRIPE_PK =
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ||
  'pk_test_51ToFE0RJjCCKec2Xgf3Cu4ps1h253uH9rLaTKB3MCrWzC244vm6cZ7OGLjFGnmy4TkyCVO7Bq8LQPPOBLGsfSCWd00bdfuzIt5';

const stripePromise = loadStripe(STRIPE_PK);

// ─── Stripe Payment Form ─────────────────────────────────────────────────────
const PaymentForm = ({ grandTotal, onSuccess, billing, cartItems }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!billing.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billing.email)) {
      setPaymentError("Please enter a valid email address in the billing details.");
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/order-success',
      },
      redirect: 'if_required',
    });

    if (error) {
      setPaymentError(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Send confirmation email via backend API
      try {
        const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        await fetch(`${API}/api/payment/send-receipt`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: billing.email,
            items: cartItems,
            grandTotal,
            transactionId: paymentIntent.id
          })
        });
      } catch (err) {
        console.error('Failed to send confirmation email', err);
      }
      onSuccess(paymentIntent);
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement
        options={{
          layout: 'tabs',
          wallets: { applePay: 'auto', googlePay: 'auto' },
        }}
      />

      {paymentError && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {paymentError}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm tracking-widest hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-2"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            PROCESSING...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            PAY Rs {grandTotal.toLocaleString()}
          </>
        )}
      </button>

      <p className="text-center text-xs text-zinc-400 flex items-center justify-center gap-1 mt-1">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Secured by Stripe. We never store your card details.
      </p>
    </form>
  );
};

// ─── Order Success Screen ─────────────────────────────────────────────────────
const OrderSuccess = ({ paymentIntent, onContinue }) => (
  <div className="flex flex-col items-center text-center py-12 px-6">
    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
    <h2 className="text-2xl font-extrabold text-zinc-900 mb-2 font-outfit">
      Payment Successful!
    </h2>
    <p className="text-zinc-500 text-sm mb-1">
      Thank you for your order. We'll send you a confirmation email shortly.
    </p>
    {paymentIntent?.id && (
      <p className="text-xs text-zinc-400 mt-2 mb-8">
        Transaction ID: <span className="font-mono text-zinc-600">{paymentIntent.id}</span>
      </p>
    )}
    <Link
      to="/shop"
      onClick={onContinue}
      className="bg-black text-white px-8 py-3.5 rounded-full text-sm font-bold tracking-widest hover:bg-zinc-800 transition-colors no-underline"
    >
      CONTINUE SHOPPING
    </Link>
  </div>
);

// ─── Main Checkout Page ───────────────────────────────────────────────────────
const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState(null);
  const [isLoadingIntent, setIsLoadingIntent] = useState(true);
  const [intentError, setIntentError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState(null);

  // Billing form state
  const [billing, setBilling] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const shipping = cartTotal > 5000 ? 0 : 350;
  const grandTotal = cartTotal + shipping;

  // Redirect to cart if empty
  useEffect(() => {
    if (cartItems.length === 0 && !succeeded) {
      navigate('/cart');
    }
  }, [cartItems, navigate, succeeded]);

  // Create PaymentIntent on mount
  useEffect(() => {
    if (cartItems.length === 0) return;

    const createIntent = async () => {
      setIsLoadingIntent(true);
      setIntentError(null);
      try {
        const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API}/api/payment/create-intent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: grandTotal,
            currency: 'lkr',
            items: cartItems,
          }),
        });
        if (!res.ok) throw new Error('Failed to connect to payment server.');
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setClientSecret(data.clientSecret);
      } catch (err) {
        setIntentError(err.message);
      } finally {
        setIsLoadingIntent(false);
      }
    };

    createIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSuccess = (intent) => {
    setPaymentIntent(intent);
    setSucceeded(true);
    clearCart();
  };

  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#111111',
        colorBackground: '#ffffff',
        colorText: '#1a1a1a',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '10px',
        spacingUnit: '4px',
      },
    },
  };

  if (succeeded) {
    return (
      <div className="pt-32 pb-24 bg-[#fcfcfc] min-h-screen">
        <div className="container mx-auto max-w-lg px-4">
          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
            <OrderSuccess paymentIntent={paymentIntent} onContinue={clearCart} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-[#fcfcfc] min-h-screen">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">

        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-sm text-gray-500 font-medium hover:text-black transition-colors mb-6"
          >
            <span>←</span> Back to Cart
          </button>
          <div className="flex items-end gap-3 border-b border-zinc-200 pb-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 font-outfit">
              Checkout
            </h1>
            {/* Step indicators */}
            <div className="flex items-center gap-2 mb-1 ml-2">
              <span className="flex items-center gap-1 text-xs font-semibold text-zinc-900">
                <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">1</span>
                Details
              </span>
              <span className="text-zinc-300 text-xs">——</span>
              <span className="flex items-center gap-1 text-xs font-semibold text-zinc-900">
                <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">2</span>
                Payment
              </span>
              <span className="text-zinc-300 text-xs">——</span>
              <span className="flex items-center gap-1 text-xs font-semibold text-zinc-400">
                <span className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-500 flex items-center justify-center text-[10px] font-bold">3</span>
                Confirm
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* Left: Billing + Payment */}
          <div className="flex-1 flex flex-col gap-6">

            {/* Billing Details */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6">
              <h2 className="text-base font-extrabold text-zinc-900 tracking-wide mb-5 font-outfit flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">1</span>
                BILLING DETAILS
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'First Name', key: 'firstName', placeholder: 'John', type: 'text', col: 1 },
                  { label: 'Last Name', key: 'lastName', placeholder: 'Doe', type: 'text', col: 1 },
                  { label: 'Email Address', key: 'email', placeholder: 'john@example.com', type: 'email', col: 2 },
                  { label: 'Phone Number', key: 'phone', placeholder: '+94 77 123 4567', type: 'tel', col: 1 },
                  { label: 'Postal Code', key: 'postalCode', placeholder: '10100', type: 'text', col: 1 },
                  { label: 'Street Address', key: 'address', placeholder: '123 Main Street', type: 'text', col: 2 },
                  { label: 'City', key: 'city', placeholder: 'Colombo', type: 'text', col: 2 },
                ].map(({ label, key, placeholder, type, col }) => (
                  <div key={key} className={col === 2 ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                      {label}
                    </label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={billing[key]}
                      onChange={(e) => setBilling((b) => ({ ...b, [key]: e.target.value }))}
                      className={`w-full border rounded-lg px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none transition-colors ${key === 'email' ? 'border-zinc-300 focus:border-black required' : 'border-zinc-200 focus:border-black'}`}
                      required={key === 'email'}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6">
              <h2 className="text-base font-extrabold text-zinc-900 tracking-wide mb-5 font-outfit flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">2</span>
                PAYMENT METHOD
              </h2>

              {/* Accepted Cards */}
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xs text-zinc-400 font-medium">We accept:</span>
                {['VISA', 'MC', 'AMEX'].map((card) => (
                  <span key={card} className="text-[10px] font-bold border border-zinc-200 rounded px-2 py-0.5 text-zinc-500">
                    {card}
                  </span>
                ))}
                <span className="text-[10px] font-bold border border-zinc-200 rounded px-2 py-0.5 text-zinc-500">+ more</span>
              </div>

              {isLoadingIntent ? (
                <div className="flex items-center justify-center py-12 gap-3 text-zinc-400">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  <span className="text-sm font-medium">Connecting to payment gateway...</span>
                </div>
              ) : intentError ? (
                <div className="flex flex-col gap-3 items-center py-8 text-center">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-red-600">Payment gateway error</p>
                    <p className="text-xs text-zinc-500 mt-1">{intentError}</p>
                    <p className="text-xs text-zinc-400 mt-2">Make sure your backend server is running on port 5000.</p>
                  </div>
                </div>
              ) : clientSecret ? (
                <Elements stripe={stripePromise} options={stripeOptions}>
                  <PaymentForm grandTotal={grandTotal} onSuccess={handleSuccess} billing={billing} cartItems={cartItems} />
                </Elements>
              ) : null}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 sticky top-28">
              <h2 className="text-base font-extrabold text-zinc-900 tracking-wide mb-5 font-outfit">
                ORDER SUMMARY
              </h2>

              {/* Items */}
              <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1 mb-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex items-center gap-3"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 bg-zinc-100 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-zinc-400">
                        {item.size} / {item.color}
                      </p>
                    </div>
                    <p className="text-xs font-extrabold text-zinc-900 flex-shrink-0">
                      Rs {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-100 pt-4 flex flex-col gap-2.5 text-sm">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-800">Rs {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-zinc-800'}`}>
                    {shipping === 0 ? 'FREE' : `Rs ${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-900 font-extrabold text-base border-t border-zinc-100 pt-2.5 mt-1">
                  <span>Total</span>
                  <span>Rs {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-5 pt-4 border-t border-zinc-100 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  256-bit SSL Encrypted Payment
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Powered by Stripe
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
