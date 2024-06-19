import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateClan = () => {
  const [clanName, setClanName] = useState("");
  const navigate = useNavigate();

  const handleCreateClan = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/createClan",
        { name: clanName },
        { withCredentials: true }
      );
      console.log("Created clan:", response.data);

      // Handle success (e.g., show a success message)
    } catch (error) {
      console.error("Error creating clan:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div>
      <h2>Create Clan</h2>
      <input
        type="text"
        placeholder="Clan Name"
        value={clanName}
        onChange={(e) => setClanName(e.target.value)}
      />
      <button onClick={handleCreateClan}>Create Clan</button>
    </div>
  );
};

export default CreateClan;
