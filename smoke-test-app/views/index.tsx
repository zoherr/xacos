import React from 'react';

export const meta = {
  title: 'Welcome to XAOCS',
  description: 'Your new XAOCS application is ready.'
};

export default function IndexPage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>XAOCS</h1>
      <p style={{ fontSize: '1.2rem', color: '#666' }}>
        The high-performance framework for rapid development.
      </p>
      <div style={{ marginTop: '40px' }}>
        <a href="/api" style={{ marginRight: '20px', color: '#0070f3' }}>View API</a>
        <a href="/login" style={{ color: "#0070f3" }}>Login</a>
      </div>
    </div>
  );
}
