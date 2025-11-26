import { useState, useEffect } from 'react';
import { getAnalytics } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#003049', '#669bbc', '#c1121f', '#780000'];

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const response = await getAnalytics();
      setAnalytics(response.data);
      setError(null);
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError('Failed to fetch analytics: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAnalytics();
    
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !analytics) {
    return <div className="loading">Loading analytics...</div>;
  }

  if (error && !analytics) {
    return <div className="error">{error}</div>;
  }

  const chartData = [
    { name: 'Users', count: analytics?.total_users || 0, color: '#003049' },
    { name: 'Products', count: analytics?.total_products || 0, color: '#669bbc' },
    { name: 'Orders', count: analytics?.total_orders || 0, color: '#c1121f' },
    { name: 'Notifications', count: analytics?.total_notifications || 0, color: '#780000' },
  ];

  return (
    <div>
      {error && (
        <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '16px' }}>
          Warning: Connection lost. Showing cached data. ({error})
        </div>
      )}
      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">System Analytics</h2>
          <button onClick={fetchAnalytics} className="btn btn-success">
            Refresh
          </button>
        </div>

        <div className="success" style={{ marginBottom: '24px' }}>
          <strong>Powered by Rust Analytics Service</strong><br/>
          This service aggregates real-time data from all microservices:
          User Service (Go), Product Service (Python), Order Service (Java), 
          and Notification Service (Node.js).
        </div>

        <div className="stats-grid">
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #003049 0%, #003049 100%)' }}>
            <div className="stat-value">{analytics?.total_users || 0}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #669bbc 0%, #669bbc 100%)' }}>
            <div className="stat-value">{analytics?.total_products || 0}</div>
            <div className="stat-label">Total Products</div>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #c1121f 0%, #c1121f 100%)' }}>
            <div className="stat-value">{analytics?.total_orders || 0}</div>
            <div className="stat-label">Total Orders</div>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #780000 0%, #780000 100%)' }}>
            <div className="stat-value">{analytics?.total_notifications || 0}</div>
            <div className="stat-label">Total Notifications</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="panel" style={{ margin: 0 }}>
          <h3 style={{ marginBottom: '20px' }}>Distribution Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel" style={{ margin: 0 }}>
          <h3 style={{ marginBottom: '20px' }}>System Composition</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="count"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <h3 style={{ marginBottom: '24px' }}>Service Communication Map</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>☕</span>
              <h4 style={{ margin: 0, color: '#06b6d4' }}>Order Service Flow</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
                <span style={{ marginRight: '8px' }}>→</span> Verifies User (User Service)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
                <span style={{ marginRight: '8px' }}>→</span> Checks Stock (Product Service)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
                <span style={{ marginRight: '8px' }}>→</span> Sends Alert (Notification Service)
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>🦀</span>
              <h4 style={{ margin: 0, color: '#8b5cf6' }}>Analytics Aggregation</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
                <span style={{ marginRight: '8px' }}>⚡</span> Polls User Counts
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
                <span style={{ marginRight: '8px' }}>⚡</span> Polls Product Inventory
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
                <span style={{ marginRight: '8px' }}>⚡</span> Polls Order History
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
                <span style={{ marginRight: '8px' }}>⚡</span> Polls Notification Logs
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
