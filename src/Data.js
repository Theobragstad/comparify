import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router';
import logo from './img/logo.png';
import './Data.css';



function Data() {
  const location = useLocation();

  const [selectedButton, setSelectedButton] = useState(1);
  const [selectedTimeRange, setSelectedTimeRange] = useState('short_term');
  const timeRanges = ['short_term', 'medium_term', 'long_term'];

  const selectButton = (index) => {
    setSelectedButton(index);
    setSelectedTimeRange(timeRanges[index - 1]);
  };


  const allData = location.state.data.split(',');
  const userNameAndId = allData.slice(1, 3);

  const dataStartIndex = allData.indexOf(selectedTimeRange) + 1;
  const dataEndIndex = (selectedTimeRange == 'long_term') ? allData.length - 1 : allData.indexOf(timeRanges[timeRanges.indexOf(selectedTimeRange) + 1]) - 1;

  const data = allData.slice(dataStartIndex, dataEndIndex + 1);
  console.log(data);


  const topSongIdsEndIndex = data.indexOf('mostLeastPopSongIds[<=2]') - 1;
  const topSongIds = data.slice(1, topSongIdsEndIndex + 1);

  





  
  

  return (
    <div>
      <img src={logo} style={{width:80,paddingTop:'20px'}}></img>
      <h4>comparify Data for {userNameAndId[0]}</h4>
      <div className="navBtnContainer">
        <div className="navBtnOverlay">
          <button className={`navBtn ${selectedButton === 1 ? 'selected' : ''}`} onClick={() => selectButton(1)}>last month</button>
          <button className={`navBtn ${selectedButton === 2 ? 'selected' : ''}`} onClick={() => selectButton(2)}>last 6 months</button>
          <button className={`navBtn ${selectedButton === 3 ? 'selected' : ''}`} onClick={() => selectButton(3)}>all time</button>
        </div>
      </div>
    </div>
  )
}

export default Data