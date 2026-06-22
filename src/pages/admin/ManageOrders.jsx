import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { showToast } from '../../components/Toast';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/admin/all');
      setOrders(data);
    } catch (err) {
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      showToast(`Order marked as ${newStatus}`, 'success');
      fetchOrders();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const s = status.toLowerCase();
    if (s === 'delivered') return 'success';
    if (s === 'shipped') return 'info';
    if (s === 'processing') return 'warning';
    return 'danger';
  };

  return (
    <div className="portal-container" style={{ paddingBottom: '5rem' }}>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title">Shop Inventory & Orders</h1>
          <p className="page-subtitle">Manage customer equipment purchases and track fulfillment status.</p>
        </div>
      </header>

      {loading ? (
        <LoadingSpinner />
      ) : orders.length === 0 ? (
        <div className="card-saas" style={{ textAlign: 'center', padding: '6rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.2 }}>📦</div>
          <h3 style={{ fontWeight: 800, color: 'var(--navy)' }}>No orders yet</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Customer purchases will appear here once the shop is active.</p>
        </div>
      ) : (
        <div className="table-wrapper-saas card-saas">
          <table className="table-saas">
            <thead>
              <tr>
                <th>Order ID & Customer</th>
                <th>Purchased Items</th>
                <th>Total</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Management</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--navy)' }}>#{order._id.slice(-6).toUpperCase()}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{order.user?.name || 'Guest User'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.user?.email}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {order.items?.map((item, idx) => (
                        <div key={idx} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          {item.quantity}x {item.product?.name || 'Deleted Product'}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--navy)' }}>${order.total_amount?.toFixed(2)}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td>
                    <span className={`badge-saas ${getStatusBadge(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <select 
                      className="input-saas" 
                      style={{ padding: '6px 12px', width: '140px', fontSize: '0.8125rem', fontWeight: 700 }}
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
