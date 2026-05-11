import React, { useEffect, useState } from "react";
import "./CartModal.css";

const CartModal = ({ isOpen, onClose, cartItems, onRemoveItem }) => {
  const [isCheckoutView, setIsCheckoutView] = useState(false);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setIsCheckoutView(false); // Reset view on close
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cartItems.reduce((sum, item) => {
    const priceStr = String(item.price).replace(/[^0-9.-]+/g, "");
    const price = parseFloat(priceStr) || 0;
    return sum + (price * item.quantity);
  }, 0);

  const tax = subtotal * 0.10; // 10% tax
  const grandTotal = subtotal + tax;

  return (
    <>
      <div className={`cart-backdrop \${isOpen ? "open" : ""}`} onClick={onClose}></div>
      <div className={`cart-modal \${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>{isCheckoutView ? "Checkout" : "Your Cart"}</h2>
          <button className="cart-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <span className="empty-icon">🛒</span>
              <p>Your cart is empty.</p>
              <button className="continue-btn" onClick={onClose}>Continue Shopping</button>
            </div>
          ) : isCheckoutView ? (
            <form className="checkout-form" onSubmit={(e) => { e.preventDefault(); alert('Order Placed Successfully!'); onClose(); }}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" required placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" required placeholder="john@example.com" />
              </div>
              <div className="form-group">
                <label>Shipping Address</label>
                <input type="text" required placeholder="123 Main St, City, Country" />
              </div>
              
              <h3 className="payment-heading">Payment</h3>
              <div className="form-group">
                <label>Card Number</label>
                <input type="text" required placeholder="0000 0000 0000 0000" maxLength="19" />
              </div>
              <div className="form-row">
                <div className="form-group half">
                  <label>Expiry</label>
                  <input type="text" required placeholder="MM/YY" maxLength="5" />
                </div>
                <div className="form-group half">
                  <label>CVC</label>
                  <input type="text" required placeholder="123" maxLength="4" />
                </div>
              </div>
              <button type="button" className="back-to-cart" onClick={() => setIsCheckoutView(false)}>← Back to Cart</button>
            </form>
          ) : (
            <ul className="cart-items-list">
              {cartItems.map((item, index) => (
                <li key={index} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p className="cart-item-price">
                       {String(item.price).startsWith('$') ? item.price : `$${item.price}`} 
                    </p>
                    <div className="cart-item-qty">
                      Qty: <strong>{item.quantity}</strong>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal ({totalItems} items)</span>
                <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="summary-row">
                <span>Taxes (10%)</span>
                <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="summary-row total">
                <span>Grand Total</span>
                <span>${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
            {isCheckoutView ? (
              <button className="checkout-btn" onClick={(e) => {
                 document.querySelector('.checkout-form').requestSubmit();
              }}>Pay Now</button>
            ) : (
              <button className="checkout-btn" onClick={() => setIsCheckoutView(true)}>Proceed to Checkout</button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CartModal;
