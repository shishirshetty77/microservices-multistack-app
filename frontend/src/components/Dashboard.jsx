import { useState, useEffect } from 'react';
import { checkAllServices } from '../api';

const services = [
  { 
    name: 'User Service', 
    port: 8001, 
    tech: 'Go', 
    description: 'Manages user accounts and profiles',
    color: '#003049'
  },
  { 
    name: 'Product Service', 
    port: 8002, 
    tech: 'Python', 
    description: 'Handles product catalog and inventory',
    color: '#669bbc'
  },
  { 
    name: 'Order Service', 
    port: 8003, 
    tech: 'Java', 
    description: 'Processes orders and orchestrates services',
    color: '#c1121f'
  },
  { 
    name: 'Notification Service', 
    port: 8004, 
    tech: 'Node.js', 
    description: 'Sends and stores notifications',
    color: '#780000'
  },
  { 
    name: 'Analytics Service', 
    port: 8005, 
    tech: 'Rust', 
    description: 'Aggregates metrics from all services',
    color: '#003049'
  },
];

function Dashboard() {
  const [serviceStatus, setServiceStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const checkServices = async () => {
    setLoading(true);
    try {
      const results = await checkAllServices();
      setServiceStatus(results);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error checking services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkServices();
    const interval = setInterval(checkServices, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getServiceInfo = (serviceName) => {
    return services.find(s => s.name === serviceName) || {};
  };

  const healthyCount = serviceStatus.filter(s => s.status === 'healthy').length;
  const totalCount = serviceStatus.length;

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{healthyCount}/{totalCount}</div>
          <div className="stat-label">Services Healthy</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">5</div>
          <div className="stat-label">Languages</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{lastUpdate || '--'}</div>
          <div className="stat-label">Last Updated</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {loading ? '...' : (healthyCount === totalCount ? '✓' : '✗')}
          </div>
          <div className="stat-label">System Status</div>
        </div>
      </div>

      {loading && serviceStatus.length === 0 ? (
        <div className="loading">Checking services...</div>
      ) : (
        <div className="service-grid">
          {serviceStatus.map((service) => {
            const info = getServiceInfo(service.service);
            return (
              <div key={service.service} className="service-card">
                <div className="service-header">
                  <div className="service-name">{service.service}</div>
                  <span className={`status-badge ${service.status === 'healthy' ? 'status-healthy' : 'status-unhealthy'}`}>
                    {service.status}
                  </span>
                </div>
                <div className="service-info">{info.description}</div>
                <div className="service-info">
                  <strong>Port:</strong> {info.port}
                </div>
                <span className="service-tech" style={{ background: info.color + '20', color: info.color }}>
                  {info.tech}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">What Each Service Does</h2>
        </div>
        <div style={{ display: 'grid', gap: '16px' }}>
          <div className="item">
            <div className="item-header">
              <div className="item-title">🔵 User Service (Go)</div>
              <span style={{ color: '#003049', fontWeight: 'bold' }}>Port 8001</span>
            </div>
            <div className="item-details">
              Manages user accounts - CREATE, READ, UPDATE, DELETE operations. 
              Other services verify user existence before processing requests.
            </div>
          </div>

          <div className="item">
            <div className="item-header">
              <div className="item-title">🐍 Product Service (Python)</div>
              <span style={{ color: '#669bbc', fontWeight: 'bold' }}>Port 8002</span>
            </div>
            <div className="item-details">
              Handles product catalog - manages inventory, pricing, and stock levels. 
              Built with Flask and Gunicorn for production-ready API.
            </div>
          </div>

          <div className="item">
            <div className="item-header">
              <div className="item-title">☕ Order Service (Java)</div>
              <span style={{ color: '#c1121f', fontWeight: 'bold' }}>Port 8003</span>
            </div>
            <div className="item-details">
              <strong>Core orchestrator!</strong> When you create an order, it:
              <ul style={{ marginTop: '8px', marginLeft: '20px' }}>
                <li>✓ Validates user exists (calls User Service)</li>
                <li>✓ Checks product availability (calls Product Service)</li>
                <li>✓ Sends confirmation (calls Notification Service)</li>
              </ul>
              This demonstrates <strong>inter-service communication</strong>!
            </div>
          </div>

          <div className="item">
            <div className="item-header">
              <div className="item-title">🟢 Notification Service (Node.js)</div>
              <span style={{ color: '#780000', fontWeight: 'bold' }}>Port 8004</span>
            </div>
            <div className="item-details">
              Stores and retrieves notifications/messages sent by other services. 
              Gets automatically triggered when orders are created.
            </div>
          </div>

          <div className="item">
            <div className="item-header">
              <div className="item-title">Analytics Service (Rust)</div>
              <span style={{ color: '#003049', fontWeight: 'bold' }}>Port 8005</span>
            </div>
            <div className="item-details">
              Aggregates data from ALL services to show system-wide metrics:
              total users, products, orders, and notifications. Demonstrates service aggregation pattern.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
