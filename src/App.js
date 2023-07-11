import React, {useState} from 'react';
import './App.css';
import {Routes, Route, Navigate} from 'react-router-dom';
import Home from './Home';
import Dashboard from './Dashboard';
import Data from './Data';
import Compare from './Compare';
import NotFound from './NotFound';
import Game from './Game';
import WaitlistForm from './WaitlistForm';
import MoreData from './MoreData';
// export const DarkModeContext = React.createContext(null);



function App() {
     const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="App">
       {/* <DarkModeContext.Provider value={{ darkMode: darkMode, setDarkMode: setDarkMode }}> */}
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/data" element={<Data/>}/>
        <Route path="/compare" element={<Compare/>}/>
        <Route path="/play" element={<Game/>}/>
        <Route path="/beta" element={<WaitlistForm/>}/>
        <Route path="/moredata" element={<MoreData/>}/>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* </DarkModeContext.Provider> */}
    </div>
  );
}

export default App;
