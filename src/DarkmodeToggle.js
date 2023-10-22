// DarkmodeToggle.js
import React, { useEffect } from "react";
import Darkmode from 'darkmode-js';

const DarkmodeToggle = () => {
  useEffect(() => {
    const options = {
      time: '0.4s',
      mixColor: '#fff',
      backgroundColor: '#fff',
      buttonColorDark: '#100f2c',
      buttonColorLight: '#fff',
      autoMatchOsTheme: true,
    };

    const darkmode = new Darkmode(options);
    darkmode.showWidget();

    return () => {
      // Cleanup any resources if needed
    //   darkmode.removeWidget();
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default DarkmodeToggle;
