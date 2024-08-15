// src/components/Login.js
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../UserContext";
import { URL } from "../url";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["uid"]);
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${URL}/login`, {
        email,
        password,
      });

      const { token } = response.data;
      setCookie("uid", token, { path: "/" });

      const decoded = jwtDecode(token);
      const user = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
      };

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      window.location.reload();
      navigate("/");
    } catch (error) {
      console.error("Login error:", error.response?.data);
      setError(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
      <br />
      <h3>Go to signup page:</h3>
      <button type="button" onClick={() => navigate("/signup")}>
        Signup
      </button>
      <h3>
        Go to home page if you logged in but couldnt navigate automatically:
      </h3>
      <button type="button" onClick={() => navigate("/")}>
        Home
      </button>
    </div>
  );
};

export default Login;
