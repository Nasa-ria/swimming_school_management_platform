import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { showToast } from '../components/Toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [cart, setCart]       = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) { setCart({ items: [], total: 0 }); return; }
    try {
      setLoading(true);
      const { data } = await api.get('/cart');
      setCart(data);
    } catch {
      // silently fail — cart will remain empty
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // Reload cart whenever login state changes
  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = useCallback(async (item, quantity = 1) => {
    if (!isLoggedIn) {
      showToast('Please login to add items to your cart', 'info');
      return;
    }
    try {
      // Sessions have 'title', Products have 'name'
      const isSession = !!(item.title);
      const payload = isSession
        ? { session_id: item._id || item.id, quantity: 1 } 
        : { product_id: item._id || item.id, quantity };
        
      await api.post('/cart', payload);
      await fetchCart();
      showToast('Successfully added to your cart!', 'success');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to add item';
      showToast(msg, 'error');
    }
  }, [isLoggedIn, fetchCart]);

  const updateQty = useCallback(async (cartItemId, quantity) => {
    await api.put(`/cart/${cartItemId}`, { quantity });
    await fetchCart();
  }, [fetchCart]);

  const removeItem = useCallback(async (cartItemId) => {
    await api.delete(`/cart/${cartItemId}`);
    await fetchCart();
  }, [fetchCart]);

  const clearCart = useCallback(async () => {
    await api.delete('/cart');
    setCart({ items: [], total: 0 });
  }, []);

  const itemCount = cart.items.reduce((n, i) => n + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, loading, itemCount, fetchCart, addToCart, updateQty, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
