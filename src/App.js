import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Home from "./Home";
import Beta from "./Beta";
import Dashboard from "./Dashboard";
import Data from "./Data";
import Compare from "./Compare";
import MoreData from "./MoreData";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/beta" element={<Beta />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/data" element={<Data />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/moredata" element={<MoreData />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
