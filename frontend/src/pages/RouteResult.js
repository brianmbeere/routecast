import React from 'react';

const soonStyle = {
  fontSize: '1.2rem',
  color: '#64748b',
  background: '#fff',
  padding: '0.75rem 2rem',
  borderRadius: '2rem',
  boxShadow: '0 2px 12px rgba(100,116,139,0.08)',
};

function RouteResult({ result, loading }) {
  if (loading) return <div style={soonStyle}>Optimizing...</div>;
  if (!result) return null;
  return (
    <div style={soonStyle}>
      <strong>Optimized Route:</strong><br />
      {Array.isArray(result) ? result.join(' → ') : result}
    </div>
  );
}

export default RouteResult;
