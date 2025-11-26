import { useState, useEffect } from 'react';
import { checkAllServices } from '../api';

const services = [
  { 
    name: 'User Service', 
    port: 8001, 
    tech: 'Go', 
    description: 'Manages user accounts and profiles',
  },
  { 
    name: 'Product Service', 
    port: 8002, 
    tech: 'Python', 
    description: 'Handles product catalog and inventory',
    color: '#818cf8'
  },
  { 
    name: 'Order Service', 
    port: 8003, 
    tech: 'Java', 
    description: 'Processes orders and orchestrates services',
    color: '#f87171'
  },
  { 
    name: 'Notification Service', 
    port: 8004, 
    tech: 'Node.js', 
    description: 'Sends and stores notifications',
    color: '#4ade80'
  },
  { 
    name: 'Analytics Service', 
    port: 8005, 
    tech: 'Rust', 
    description: 'Aggregates metrics from all services',
    color: '#fb923c'
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
    const interval = setInterval(checkServices, 5000);
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
          <h2 className="panel-title">System Architecture & Features</h2>
        </div>
        <div className="feature-grid">
          <div className="feature-item">
            <div className="feature-icon">🔵</div>
            <div className="feature-content">
              <h4>User Service (Go)</h4>
              <p>High-performance user management handling authentication, profiles, and security. Built with Go for concurrency.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">🐍</div>
            <div className="feature-content">
              <h4>Product Service (Python)</h4>
              <p>Flexible catalog management using Flask. Handles inventory logic and dynamic pricing updates.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">☕</div>
            <div className="feature-content">
              <h4>Order Service (Java)</h4>
              <p>Enterprise-grade orchestration. Manages distributed transactions across User, Product, and Notification services.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">🟢</div>
            <div className="feature-content">
              <h4>Notification Service (Node.js)</h4>
              <p>Event-driven messaging system. Asynchronously processes alerts and updates for users.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">🦀</div>
            <div className="feature-content">
              <h4>Analytics Service (Rust)</h4>
              <p>Real-time data aggregation. Compiles metrics from all microservices with zero-cost abstractions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
