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

function HomePage({ children }) {
  return (
    <div style={appStyle}>
      <div style={titleStyle}>Routecast MVP</div>
      <div style={subtitleStyle}>AI-powered Route & Logistics Optimizer</div>
      {children}
    </div>
  );
}

export default HomePage;
