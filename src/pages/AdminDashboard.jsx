import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, BookOpen, Calendar, TrendingUp, UserCheck, Activity, ArrowUp, ArrowDown } from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  
  .dashboard-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    animation: gradientShift 15s ease infinite;
  }
  
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  .dashboard-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .dashboard-header {
    margin-bottom: 2rem;
    animation: fadeInDown 0.6s ease-out;
  }
  
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .header-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .header-subtitle {
    color: #64748b;
    font-size: 1rem;
  }
  
  .header-time {
    text-align: right;
  }
  
  .time-label {
    font-size: 0.875rem;
    color: #94a3b8;
    margin-bottom: 0.25rem;
  }
  
  .time-value {
    color: #1e293b;
    font-weight: 600;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .stat-card {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fadeInUp 0.6s ease-out backwards;
    position: relative;
    overflow: hidden;
  }
  
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--card-color), var(--card-color-light));
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  .stat-card:hover::before {
    transform: scaleX(1);
  }
  
  .stat-card:nth-child(1) {
    animation-delay: 0.1s;
    --card-color: #3b82f6;
    --card-color-light: #60a5fa;
  }
  
  .stat-card:nth-child(2) {
    animation-delay: 0.2s;
    --card-color: #8b5cf6;
    --card-color-light: #a78bfa;
  }
  
  .stat-card:nth-child(3) {
    animation-delay: 0.3s;
    --card-color: #ec4899;
    --card-color-light: #f472b6;
  }
  
  .stat-card:nth-child(4) {
    animation-delay: 0.4s;
    --card-color: #14b8a6;
    --card-color-light: #2dd4bf;
  }
  
  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .stat-content {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  
  .stat-info {
    flex: 1;
  }
  
  .stat-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .stat-value {
    font-size: 2.25rem;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 0.75rem;
    line-height: 1;
  }
  
  .stat-trend {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .trend-up {
    color: #10b981;
  }
  
  .trend-down {
    color: #ef4444;
  }
  
  .trend-text {
    font-size: 0.875rem;
    font-weight: 600;
  }
  
  .trend-subtext {
    font-size: 0.875rem;
    color: #94a3b8;
    margin-left: 0.25rem;
  }
  
  .stat-icon {
    padding: 0.75rem;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
  }
  
  .stat-card:hover .stat-icon {
    transform: scale(1.1) rotate(5deg);
  }
  
  .icon-blue { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
  .icon-purple { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); }
  .icon-pink { background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); }
  .icon-teal { background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); }
  
  .charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .chart-card {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    animation: fadeInUp 0.6s ease-out 0.5s backwards;
    transition: box-shadow 0.3s ease;
  }
  
  .chart-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  .chart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }
  
  .chart-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #0f172a;
  }
  
  .bottom-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .section-card {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    animation: fadeInUp 0.6s ease-out 0.7s backwards;
  }
  
  .section-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 1rem;
  }
  
  .action-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .action-btn {
    display: block;
    width: 100%;
    padding: 0.875rem 1rem;
    border-radius: 0.5rem;
    font-weight: 600;
    text-align: center;
    text-decoration: none;
    transition: all 0.2s ease;
    border: 2px solid transparent;
  }
  
  .action-btn:hover {
    transform: translateX(4px);
  }
  
  .btn-blue {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #1e40af;
  }
  
  .btn-blue:hover {
    background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%);
    border-color: #3b82f6;
  }
  
  .btn-purple {
    background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
    color: #6d28d9;
  }
  
  .btn-purple:hover {
    background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%);
    border-color: #8b5cf6;
  }
  
  .btn-pink {
    background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
    color: #be185d;
  }
  
  .btn-pink:hover {
    background: linear-gradient(135deg, #fbcfe8 0%, #f9a8d4 100%);
    border-color: #ec4899;
  }
  
  .btn-teal {
    background: linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%);
    color: #115e59;
  }
  
  .btn-teal:hover {
    background: linear-gradient(135deg, #99f6e4 0%, #5eead4 100%);
    border-color: #14b8a6;
  }
  
  .btn-indigo {
    background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
    color: #4338ca;
  }
  
  .btn-indigo:hover {
    background: linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%);
    border-color: #6366f1;
  }
  
  .legend-list {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .legend-color {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .legend-dot {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
  }
  
  .legend-name {
    font-size: 0.875rem;
    color: #64748b;
  }
  
  .legend-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: #0f172a;
  }
  
  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .activity-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .activity-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  .activity-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    margin-top: 0.5rem;
    flex-shrink: 0;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  .dot-green { background: #10b981; }
  .dot-blue { background: #3b82f6; }
  .dot-purple { background: #8b5cf6; }
  
  .activity-content {
    flex: 1;
  }
  
  .activity-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 0.25rem;
  }
  
  .activity-time {
    font-size: 0.75rem;
    color: #94a3b8;
  }
  
  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  }
  
  .loading-content {
    text-align: center;
  }
  
  .spinner {
    width: 4rem;
    height: 4rem;
    border: 4px solid #e2e8f0;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .loading-text {
    color: #64748b;
    font-size: 1.125rem;
    font-weight: 500;
  }
  
  @media (max-width: 768px) {
    .dashboard-wrapper {
      padding: 1rem;
    }
    
    .header-title {
      font-size: 2rem;
    }
    
    .stats-grid,
    .charts-grid,
    .bottom-grid {
      grid-template-columns: 1fr;
    }
    
    .stat-value {
      font-size: 1.875rem;
    }
  }
`;

function AdminDashboard() {
  const [stats, setStats] = useState({
    members: 0,
    instructors: 0,
    sessions: 0,
    activeBookings: 0,
    revenue: 0,
    growth: 0
  });
  const [loading, setLoading] = useState(true);

  // Mock data for charts
  const monthlyData = [
    { month: 'Jan', bookings: 45, revenue: 4500 },
    { month: 'Feb', bookings: 52, revenue: 5200 },
    { month: 'Mar', bookings: 48, revenue: 4800 },
    { month: 'Apr', bookings: 61, revenue: 6100 },
    { month: 'May', bookings: 70, revenue: 7000 },
    { month: 'Jun', bookings: 65, revenue: 6500 }
  ];

  const sessionDistribution = [
    { name: 'Swimming', value: 120 },
    { name: 'Diving', value: 80 },
    { name: 'Water Polo', value: 60 },
    { name: 'Aqua Fitness', value: 60 }
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

  useEffect(() => {
    setTimeout(() => {
      setStats({
        members: 150,
        instructors: 12,
        sessions: 45,
        activeBookings: 320,
        revenue: 32500,
        growth: 12.5
      });
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="loading-container">
          <div className="loading-content">
            <div className="spinner"></div>
            <p className="loading-text">Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, colorClass }) => (
    <div className="stat-card">
      <div className="stat-content">
        <div className="stat-info">
          <p className="stat-label">{title}</p>
          <h3 className="stat-value">{value}</h3>
          {trend && (
            <div className="stat-trend">
              {trend === 'up' ? (
                <ArrowUp size={16} className="trend-up" />
              ) : (
                <ArrowDown size={16} className="trend-down" />
              )}
              <span className={`trend-text ${trend === 'up' ? 'trend-up' : 'trend-down'}`}>
                {trendValue}%
              </span>
              <span className="trend-subtext">vs last month</span>
            </div>
          )}
        </div>
        <div className={`stat-icon ${colorClass}`}>
          <Icon size={24} color="white" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-container">
        <div className="dashboard-wrapper">
          {/* Header */}
          <header className="dashboard-header">
            <div className="header-content">
              <div>
                <h1 className="header-title">Admin Dashboard</h1>
                <p className="header-subtitle">Welcome back! Here's what's happening today.</p>
              </div>
              <div className="header-time">
                <p className="time-label">Last updated</p>
                <p className="time-value">{new Date().toLocaleString()}</p>
              </div>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="stats-grid">
            <StatCard
              title="Total Members"
              value={stats.members}
              icon={Users}
              trend="up"
              trendValue="8.2"
              colorClass="icon-blue"
            />
            <StatCard
              title="Instructors"
              value={stats.instructors}
              icon={UserCheck}
              trend="up"
              trendValue="5.1"
              colorClass="icon-purple"
            />
            <StatCard
              title="Active Sessions"
              value={stats.sessions}
              icon={Calendar}
              colorClass="icon-pink"
            />
            <StatCard
              title="Total Bookings"
              value={stats.activeBookings}
              icon={BookOpen}
              trend="up"
              trendValue="12.5"
              colorClass="icon-teal"
            />
          </div>

          {/* Charts Section */}
          <div className="charts-grid">
            {/* Bookings Trend */}
            <div className="chart-card">
              <div className="chart-header">
                <h2 className="chart-title">Bookings Trend</h2>
                <Activity size={20} color="#94a3b8" />
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <h2 className="chart-title">Monthly Revenue</h2>
                <TrendingUp size={20} color="#94a3b8" />
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="bottom-grid">
            {/* Session Distribution */}
            <div className="section-card">
              <h2 className="section-title">Session Distribution</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={sessionDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sessionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="legend-list">
                {sessionDistribution.map((item, index) => (
                  <div key={item.name} className="legend-item">
                    <div className="legend-color">
                      <div
                        className="legend-dot"
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span className="legend-name">{item.name}</span>
                    </div>
                    <span className="legend-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="section-card">
              <h2 className="section-title">Quick Actions</h2>
              <div className="action-list">
                <Link to="/admin/members" className="action-btn btn-blue">
                  Manage Members
                </Link>
                <Link to="/admin/instructors" className="action-btn btn-purple">
                  Manage Instructors
                </Link>
                <Link to="/admin/sessions" className="action-btn btn-pink">
                  Manage Sessions
                </Link>
                <Link to="/admin/blog" className="action-btn btn-teal">
                  Manage Blog
                </Link>
                <Link to="/admin/products" className="action-btn btn-indigo">
                  Manage Products
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="section-card">
              <h2 className="section-title">Recent Activity</h2>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-dot dot-green"></div>
                  <div className="activity-content">
                    <p className="activity-title">New member registered</p>
                    <p className="activity-time">John Doe joined 5 minutes ago</p>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-dot dot-blue"></div>
                  <div className="activity-content">
                    <p className="activity-title">Session created</p>
                    <p className="activity-time">Advanced Swimming - 2 hours ago</p>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-dot dot-purple"></div>
                  <div className="activity-content">
                    <p className="activity-title">Booking confirmed</p>
                    <p className="activity-time">Booking #1234 - 3 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;