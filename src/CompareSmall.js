import React, { useState, useEffect } from 'react';

function CompareSmall() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1000); 
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check on component mount

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      {isSmallScreen ? (
        <h1>This is the small screen version</h1>
        // Render your small screen content here
      ) : (
        <h1>This is the large screen version</h1>
        // Render your large screen content here
      )}
    </div>
  );
};

export default ResponsiveComponent;
