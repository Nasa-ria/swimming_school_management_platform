import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { showToast } from '../../components/Toast';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (err) {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/admin/create-users', formData);
      showToast('User added successfully', 'success');
      setShowAddModal(false);
      setFormData({ name: '', email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to add user';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      showToast('User role updated', 'success');
      fetchUsers();
    } catch (err) {
      showToast('Failed to update role', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      showToast('User deleted', 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.error || 'Delete failed', 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title">User Registry</h1>
          <p className="page-subtitle">Manage account permissions and administrative roles for Alraad Swim.</p>
        </div>
        <button className="btn-saas btn-saas-primary" onClick={() => setShowAddModal(true)}>
          <span>+</span> Add Member
        </button>
      </header>

      <section className="table-wrapper-saas">
        <table className="table-saas">
          <thead>
            <tr>
              <th>Member Name</th>
              <th>Email Address</th>
              <th>System Role</th>
              <th>Registration Date</th>
              <th style={{ textAlign: 'right' }}>Management</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id || u.id}>
                <td style={{ fontWeight: 700, color: 'var(--navy)' }}>{u.name}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                <td>
                  <select
                    className="input-saas"
                    style={{ 
                      width: '130px', 
                      padding: '4px 8px', 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      backgroundColor: u.role === 'admin' ? 'var(--warning-soft)' : (u.role === 'instructor' ? 'var(--info-soft)' : '#f8fafc'),
                      borderColor: 'transparent'
                    }}
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id || u.id, e.target.value)}
                  >
                    <option value="user">Member</option>
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                  {new Date(u.createdAt || u.created_at).toLocaleDateString()}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    className="btn-saas btn-saas-outline"
                    style={{ padding: '4px 10px', fontSize: '0.7rem', color: 'var(--danger)', borderColor: 'var(--danger-soft)' }}
                    onClick={() => handleDelete(u._id || u.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* SaaS Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1.5rem' }}>
          <div className="card-saas animate-fade-up" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', border: 'none', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)' }}>Onboard Member</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Invite a new user to the Alraad platform.</p>
            </div>

            <form onSubmit={handleAddUser}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label-saas">Full Name</label>
                <input type="text" className="input-saas" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Smith" required />
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label-saas">Email Address</label>
                <input type="email" className="input-saas" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="jsmith@example.com" required />
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label-saas">Initial Password</label>
                <input type="password" className="input-saas" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Set a secure password" required />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label className="form-label-saas">Permission Role</label>
                <select className="input-saas" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="user">Member (Guest)</option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-saas btn-saas-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-saas btn-saas-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Onboarding...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
