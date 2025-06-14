// Entry point for React frontend
import React, { useState } from 'react';

const appStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #f8fafc 0%, #c7d2fe 100%)',
  fontFamily: 'Inter, sans-serif',
};

const titleStyle = {
  fontSize: '3rem',
  fontWeight: 700,
  color: '#3730a3',
  marginBottom: '1rem',
  letterSpacing: '2px',
};

const subtitleStyle = {
  fontSize: '1.5rem',
  color: '#6366f1',
  marginBottom: '2rem',
};

const soonStyle = {
  fontSize: '1.2rem',
  color: '#64748b',
  background: '#fff',
  padding: '0.75rem 2rem',
  borderRadius: '2rem',
  boxShadow: '0 2px 12px rgba(100,116,139,0.08)',
};

function App() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [stops, setStops] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('http://localhost:8000/optimize-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start,
          end,
          stops: stops.split(',').map(s => s.trim()).filter(Boolean),
          constraints: {}
        })
      });
      const data = await response.json();
      setResult(data.optimized_route);
    } catch (err) {
      setResult('Error connecting to backend');
    }
    setLoading(false);
  };

  return (
    <div style={appStyle}>
      <div style={titleStyle}>Routecast MVP</div>
      <div style={subtitleStyle}>AI-powered Route & Logistics Optimizer</div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', background: '#fff', padding: '2rem', borderRadius: '1rem', boxShadow: '0 2px 12px rgba(100,116,139,0.08)' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Start Location: <input value={start} onChange={e => setStart(e.target.value)} required /></label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>End Location: <input value={end} onChange={e => setEnd(e.target.value)} required /></label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Stops (comma separated): <input value={stops} onChange={e => setStops(e.target.value)} placeholder="Optional" /></label>
        </div>
        <button type="submit" style={{ padding: '0.5rem 1.5rem', borderRadius: '1rem', background: '#6366f1', color: '#fff', border: 'none', fontWeight: 600 }}>Optimize Route</button>
      </form>
      {loading && <div style={soonStyle}>Optimizing...</div>}
      {result && (
        <div style={soonStyle}>
          <strong>Optimized Route:</strong><br />
          {Array.isArray(result) ? result.join(' → ') : result}
        </div>
      )}
    </div>
  );
}

export default App;
