import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const API_BASE = 'http://localhost:3001/api';
const STATUS_FLOW = ['Pending', 'Processing', 'Shipped', 'Delivered'];

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', image: '', description: '', discount: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [orderQuery, setOrderQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  const adminUser = (() => {
    try {
      const raw = localStorage.getItem('adminUser');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin');
      return;
    }
    fetchOrders();
    fetchProducts();
  }, [navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/orders`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to load orders');
      }
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load products');
      setProducts(data);
    } catch (err) {
      console.warn('Could not fetch products:', err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const updateStatus = async (orderId, currentStatus) => {
    const nextStatus = STATUS_FLOW[(STATUS_FLOW.indexOf(currentStatus) + 1) % STATUS_FLOW.length];
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Could not update order status');
      }
      setOrders((prev) => prev.map((order) => (order._id === data._id ? data : order)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((p) => ({ ...p, [name]: value }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const body = { ...newProduct, price: Number(newProduct.price), discount: Number(newProduct.discount || 0) };
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add product');
      setProducts((p) => [data, ...p]);
      setNewProduct({ name: '', price: '', image: '', description: '', discount: 0 });
      try { localStorage.setItem('products_updated', Date.now().toString()); } catch {}
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      setProducts((p) => p.filter((x) => x._id !== id));
      try { localStorage.setItem('products_updated', Date.now().toString()); } catch {}
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateProduct = async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      setProducts((p) => p.map((it) => (it._id === data._id ? data : it)));
      try { localStorage.setItem('products_updated', Date.now().toString()); } catch {}
    } catch (err) {
      setError(err.message);
    }
  };

  const statusCounts = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    { Pending: 0, Processing: 0, Shipped: 0, Delivered: 0 }
  );

  const filteredOrders = useMemo(() => {
    const q = (orderQuery || '').toLowerCase();
    return orders.filter((o) => {
      if (statusFilter && statusFilter !== 'All' && o.status !== statusFilter) return false;
      if (!q) return true;
      return String(o._id).toLowerCase().includes(q) || (o.customerName || '').toLowerCase().includes(q) || (o.customerEmail || '').toLowerCase().includes(q);
    });
  }, [orders, orderQuery, statusFilter]);

  return (
    <div className="admin-dashboard">
      {error && <div className="error-banner">{error}</div>}

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="brand">
            <div className="logo">WS</div>
            <div className="brand-name">Watch Store</div>
            <div className="brand-sub">Admin Console</div>
          </div>

          <div className="stats-mini">
            <div className="stat-box">
              <div className="stat-label">Pending</div>
              <div className="stat-value">{statusCounts.Pending}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Shipped</div>
              <div className="stat-value">{statusCounts.Shipped}</div>
            </div>
          </div>

          <nav className="nav">
            <button className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              📊 Overview
            </button>
            <button className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
              📦 Orders
            </button>
            <button className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
              🛍️ Products
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="user-badge">
              <div className="avatar">👤</div>
              <div>
                <div className="user-email">{adminUser?.email || 'admin'}</div>
                <div className="user-role">Administrator</div>
              </div>
            </div>
            <button className="btn logout" onClick={handleLogout}>Logout</button>
          </div>
        </aside>

        <main className="admin-main">
          <header className="main-header">
            <div>
              <h1>Admin Dashboard</h1>
              <div className="subtitle">Manage your store with ease</div>
            </div>
            <div className="header-actions">
              <button className="btn" onClick={() => navigate('/admin')}>← Admin Home</button>
              <button className="btn primary" onClick={() => { fetchOrders(); fetchProducts(); }}>⟳ Sync Data</button>
            </div>
          </header>

          <section className="content">
            <div className="stats-grid">
              {STATUS_FLOW.map((status) => (
                <div key={status} className="dashboard-card">
                  <div className="card-icon">
                    {status === 'Pending' && '⏳'}
                    {status === 'Processing' && '⚙️'}
                    {status === 'Shipped' && '🚚'}
                    {status === 'Delivered' && '✅'}
                  </div>
                  <div className="card-title">{status}</div>
                  <div className="card-value">{statusCounts[status] || 0}</div>
                </div>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="overview">
                <div className="chart-card">
                  <h3>Sales (last 7 days)</h3>
                  <SimpleChart orders={orders} />
                </div>
                <div className="recent-orders">
                  <h3>📋 Recent Orders</h3>
                  {orders.length === 0 ? (
                    <div className="empty-state">No orders yet</div>
                  ) : (
                    <div className="orders-list">
                      {orders.slice(0, 5).map((o) => (
                        <div key={o._id} className="order-row">
                          <div className="order-info">
                            <strong>{o.customerName || 'Guest'}</strong>
                            <div className="muted">{o.customerEmail}</div>
                          </div>
                          <div className="order-total">${Number(o.total || 0).toFixed(2)}</div>
                          <div className={`status-badge status-${o.status.toLowerCase()}`}>{o.status}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="orders-panel">
                <div className="orders-tools">
                  <input
                    className="search-input"
                    placeholder="🔍 Search by Order ID, name or email..."
                    value={orderQuery}
                    onChange={(e) => setOrderQuery(e.target.value)}
                  />
                  <div className="filters">
                    {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((f) => (
                      <button
                        key={f}
                        className={`filter-btn ${statusFilter === f ? 'active' : ''}`}
                        onClick={() => setStatusFilter(f)}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {loading ? (
                  <div className="loading">Loading orders...</div>
                ) : filteredOrders.length === 0 ? (
                  <div className="empty-state">No orders found</div>
                ) : (
                  <div className="modern-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <React.Fragment key={order._id}>
                            <tr>
                              <td className="order-id">{String(order._id).slice(-8)}</td>
                              <td>
                                {order.customerName || 'Guest'}
                                <div className="muted">{order.customerEmail}</div>
                              </td>
                              <td className="price">${Number(order.total || 0).toFixed(2)}</td>
                              <td>
                                <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="date">{new Date(order.createdAt).toLocaleString()}</td>
                              <td className="controls">
                                <button onClick={() => updateStatus(order._id, order.status)} className="btn small">
                                  Next
                                </button>
                                <button
                                  onClick={() => {
                                    const el = document.getElementById(`items-${order._id}`);
                                    if (el) el.style.display = el.style.display === 'none' ? 'table-row' : 'none';
                                  }}
                                  className="btn small"
                                >
                                  Items
                                </button>
                              </td>
                            </tr>
                            <tr id={`items-${order._id}`} style={{ display: 'none' }} className="items-row">
                              <td colSpan={6}>
                                <ul className="order-items-list">
                                  {(order.items || []).map((it, idx) => (
                                    <li key={idx}>
                                      {it.name || it.title || 'Item'} x {it.quantity || 1} - $
                                      {(it.price || 0).toFixed ? (it.price || 0).toFixed(2) : it.price || 0}
                                    </li>
                                  ))}
                                </ul>
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'products' && (
              <div className="products-panel">
                <div className="add-product-section">
                  <h2>Add New Product</h2>
                  <form onSubmit={handleAddProduct} className="product-form">
                    <input
                      name="name"
                      placeholder="Product Name"
                      value={newProduct.name}
                      onChange={handleNewChange}
                      required
                    />
                    <input
                      name="price"
                      placeholder="Price ($)"
                      value={newProduct.price}
                      onChange={handleNewChange}
                      required
                    />
                    <input
                      name="image"
                      placeholder="Image URL"
                      value={newProduct.image}
                      onChange={handleNewChange}
                    />
                    <input
                      name="discount"
                      placeholder="Discount (%)"
                      value={newProduct.discount}
                      onChange={handleNewChange}
                    />
                    <textarea
                      name="description"
                      placeholder="Product Description"
                      value={newProduct.description}
                      onChange={handleNewChange}
                    />
                    <button type="submit" className="btn primary full">
                      ➕ Add Product
                    </button>
                  </form>
                </div>

                <div className="products-section">
                  <h2>Product Catalog ({products.length})</h2>
                  {products.length === 0 ? (
                    <div className="empty-state">No products yet. Add one above!</div>
                  ) : (
                    <div className="product-grid">
                      {products.map((p) => (
                        <div key={p._id} className="product-card">
                          <div className="thumb" style={{ backgroundImage: `url(${p.image || ''})` }}>
                            {!p.image && <div className="no-image">📷</div>}
                          </div>
                          <div className="info">
                            <strong className="product-name">{p.name}</strong>
                            <div className="product-desc">{p.description}</div>
                            <div className="product-meta">
                              <div className="price">Rs.{p.price}</div>
                              {p.discount > 0 && <div className="disc">{p.discount}% OFF</div>}
                            </div>
                          </div>
                          <div className="actions">
                            <button className="btn danger" onClick={() => handleDeleteProduct(p._id)}>
                              🗑️ Delete
                            </button>
                            <button
                              className="btn"
                              onClick={() => {
                                const newDisc = prompt('Enter discount %', String(p.discount || 0));
                                if (newDisc != null) handleUpdateProduct(p._id, { discount: Number(newDisc) });
                              }}
                            >
                              🏷️ Discount
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function SimpleChart({ orders = [] }) {
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const totals = days.map((day) => {
    const start = new Date(day);
    start.setHours(0, 0, 0, 0);
    const end = new Date(day);
    end.setHours(23, 59, 59, 999);
    return orders.reduce((s, o) => {
      const t = new Date(o.createdAt);
      if (t >= start && t <= end) return s + (Number(o.total) || 0);
      return s;
    }, 0);
  });

  const max = Math.max(...totals, 1);
  const chartHeight = 120;
  const chartWidth = 320;
  const barWidth = 36;
  const gap = 6;

  return (
    <svg width={chartWidth} height={chartHeight} className="chart-svg">
      <defs>
        <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 0.7 }} />
        </linearGradient>
      </defs>

      {totals.map((v, i) => {
        const h = (v / max) * (chartHeight - 30);
        const x = i * (barWidth + gap) + 8;
        const y = chartHeight - 30 - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={h} fill="url(#barGradient)" rx="4" className="chart-bar" />
            <text
              x={x + barWidth / 2}
              y={chartHeight - 8}
              fontSize="10"
              textAnchor="middle"
              fill="#666"
            >
              {days[i].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </text>
          </g>
        );
      })}
    </svg>
  );
}