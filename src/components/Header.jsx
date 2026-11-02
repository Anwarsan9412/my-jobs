import React from 'react';
import { Link, useLocation } from 'react-router-dom';


const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAbout = location.pathname === '/intransit';

    const baseStyle = {
    border: '2.5px solid black',
    borderRadius: '50px',
    padding: '8px 16px',
    fontWeight: '900',
    fontSize: '12px',
    textDecoration: 'none',
    boxShadow: '4px 4px 0px black',
  };

return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
      <Link 
        to="/" 
        style={{ 
          ...baseStyle, 
          background: isHome ? 'black' : 'white', 
          color: isHome ? 'white' : 'black' 
        }}
      >
        HOME
      </Link>
      <Link 
        to="/intransit" 
        style={{ 
          ...baseStyle, 
          background: isAbout ? 'black' : 'white', 
          color: isAbout ? 'white' : 'black' 
        }}
      >
        INTRANSIT
      </Link>
    </div>
  );
}

export default Header
