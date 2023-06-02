import React from 'react';
import './App.css';

import {Routes, Route} from 'react-router-dom';

import Home from './Home';
import Login from './Login';
import Code from './Code';
import Data from './Data';
import Footer from './Footer';



function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/code" element={<Code/>}/>
        <Route path="/footer" element={<Footer/>}/>
        <Route path="/data" element={<Data/>}/>
      </Routes>
    </div>
  );
}

export default App;
