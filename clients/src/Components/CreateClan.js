import React, { useState } from "react";
import axios from "axios";
import { URL } from "../url";
function CreateClan() {
  const [clanName, setClanName] = useState("");

  const handleInputChange = (e) => {
    setClanName(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${URL}/createClan`, { clanName });
      console.log("Clan Created Successfully!");
      alert(`${clanName} created successfully`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Clan name already in use");
      } else {
        console.error(error);
        alert("There was an error");
      }
    }
  };

  return (
    <div>
      <h2>Create Clan Page</h2>
      <input
        type="text"
        value={clanName}
        onChange={handleInputChange}
        placeholder="Enter clan name"
      />
      <button onClick={handleSubmit}>Create Clan</button>
    </div>
  );
}

export default CreateClan;
