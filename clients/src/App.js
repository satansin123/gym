import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import AddWorkout from "./components/AddWorkout";
import ViewClans from "./components/ViewClan";
import JoinClan from "./components/JoinClan";
import { UserProvider } from "./UserContext";
import PrivateRoute from "./components/PrivateRoute";
import CreateClan from "./components/CreateClan";
import "./App.css";

const App = () => {
  return (
    <Router>
      <UserProvider>
        <div className="App">
          <main>
            <Routes>
              <Route
                path="/workouts"
                element={
                  <PrivateRoute>
                    <AddWorkout />
                  </PrivateRoute>
                }
              />
              <Route path="/createClan" element={<CreateClan />} />
              <Route path="/joinClan" element={<JoinClan />} />
              <Route path="/viewClans" element={<ViewClans />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
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
            </Routes>
          </main>
        </div>
      </UserProvider>
    </Router>
  );
};

export default App;
