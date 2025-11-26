import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Products from './components/Products';
import Orders from './components/Orders';
import Notifications from './components/Notifications';
import Analytics from './components/Analytics';
import Topology from './components/Topology';

function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="logo-icon">M</div>
            <h1>Microservices</h1>
          </div>
          
          <nav className="sidebar-nav">
            <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
              <span className="nav-icon">📊</span>
              Dashboard
            </Link>
            <Link to="/topology" className={`nav-item ${location.pathname === '/topology' ? 'active' : ''}`}>
              <span className="nav-icon">🕸️</span>
              Topology
            </Link>
            <Link to="/users" className={`nav-item ${location.pathname === '/users' ? 'active' : ''}`}>
              <span className="nav-icon">👥</span>
              Users
            </Link>
            <Link to="/products" className={`nav-item ${location.pathname === '/products' ? 'active' : ''}`}>
              <span className="nav-icon">📦</span>
              Products
            </Link>
            <Link to="/orders" className={`nav-item ${location.pathname === '/orders' ? 'active' : ''}`}>
              <span className="nav-icon">🛒</span>
              Orders
            </Link>
            <Link to="/notifications" className={`nav-item ${location.pathname === '/notifications' ? 'active' : ''}`}>
              <span className="nav-icon">🔔</span>
              Notifications
            </Link>
            <Link to="/analytics" className={`nav-item ${location.pathname === '/analytics' ? 'active' : ''}`}>
              <span className="nav-icon">📈</span>
              Analytics
            </Link>
          </nav>

        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <h2 className="page-title">
            {location.pathname === '/' ? 'Dashboard' : 
             location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.slice(2)}
          </h2>
        </header>

        <div className="content-area">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/topology" element={<Topology />} />
            <Route path="/users" element={<Users />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
