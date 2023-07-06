import React from 'react';
import './App.css';
import {Routes, Route} from 'react-router-dom';
import Home from './Home';
import Code from './Code';
import Data from './Data';
import Compare from './Compare';
import NotFound from './NotFound';
import Game from './Game';
import WaitlistForm from './WaitlistForm';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route path="/code" element={<Code/>}/>
        <Route path="/data" element={<Data/>}/>
        <Route path="/compare" element={<Compare/>}/>
        <Route path="/play" element={<Game/>}/>
        <Route path="/beta" element={<WaitlistForm/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </div>
  );
}

export default App;
