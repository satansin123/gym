import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import AddWorkout from "./components/AddWorkout";
import CalorieTracker from "./components/CalorieTracker";
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
              <Route
                path="/Addcalorie"
                element={
                  <PrivateRoute>
                    <CalorieTracker />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/Viewcalories"
                element={
                  <PrivateRoute>
                    <CalorieTracker />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/createClan"
                element={
                  <PrivateRoute>
                    <CreateClan />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/joinClan"
                element={
                  <PrivateRoute>
                    {" "}
                    <JoinClan />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/viewClans"
                element={
                  <PrivateRoute>
                    {" "}
                    <ViewClans />{" "}
                  </PrivateRoute>
                }
              />
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
