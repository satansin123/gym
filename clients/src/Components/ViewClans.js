import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ViewClans() {
  const [clanNames, setClanNames] = useState([]);
  const [clanChat, setClanChat] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchClans = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/viewClans/user");
      setClanNames(response.data); // Assuming response.data is an array of clan names
    } catch (error) {
      alert(error.message);
      console.error("There was an error!", error);
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate();

  const handleButtonClick = async (clanName) => {
    try {
      setLoading(true); 
      
      navigate("/clanChat", { state: { clanName: clanName } });
    } catch (error) {
      console.error("There was an error fetching the clan chat!", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>View Clans Page</h2>
      <button onClick={fetchClans} disabled={loading}>
        {loading ? "Loading..." : "Fetch Clans"}
      </button>
      <ul>
        {clanNames.map((clanName, index) => (
          <li key={index}>
            {clanName}
            <button onClick={() => handleButtonClick(clanName)}>
              View Chats
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewClans;
