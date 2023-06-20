import React from 'react';
import earth from './img/earth.png'

const NotFound = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15vh' }}>
  <img src={earth} style={{ width: '100px' }} />
  <div style={{ marginLeft: '20px', textAlign: 'left' }}>
    <h4>404</h4>
    <h5 style={{ color: 'gray' }}>The requested page was not found.</h5>
  </div>
</div>

  );
};

export default NotFound;
