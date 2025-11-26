import React from 'react';

function Topology() {
  return (
    <div>
      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Service Architecture Topology</h2>
        </div>
        
        <div style={{ position: 'relative', height: '600px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '40px', border: '1px solid var(--border-glass)' }}>
          <div 
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#0ea5e9', // Lighter blue
              color: 'white',
              padding: '24px 32px',
              borderRadius: '12px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
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

          <div 
            style={{
              position: 'absolute',
              left: '15%',
              top: '15%',
              background: 'rgba(30, 41, 59, 0.9)', // Darker card bg
              border: '2px solid #38bdf8', // Lighter border
              padding: '20px 28px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              textAlign: 'center',
              minWidth: '160px',
              color: 'white'
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔵</div>
            <div style={{ fontWeight: 'bold', color: '#38bdf8' }}>User Service</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Go / Port 8001</div>
          </div>

          <div 
            style={{
              position: 'absolute',
              right: '15%',
              top: '15%',
              background: 'rgba(30, 41, 59, 0.9)',
              border: '2px solid #60a5fa', // Lighter blue
              padding: '20px 28px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              textAlign: 'center',
              minWidth: '160px',
              color: 'white'
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>🐍</div>
            <div style={{ fontWeight: 'bold', color: '#60a5fa' }}>Product Service</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Python / Port 8002</div>
          </div>

          <div 
            style={{
              position: 'absolute',
              left: '50%',
              bottom: '10%',
              transform: 'translateX(-50%)',
              background: 'rgba(30, 41, 59, 0.9)',
              border: '2px solid #4ade80', // Lighter green
              padding: '20px 28px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              textAlign: 'center',
              minWidth: '180px',
              color: 'white'
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>🟢</div>
            <div style={{ fontWeight: 'bold', color: '#4ade80' }}>Notification Service</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Node.js / Port 8004</div>
          </div>

          <div 
            style={{
              position: 'absolute',
              left: '50%',
              top: '8%',
              transform: 'translateX(-50%)',
              background: 'rgba(30, 41, 59, 0.9)',
              border: '2px solid #f87171', // Lighter red
              padding: '20px 28px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              textAlign: 'center',
              minWidth: '180px',
              color: 'white'
            }}
          >
            <div style={{ fontSize: '18px', marginBottom: '8px', fontWeight: 'bold', color: '#f87171' }}>Rust</div>
            <div style={{ fontWeight: 'bold', color: '#f87171' }}>Analytics Service</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Rust / Port 8005</div>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(8px)',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            fontSize: '12px',
            zIndex: 20
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>Map Legend</div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ width: '20px', height: '2px', background: '#38bdf8', marginRight: '8px' }}></span>
              <span>Sync Request (Order Flow)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '20px', height: '2px', background: '#f87171', marginRight: '8px', borderTop: '2px dashed #f87171' }}></span>
              <span>Async Poll (Analytics)</span>
            </div>
          </div>

          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#38bdf8" />
              </marker>
              <marker id="arrowhead-red" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#f87171" />
              </marker>
            </defs>
            
            <line x1="45%" y1="45%" x2="32%" y2="30%" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <rect x="36%" y="36%" width="100" height="24" rx="4" fill="#0f172a" stroke="#38bdf8" />
            <text x="37%" y="38%" dy=".3em" fill="#fff" fontSize="11" fontWeight="bold">1. Verify User</text>

            <line x1="55%" y1="45%" x2="68%" y2="30%" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <rect x="58%" y="36%" width="100" height="24" rx="4" fill="#0f172a" stroke="#38bdf8" />
            <text x="59%" y="38%" dy=".3em" fill="#fff" fontSize="11" fontWeight="bold">2. Check Stock</text>

            <line x1="50%" y1="58%" x2="50%" y2="78%" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <rect x="51%" y="68%" width="110" height="24" rx="4" fill="#0f172a" stroke="#38bdf8" />
            <text x="52%" y="70%" dy=".3em" fill="#fff" fontSize="11" fontWeight="bold">3. Send Alert</text>

            <line x1="45%" y1="18%" x2="32%" y2="24%" stroke="#f87171" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead-red)" />
            
            <line x1="55%" y1="18%" x2="68%" y2="24%" stroke="#f87171" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead-red)" />
            
            <line x1="50%" y1="22%" x2="50%" y2="42%" stroke="#f87171" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead-red)" />
            
            <line x1="42%" y1="22%" x2="42%" y2="80%" stroke="#f87171" strokeWidth="2" strokeDasharray="5,5" />
            
            <text x="48%" y="28%" fill="#f87171" fontSize="10" fontWeight="bold" textAnchor="middle" style={{ background: 'white' }}>Polls Data</text>
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
        <h3 style={{ marginBottom: '16px' }}>Design Patterns Demonstrated</h3>
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
