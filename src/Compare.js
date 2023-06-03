import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router';
import logo from './img/logo.png';
import missingImage from './img/missingImage.png';
import './Data.css';


function Compare() {
    const location = useLocation();
    const file1 = location.state.file1;
    const file2 = location.state.file2;
    console.log(file1);
    console.log(file2);
   
    return (
        <div>
            <h4>compare</h4>
            {file1}
            <br></br>
            {file2}
        </div>
    )
}

export default Compare