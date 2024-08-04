import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import AddWorkout from "./components/AddWorkout";
import ViewClans from "./components/ViewClans";
import ViewAllClans from "./components/ViewAllClan";
import JoinClan from "./components/JoinClan";
import CreateClan from "./components/CreateClan";
import ClanChat from "./components/ClanChat"; // Added from ali
import { UserProvider } from "./UserContext";
import PrivateRoute from "./components/PrivateRoute";
import axios from 'axios';
import "./App.css";

axios.defaults.withCredentials = true; // Allows cookies to be sent by default in axios req body

const App = () => {
  return (
    <Router>
      <UserProvider>
        <div className="App">
          <main>
            <Routes>
              {/* Private Routes */}
              <Route
                path="/workouts"
                element={
                  <PrivateRoute>
                    <AddWorkout />
                  </PrivateRoute>
                }
              />
              <Route
                path="/createClan"
                element={
                  <PrivateRoute>
                    <CreateClan />
                  </PrivateRoute>
                }
              />
              <Route
                path="/joinClan"
                element={
                  <PrivateRoute>
                    <JoinClan />
                  </PrivateRoute>
                }
              />
              <Route
                path="/viewAllClans"
                element={
                  <PrivateRoute>
                    <ViewAllClans />
                  </PrivateRoute>
                }
              />
              <Route
                path="/viewClans"
                element={
                  <PrivateRoute>
                    <ViewClans />
                  </PrivateRoute>
                }
              />
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              {/* Public Routes */}
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/clanChat" element={<ClanChat />} />
            </Routes>
          </main>
        </div>
      </UserProvider>
    </Router>
  );
};

export default App;
