import React, { useState } from "react";
import axios from "axios";

const JoinClan = () => {
  const [clanName, setClanName] = useState("");

  const handleJoinClan = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/joinClan",
        { clanName },
        { withCredentials: true }
      );
      console.log("Joined clan:", response.data);
      // Handle success (e.g., show a success message)
    } catch (error) {
      console.error("Error joining clan:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div>
      <h2>Join Clan</h2>
      <input
        type="text"
        placeholder="Clan Name"
        value={clanName}
        onChange={(e) => setClanName(e.target.value)}
      />
      <button onClick={handleJoinClan}>Join Clan</button>
    </div>
  );
};

export default JoinClan;
