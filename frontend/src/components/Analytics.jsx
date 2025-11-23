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
      // Don't set loading to true here to avoid flickering on updates
      // setLoading(true); 
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
    // Initial load
    setLoading(true);
    fetchAnalytics();
    
    const interval = setInterval(fetchAnalytics, 10000); // Update every 10 seconds
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

      <div className="main-content">
        <div className="panel">
          <h3 style={{ marginBottom: '20px' }}>Distribution Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#003049" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <h3 style={{ marginBottom: '20px' }}>System Composition</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, name, value }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  
                  return (
                    <text 
                      x={x} 
                      y={y} 
                      fill="white" 
                      textAnchor={x > cx ? 'start' : 'end'} 
                      dominantBaseline="central"
                      style={{ fontSize: '12px', fontWeight: 'bold' }}
                    >
                      {value > 0 ? `${name}: ${value}` : ''}
                    </text>
                  );
                }}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value}`, name]} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => `${value}: ${entry.payload.value}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <h3 style={{ marginBottom: '16px' }}>Service Communication Map</h3>
        <div style={{ background: '#fdf0d5', padding: '20px', borderRadius: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
            <div>
              <strong style={{ color: '#003049' }}>→ Order Service calls:</strong>
              <ul style={{ marginTop: '8px', marginLeft: '20px' }}>
                <li>User Service (verify user exists)</li>
                <li>Product Service (check availability)</li>
                <li>Notification Service (send confirmation)</li>
              </ul>
            </div>
            <div>
              <strong style={{ color: '#c1121f' }}>→ Analytics Service calls:</strong>
              <ul style={{ marginTop: '8px', marginLeft: '20px' }}>
                <li>User Service (count users)</li>
                <li>Product Service (count products)</li>
                <li>Order Service (count orders)</li>
                <li>Notification Service (count notifications)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
