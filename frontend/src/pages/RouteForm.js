import React, { useState } from 'react';

const soonStyle = {
  fontSize: '1.2rem',
  color: '#64748b',
  background: '#fff',
  padding: '0.75rem 2rem',
  borderRadius: '2rem',
  boxShadow: '0 2px 12px rgba(100,116,139,0.08)',
};

function RouteForm({ onResult, loading }) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [stops, setStops] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    onResult(null);
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
      onResult(data.optimized_route);
    } catch (err) {
      onResult('Error connecting to backend');
    }
  };

  return (
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
      <button type="submit" style={{ padding: '0.5rem 1.5rem', borderRadius: '1rem', background: '#6366f1', color: '#fff', border: 'none', fontWeight: 600 }} disabled={loading}>Optimize Route</button>
    </form>
  );
}

export default RouteForm;
