import React from 'react';
import './App.css';
import {Routes, Route} from 'react-router-dom';
import Home from './Home';
import Code from './Code';
import Data from './Data';
import Compare from './Compare';
import Footer from './Footer';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route path="/code" element={<Code/>}/>
        <Route path="/footer" element={<Footer/>}/>
        <Route path="/data" element={<Data/>}/>
        <Route path="/compare" element={<Compare/>}/>
      </Routes>
    </div>
  );
}

export default App;
