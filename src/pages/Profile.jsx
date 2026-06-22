import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { showToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    skill_level: 'beginner',
    medical_info: '',
    emergency_contact: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/profile');
      setProfile(data);
      setFormData({
        name: data.name,
        phone: data.phone || '',
        age: data.student_profile?.age || '',
        skill_level: data.student_profile?.skill_level || 'beginner',
        medical_info: data.student_profile?.medical_info || '',
        emergency_contact: data.student_profile?.emergency_contact || ''
      });
    } catch (err) {
      showToast('Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      // Update basic info
      await api.put('/profile', { name: formData.name, phone: formData.phone });
      // Update student profile
      await api.put('/profile/student', {
        age: formData.age,
        skill_level: formData.skill_level,
        medical_info: formData.medical_info,
        emergency_contact: formData.emergency_contact
      });
      showToast('Profile updated successfully', 'success');
      fetchProfile();
    } catch (err) {
      showToast('Update failed', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <header className="page-header" style={{ maxWidth: '900px', margin: '0 auto 2.5rem auto' }}>
        <h1 className="page-title">Account Settings</h1>
        <p className="page-subtitle">Manage your personal information, contact details, and student health record.</p>
      </header>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <form onSubmit={handleUpdate}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2.5rem', alignItems: 'start' }}>
            {/* Basic Info Card */}
            <section className="card-saas animate-fade-up" style={{ padding: '2.5rem' }}>
              <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy)' }}>Personal Information</h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Update your name and primary contact details.</p>
              </div>
              
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label-saas">Full Name</label>
                <input 
                  type="text" 
                  className="input-saas" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label-saas">Email Address</label>
                <input type="text" className="input-saas" style={{ background: '#f8fafc', color: '#64748b', cursor: 'not-allowed' }} value={profile.email} disabled />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>Account email cannot be modified.</p>
              </div>
              <div style={{ marginBottom: '0' }}>
                <label className="form-label-saas">Primary Phone</label>
                <input 
                  type="tel" 
                  className="input-saas" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </section>

            {/* Student Record Card */}
            <section className="card-saas animate-fade-up" style={{ padding: '2.5rem' }}>
              <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy)' }}>Student Profile</h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Medical notes and emergency contact records.</p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="form-label-saas">Age</label>
                  <input 
                    type="number" 
                    className="input-saas" 
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                  />
                </div>
                <div>
                  <label className="form-label-saas">Skill Level</label>
                  <select 
                    className="input-saas" 
                    value={formData.skill_level}
                    onChange={(e) => setFormData({...formData, skill_level: e.target.value})}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label-saas">Emergency Contact</label>
                <input 
                  type="text" 
                  className="input-saas" 
                  placeholder="Name - Relation - Phone"
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})}
                />
              </div>

              <div style={{ marginBottom: '0' }}>
                <label className="form-label-saas">Medical Notes</label>
                <textarea 
                  className="input-saas" 
                  style={{ minHeight: '100px' }}
                  placeholder="List any allergies or medical conditions..."
                  value={formData.medical_info}
                  onChange={(e) => setFormData({...formData, medical_info: e.target.value})}
                />
              </div>
            </section>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
            <button type="button" className="btn-saas btn-saas-outline" onClick={fetchProfile}>Discard Changes</button>
            <button type="submit" className="btn-saas btn-saas-primary" style={{ padding: '12px 40px' }} disabled={updating}>
              {updating ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
