import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JoinClan from "./Components/JoinClan";
import Signup from "./Components/Signup";
import axios from 'axios';
import ViewClans from "./Components/ViewClans";
import ClanChat from "./Components/ClanChat";
import CreateClan from "./Components/CreateClan";



axios.defaults.withCredentials = true;//allows cookies to be sent by default in axios req body

function App() {
  return (
    <Router>
      <div className="my-3">
        <Routes>
          <Route path="/joinClan" element={<JoinClan />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/viewClans" element={<ViewClans />} />
          <Route path="/clanChat" element={<ClanChat />} />
          <Route path="/createClan" element={<CreateClan />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
