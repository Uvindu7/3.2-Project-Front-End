import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "../cart/CartItem";
import { useCart } from "../../context/CartContext";
import api from "../../lib/api";

const CartPage = () => {
  const { cartItems, increaseQty, decreaseQty, removeItem, clearCart, cartTotal, updateCartStocks } =
    useCart();
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const syncStock = async () => {
      try {
        if (cartItems.length === 0) {
          setIsSyncing(false);
          return;
        }
        
        const uniqueIds = [...new Set(cartItems.map(item => item.id))];
        const responses = await Promise.all(
          uniqueIds.map(id => api.get(`/products/${id}`).catch(() => null))
        );
        
        const products = responses.filter(Boolean).map(res => res.data);
        
        const updates = cartItems.map(item => {
          const product = products.find(p => p.id === item.id);
          if (product) {
            let maxStock = 0;
            if (item.size === 'S') maxStock = product.stockS;
            else if (item.size === 'M') maxStock = product.stockM;
            else if (item.size === 'L') maxStock = product.stockL;
            return { id: item.id, size: item.size, maxStock };
          }
          return { id: item.id, size: item.size, maxStock: 0 }; // if product deleted
        });
        
        updateCartStocks(updates);
      } catch (err) {
        console.error("Failed to sync cart stock", err);
      } finally {
        setIsSyncing(false);
      }
    };
    syncStock();
  }, []); // Only run on mount to update stock before checkout

  const shipping = cartTotal > 5000 ? 0 : 350;
  const grandTotal = cartTotal + shipping;
  const hasOutOfStockItems = cartItems.some(item => item.maxStock === 0);

  return (
    <div className="pt-32 pb-24 bg-[#fcfcfc] min-h-screen">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">

        {/* Page Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 font-medium hover:text-black transition-colors mb-6"
          >
            <span>←</span> Continue Shopping
          </button>
          <div className="flex items-end justify-between border-b border-zinc-200 pb-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 font-outfit">
                Your Cart
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                {cartItems.length === 0
                  ? "Your cart is empty"
                  : `${cartItems.reduce((s, i) => s + i.quantity, 0)} item${
                      cartItems.reduce((s, i) => s + i.quantity, 0) !== 1
                        ? "s"
                        : ""
                    } in your cart`}
              </p>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors underline underline-offset-2"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#aaa"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-800 mb-2">
              Your cart is empty
            </h2>
            <p className="text-zinc-500 text-sm mb-8 max-w-xs">
              Looks like you haven't added anything yet. Explore our latest
              collection!
            </p>
            <Link
              to="/shop"
              className="bg-black text-white px-8 py-3.5 rounded-full text-sm font-bold tracking-widest hover:bg-zinc-800 transition-colors no-underline"
            >
              SHOP NOW
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Cart Items */}
            <div className="flex-1 flex flex-col gap-4">
              {cartItems.map((item) => (
                <CartItem
                  key={`${item.id}-${item.size}-${item.color}`}
                  item={item}
                  increaseQty={increaseQty}
                  decreaseQty={decreaseQty}
                  removeItem={removeItem}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 sticky top-28">
                <h2 className="text-lg font-extrabold text-zinc-900 tracking-wide mb-6 font-outfit">
                  ORDER SUMMARY
                </h2>

                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-zinc-900">
                      Rs {cartTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Shipping</span>
                    <span
                      className={`font-semibold ${
                        shipping === 0 ? "text-green-600" : "text-zinc-900"
                      }`}
                    >
                      {shipping === 0 ? "FREE" : `Rs ${shipping}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-zinc-400">
                      Free shipping on orders over Rs 5,000
                    </p>
                  )}
                  <div className="border-t border-zinc-100 pt-3 mt-1 flex justify-between font-bold text-zinc-900 text-base">
                    <span>Total</span>
                    <span>Rs {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  disabled={hasOutOfStockItems || isSyncing}
                  onClick={() => navigate('/checkout')}
                  className={`mt-6 w-full py-4 rounded-xl font-bold text-sm tracking-widest transition-colors flex items-center justify-center gap-2 ${(hasOutOfStockItems || isSyncing) ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed' : 'bg-black text-white hover:bg-zinc-800'}`}
                >
                  {isSyncing ? 'VERIFYING STOCK...' : hasOutOfStockItems ? 'REMOVE OUT OF STOCK ITEMS' : 'CHECKOUT'}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>

                <button
                  onClick={() => navigate("/shop")}
                  className="mt-3 w-full border border-zinc-200 text-zinc-700 py-3.5 rounded-xl font-semibold text-sm tracking-wide hover:border-zinc-400 transition-colors"
                >
                  Continue Shopping
                </button>

                {/* Trust Badges */}
                <div className="mt-6 pt-5 border-t border-zinc-100 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span>🔒</span>
                    <span>Secure & Encrypted Checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span>🚚</span>
                    <span>Complimentary Express Shipping</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span>↩️</span>
                    <span>Easy 30-Day Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
