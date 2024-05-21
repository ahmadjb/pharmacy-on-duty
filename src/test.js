import React, { useState, useEffect } from 'react';
import axios from 'axios';

const YourComponent = () => {
  const [pharmacies, setPharmacies] = useState([]);

  useEffect(() => {
    const fetchPharmacies = async () => {
    
       
const response = await axios.get('https://www.nosyapi.com/apiv2/service/pharmacies/cities', {
    params: {
      'apiKey': 'nghLrrrA3KsrerJ0YaWCQb2VAfadnzQxUZllZNCUCY7nRhF2fnKPVEkDvKcr',
      'city':'ankara'
    }
  });
  console.log("responsesssssssssss",response);
    };

   fetchPharmacies();

  }, []); // Empty dependency array to run effect only once

  console.log('Pharmacies in ankara:', pharmacies); // Log the pharmacies array

  
  return (
    <div>
      <h1>Pharmacies in Ankara</h1>
      <ul>
        {pharmacies.map((pharmacy, index) => (
          <li key={index}>{pharmacy.cities}</li>
        ))}
      </ul>
    </div>
  );
};

export default YourComponent;









const response = await axios.get('https://www.nosyapi.com/apiv2/service/pharmacies/cities', {
  params: {
    'apiKey': 'APIKEY'
  }
});