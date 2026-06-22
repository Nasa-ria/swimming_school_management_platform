import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { showToast } from '../components/Toast';
import { usePaystackPayment } from 'react-paystack';

export default function Cart() {
  const { cart, loading, updateQty, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [shouldPay, setShouldPay] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phone: '',
    instructions: '',
    paymentMethod: 'card'
  });
  const navigate = useNavigate();

  const initializePayment = usePaystackPayment(paymentConfig || {
    reference: (new Date()).getTime().toString(),
    email: user?.email || 'customer@alraadswim.com',
    amount: Math.round(cart.total * 100), // Convert to smaller currency unit
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_b8e5c66cb1e8f244122d4f26384a56a6838a5b9b',
    metadata: {
      payment_method: formData.paymentMethod,
      customer_name: formData.fullName,
      customer_phone: formData.phone,
    },
  });

  const submitOrderToBackend = async (reference = null) => {
    setIsCheckingOut(true);
    try {
      const shippingInfo = `Name: ${formData.fullName}\nPhone: ${formData.phone}\nAddress: ${formData.address}\nNotes: ${formData.instructions}\nPayment: ${formData.paymentMethod}${reference ? `\nRef: ${reference.reference}` : ''}`;
      
      await api.post('/orders', { 
        shipping_address: shippingInfo,
        payment_method: formData.paymentMethod,
        payment_reference: reference?.reference || null,
      });
      
      showToast('Order placed successfully!', 'success');
      clearCart();
      navigate(`/order-success`);
    } catch (err) {
      showToast(err.response?.data?.error || 'Checkout failed', 'error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!formData.address.trim()) return showToast('Please enter a delivery address', 'error');
    if (!formData.fullName.trim()) return showToast('Please enter your full name', 'error');

    if (formData.paymentMethod === 'card' || formData.paymentMethod === 'momo') {
      setIsCheckingOut(true);
      try {
        const { data } = await api.post('/payments/initiate', { payment_method: formData.paymentMethod });
        setPaymentConfig(data);
        setShouldPay(true);
      } catch (err) {
        setIsCheckingOut(false);
        showToast(err.response?.data?.error || 'Unable to start payment session', 'error');
      }
    } else {
      setIsCheckingOut(true);
      submitOrderToBackend();
    }
  };

  useEffect(() => {
    if (paymentConfig && shouldPay) {
      initializePayment(
        (reference) => submitOrderToBackend(reference),
        () => {
          setIsCheckingOut(false);
          setShouldPay(false);
          showToast('Payment window closed', 'info');
        }
      );
      setShouldPay(false);
    }
  }, [paymentConfig, shouldPay]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading && cart.items.length === 0) return <LoadingSpinner />;

  return (
    <div className="portal-container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
      <header className="page-header" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '2rem', marginBottom: '3rem' }}>
        <h1 className="page-title" style={{ fontSize: '2rem' }}>Shopping Cart</h1>
        <p className="page-subtitle">You have {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your selection.</p>
      </header>

      {cart.items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '8rem 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem', opacity: 0.1 }}>🛒</div>
          <h3 style={{ fontWeight: 800, color: 'var(--navy)', fontSize: '1.75rem', marginBottom: '1rem' }}>Your cart is empty</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Looks like you haven't added any gear to your training kit yet.</p>
          <Link to="/shop" className="btn-saas btn-saas-primary" style={{ padding: '14px 40px' }}>Continue Shopping</Link>
        </div>
      ) : (
        <div className="checkout-grid">
          {/* Cart Items List */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {cart.items.map(item => (
              <div key={item.id || item._id} className="card-saas animate-fade-up" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: '100px', height: '100px', background: '#f8fafc', borderRadius: '16px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border-light)' }}>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', opacity: 0.2 }}>🏊‍♂️</div>
                  )}
                </div>
                
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.02em' }}>{item.category}</div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '1.25rem' }}>{item.name}</h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '12px', padding: '4px' }}>
                      <button 
                        style={{ width: '32px', height: '32px', background: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 800, color: 'var(--navy)', boxShadow: 'var(--shadow-sm)' }}
                        onClick={() => updateQty(item.id || item._id, Math.max(1, item.quantity - 1))}
                      >−</button>
                      <span style={{ padding: '0 12px', fontSize: '0.95rem', fontWeight: 800, color: 'var(--navy)', minWidth: '40px', textAlign: 'center' }}>{item.quantity}</span>
                      <button 
                        style={{ width: '32px', height: '32px', background: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 800, color: 'var(--navy)', boxShadow: 'var(--shadow-sm)' }}
                        onClick={() => updateQty(item.id || item._id, item.quantity + 1)}
                      >+</button>
                    </div>
                    <div style={{ fontWeight: 800, color: 'var(--navy)', fontSize: '1.1rem' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>

                <button 
                  className="btn-saas btn-saas-outline" 
                  style={{ padding: '10px', color: 'var(--danger)', borderColor: 'transparent', background: 'transparent', fontSize: '1.25rem' }}
                  onClick={() => removeItem(item.id || item._id)}
                >✕</button>
              </div>
            ))}
          </section>

          {/* Checkout Form & Summary */}
          <aside>
            <form onSubmit={handleCheckout} className="card-saas" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.5rem' }}>Secure Checkout</h2>
              
              <div>
                <label className="form-label-saas">Full Delivery Name</label>
                <input type="text" name="fullName" className="input-saas" placeholder="John Doe" value={formData.fullName} onChange={handleChange} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label-saas">Phone Number</label>
                  <input type="tel" name="phone" className="input-saas" placeholder="+1 234..." value={formData.phone} onChange={handleChange} required />
                </div>
                <div>
                  <label className="form-label-saas">Payment Method</label>
                  <select name="paymentMethod" className="input-saas" value={formData.paymentMethod} onChange={handleChange}>
                    <option value="card">Credit / Debit Card</option>
                    <option value="momo">Mobile Money</option>
                    
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label-saas">Delivery Address</label>
                <textarea name="address" className="input-saas" style={{ minHeight: '80px' }} placeholder="123 Aquatic Way, Swim City..." value={formData.address} onChange={handleChange} required />
              </div>

              <div>
                <label className="form-label-saas">Special Instructions (Optional)</label>
                <textarea name="instructions" className="input-saas" style={{ minHeight: '60px' }} placeholder="Gate code, floor number, etc." value={formData.instructions} onChange={handleChange} />
              </div>

              <div style={{ padding: '1.5rem', background: 'var(--bg-page)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Subtotal</span>
                  <span style={{ fontWeight: 800, color: 'var(--navy)' }}>${cart.total.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Academy Delivery</span>
                  <span style={{ color: 'var(--success)', fontWeight: 800 }}>FREE</span>
                </div>
                <div style={{ height: '1px', background: 'var(--border-strong)', margin: '1rem 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: 'var(--navy)' }}>Total Amount</span>
                  <span style={{ fontWeight: 900, fontSize: '1.75rem', color: 'var(--primary-dark)' }}>${cart.total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-saas btn-saas-primary"
                style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? 'Processing Payment...' : 'Place Secure Order'}
              </button>
            </form>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <Link to="/shop" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>← Return to Catalog</Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
