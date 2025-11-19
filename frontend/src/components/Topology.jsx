import React from 'react';

function Topology() {
  return (
    <div>
      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Service Architecture Topology</h2>
        </div>
        
        <div style={{ position: 'relative', height: '600px', background: '#f9fafb', borderRadius: '12px', padding: '40px' }}>
          {/* Center - Order Service (Orchestrator) */}
          <div 
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#007396',
              color: 'white',
              padding: '24px 32px',
              borderRadius: '12px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
              textAlign: 'center',
              minWidth: '180px',
              zIndex: 10
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>☕</div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Order Service</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Java / Port 8003</div>
            <div style={{ fontSize: '11px', marginTop: '8px', fontWeight: 'bold' }}>ORCHESTRATOR</div>
          </div>

          {/* Top Left - User Service */}
          <div 
            style={{
              position: 'absolute',
              left: '15%',
              top: '15%',
              background: 'white',
              border: '3px solid #00ADD8',
              padding: '20px 28px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              textAlign: 'center',
              minWidth: '160px'
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔵</div>
            <div style={{ fontWeight: 'bold', color: '#00ADD8' }}>User Service</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Go / Port 8001</div>
          </div>

          {/* Top Right - Product Service */}
          <div 
            style={{
              position: 'absolute',
              right: '15%',
              top: '15%',
              background: 'white',
              border: '3px solid #3776AB',
              padding: '20px 28px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              textAlign: 'center',
              minWidth: '160px'
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>🐍</div>
            <div style={{ fontWeight: 'bold', color: '#3776AB' }}>Product Service</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Python / Port 8002</div>
          </div>

          {/* Bottom - Notification Service */}
          <div 
            style={{
              position: 'absolute',
              left: '50%',
              bottom: '10%',
              transform: 'translateX(-50%)',
              background: 'white',
              border: '3px solid #339933',
              padding: '20px 28px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              textAlign: 'center',
              minWidth: '180px'
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>🟢</div>
            <div style={{ fontWeight: 'bold', color: '#339933' }}>Notification Service</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Node.js / Port 8004</div>
          </div>

          {/* Top Center - Analytics Service */}
          <div 
            style={{
              position: 'absolute',
              left: '50%',
              top: '8%',
              transform: 'translateX(-50%)',
              background: 'white',
              border: '3px solid #CE422B',
              padding: '20px 28px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              textAlign: 'center',
              minWidth: '180px'
            }}
          >
            <div style={{ fontSize: '18px', marginBottom: '8px', fontWeight: 'bold', color: '#CE422B' }}>Rust</div>
            <div style={{ fontWeight: 'bold', color: '#CE422B' }}>Analytics Service</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Rust / Port 8005</div>
          </div>

          {/* Arrows - from Order Service */}
          {/* To User Service */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#667eea" />
              </marker>
            </defs>
            {/* Order -> User */}
            <line x1="45%" y1="45%" x2="32%" y2="30%" stroke="#667eea" strokeWidth="3" markerEnd="url(#arrowhead)" />
            {/* Order -> Product */}
            <line x1="55%" y1="45%" x2="68%" y2="30%" stroke="#667eea" strokeWidth="3" markerEnd="url(#arrowhead)" />
            {/* Order -> Notification */}
            <line x1="50%" y1="58%" x2="50%" y2="78%" stroke="#667eea" strokeWidth="3" markerEnd="url(#arrowhead)" />
            {/* Analytics -> User */}
            <line x1="45%" y1="18%" x2="32%" y2="24%" stroke="#CE422B" strokeWidth="2" strokeDasharray="5,5" />
            {/* Analytics -> Product */}
            <line x1="55%" y1="18%" x2="68%" y2="24%" stroke="#CE422B" strokeWidth="2" strokeDasharray="5,5" />
            {/* Analytics -> Order */}
            <line x1="50%" y1="22%" x2="50%" y2="42%" stroke="#CE422B" strokeWidth="2" strokeDasharray="5,5" />
            {/* Analytics -> Notification */}
            <line x1="42%" y1="22%" x2="42%" y2="80%" stroke="#CE422B" strokeWidth="2" strokeDasharray="5,5" />
          </svg>
        </div>
      </div>

      <div className="main-content">
        <div className="panel">
          <h3 style={{ marginBottom: '16px' }}>📋 Communication Flow</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div className="item">
              <div className="item-title" style={{ color: '#007396' }}>
                1️⃣ Order Creation Flow
              </div>
              <div className="item-details" style={{ marginTop: '8px' }}>
                <strong>User creates order →</strong>
                <ol style={{ marginTop: '8px', marginLeft: '20px' }}>
                  <li>Order Service receives request</li>
                  <li>Calls User Service to verify user exists</li>
                  <li>Calls Product Service to check product availability</li>
                  <li>Creates the order</li>
                  <li>Calls Notification Service to send confirmation</li>
                </ol>
              </div>
            </div>

            <div className="item">
              <div className="item-title" style={{ color: '#CE422B' }}>
                2️⃣ Analytics Aggregation Flow
              </div>
              <div className="item-details" style={{ marginTop: '8px' }}>
                <strong>Analytics Service polls all services →</strong>
                <ul style={{ marginTop: '8px', marginLeft: '20px' }}>
                  <li>Queries User Service for user count</li>
                  <li>Queries Product Service for product count</li>
                  <li>Queries Order Service for order count</li>
                  <li>Queries Notification Service for notification count</li>
                  <li>Aggregates and returns combined metrics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <h3 style={{ marginBottom: '16px' }}>🔧 Technology Stack</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ padding: '12px', background: '#00ADD820', borderRadius: '8px', borderLeft: '4px solid #00ADD8' }}>
              <strong>Go (User Service):</strong> Gorilla Mux, mutex-based concurrency, JSON logging
            </div>
            <div style={{ padding: '12px', background: '#3776AB20', borderRadius: '8px', borderLeft: '4px solid #3776AB' }}>
              <strong>Python (Product Service):</strong> Flask, Gunicorn WSGI server, type hints
            </div>
            <div style={{ padding: '12px', background: '#00739620', borderRadius: '8px', borderLeft: '4px solid #007396' }}>
              <strong>Java (Order Service):</strong> Spring Boot 3.2, RestTemplate, dependency injection
            </div>
            <div style={{ padding: '12px', background: '#33993320', borderRadius: '8px', borderLeft: '4px solid #339933' }}>
              <strong>Node.js (Notification Service):</strong> Express, Winston logger, async/await
            </div>
            <div style={{ padding: '12px', background: '#CE422B20', borderRadius: '8px', borderLeft: '4px solid #CE422B' }}>
              <strong>Rust (Analytics Service):</strong> Actix-web, Reqwest HTTP client, memory safety
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3 style={{ marginBottom: '16px' }}>🎯 Design Patterns Demonstrated</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="item">
            <div className="item-title">Service Orchestration</div>
            <div className="item-details">
              Order Service coordinates multiple services to complete a business transaction
            </div>
          </div>
          <div className="item">
            <div className="item-title">Data Aggregation</div>
            <div className="item-details">
              Analytics Service collects and combines data from all services
            </div>
          </div>
          <div className="item">
            <div className="item-title">Independent Deployment</div>
            <div className="item-details">
              Each service runs in its own container with isolated dependencies
            </div>
          </div>
          <div className="item">
            <div className="item-title">Polyglot Architecture</div>
            <div className="item-details">
              Different languages chosen based on their strengths for each service
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topology;
