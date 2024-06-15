import React, { useState } from 'react';
import axios from 'axios';

function ViewClans() {
  const [clanNames, setClanNames] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchClans = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/viewClans');
      setClanNames(response.data); // Assuming response.data is an array of clan names
    } catch (error) {
        alert(error)
      console.error('There was an error!', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>View Clans Page</h2>
      <button onClick={fetchClans} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Clans'}
      </button>
      <ul>
        {clanNames.map((clanName, index) => (
          <li key={index}>{clanName}</li>
        ))}
      </ul>
    </div>
  );
}

export default ViewClans;
