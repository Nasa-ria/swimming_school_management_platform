import { useState } from 'react';
import './Profile.css';

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-01-15',
    address: '123 Main St, City, State 12345',
    emergencyContact: 'Jane Doe - Mother - +1 (555) 987-6543',
    skillLevel: 'intermediate'
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement save logic here
    console.log('Saving profile:', profile);
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and swimming preferences</p>
      </div>

      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <h2>{profile.name}</h2>
          <p className="profile-email">{profile.email}</p>
          <div className="skill-badge-large">{profile.skillLevel}</div>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Sessions Booked</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Orders</span>
            </div>
          </div>
        </div>

        <div className="profile-main">
          <div className="profile-header">
            <h2>Personal Information</h2>
            {!isEditing && (
              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    disabled={true}
                  />
                  <small>Email cannot be changed</small>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profile.dateOfBirth}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows="3"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Swimming Information</h3>
              <div className="form-group">
                <label>Skill Level</label>
                <select
                  name="skillLevel"
                  value={profile.skillLevel}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option value="beginner">Beginner - Just starting out</option>
                  <option value="intermediate">Intermediate - Comfortable in water</option>
                  <option value="advanced">Advanced - Experienced swimmer</option>
                </select>
              </div>
            </div>

            <div className="form-section">
              <h3>Emergency Contact</h3>
              <div className="form-group">
                <label>Emergency Contact Information</label>
                <textarea
                  name="emergencyContact"
                  value={profile.emergencyContact}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows="3"
                  placeholder="Name, relationship, and phone number"
                />
              </div>
            </div>

            {isEditing && (
              <div className="form-actions">
                <button type="submit" className="btn-save">Save Changes</button>
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;

