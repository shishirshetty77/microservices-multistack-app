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
    <div className="container">
      <div className="header">
        <h1> Microservices Dashboard</h1>
        <p>Multi-language microservices architecture in action</p>
      </div>

      <nav className="nav">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          Dashboard
        </Link>
        <Link to="/topology" className={`nav-link ${location.pathname === '/topology' ? 'active' : ''}`}>
          Topology
        </Link>
        <Link to="/users" className={`nav-link ${location.pathname === '/users' ? 'active' : ''}`}>
          Users
        </Link>
        <Link to="/products" className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}>
          Products
        </Link>
        <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}>
          Orders
        </Link>
        <Link to="/notifications" className={`nav-link ${location.pathname === '/notifications' ? 'active' : ''}`}>
          Notifications
        </Link>
        <Link to="/analytics" className={`nav-link ${location.pathname === '/analytics' ? 'active' : ''}`}>
          Analytics
        </Link>
      </nav>

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
  );
}

export default App;
