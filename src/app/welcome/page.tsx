import React from 'react';

const WelcomePage = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '50px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      }}>
        <h1 style={{
          fontSize: '56px',
          color: '#333',
          margin: '0',
        }}>Welcome to Luohan API!</h1>
        <p style={{
          fontSize: '20px',
          color: '#666',
          marginTop: '20px',
        }}>Start building your amazing API here.</p>
      </div>
    </div>
  );
};

export default WelcomePage;