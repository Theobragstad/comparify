import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import "./App.css";

import Home from "./Home";
import Beta from "./Beta";
import Dashboard from "./Dashboard";
import Data from "./Data";
import Compare from "./Compare";
import MoreData from "./MoreData";
import Animation from "./Animation";
import DarkmodeToggle from "./DarkmodeToggle"; // Import the DarkmodeToggle component


function App() {
  return (
    <div className="App">
      <DarkmodeToggle />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/waitlist" element={<Beta />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/data" element={<Data />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/moredata" element={<MoreData />} />
        {/* <Route path="/:)" element={<Animation />} /> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Analytics />
      <SpeedInsights />

    </div>
  );
}

export default App;
