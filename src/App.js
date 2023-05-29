import React from 'react';
import './App.css';

import {Routes, Route} from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Dashboard from './Dashboard';
import Text from './Text';
import Getcode from './Getcode';





function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/text" element={<Text/>} />
        <Route path="/getcode" element={<Getcode/>} />
      </Routes>
    </div>
  );
}

export default App;
