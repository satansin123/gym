import React, { useState } from 'react';
import axios from 'axios';

function JoinClan() {
  const [clanName, setClanName] = useState('');

  const handleInputChange = (event) => {
    setClanName(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8000/joinClan', { clanName });
      console.log(response.data);
      alert("Clan Joined Successfully");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("No Such Clan Found");
      } else {
        console.error(error);
        alert("There was an error");
      }
    }
  };
  

  return (
    <div>
      <h2>Join Clan Page</h2>
      <input
        type="text"
        value={clanName}
        onChange={handleInputChange}
        placeholder="Enter clan name"
      />
      <button onClick={handleSubmit}>Join Clan</button>
    </div>
  );
}

export default JoinClan;
