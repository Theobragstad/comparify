import React from 'react';
import './App.css';

import {Routes, Route} from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Dashboard from './Dashboard';
import Text from './Text';
import Getcode from './Getcode';
import Footer from './Footer';
import Data from './Data';



function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/text" element={<Text/>} />
        <Route path="/getcode" element={<Getcode/>} />
        <Route path="/footer" element={<Footer/>} />
        <Route path="/data" element={<Data/>} />
      </Routes>
    </div>
  );
}

export default App;
