// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./Component/Sidebar";
import Dashboard from "./Pages/Dashboard";
import DataSensor from "./Pages/DataSensor";
import ActionHistory from "./Pages/ActionHistory";
import Profile from "./Pages/Profile";
import NewPage from "./Pages/NewPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="container-fluid">
        <div className="row">
          <div className="col-2">
            <Sidebar />
          </div>
          <div className="col-10">
            <Routes>
              <Route exact path="/" element={<Dashboard />} />
              <Route path="/datasensor" element={<DataSensor />} />
              <Route path="/actionhistory" element={<ActionHistory />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/newpage" element={<NewPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
