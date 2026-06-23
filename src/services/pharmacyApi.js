import axios from 'axios';

const API_BASE_URL = 'https://www.nosyapi.com/apiv2/service';
const API_KEY = 'nghLrrrA3KsrerJ0YaWCQb2VAfadnzQxUZllZNCUCY7nRhF2fnKPVEkDvKcr';

export const fetchCities = async () => {
  const response = await axios.get(`${API_BASE_URL}/pharmacies-on-duty/cities`, {
    params: {
      apiKey: API_KEY,
    },
  });

  return response?.data?.data || [];
};

export const fetchOnDutyPharmacies = async (city) => {
  const response = await axios.get(`${API_BASE_URL}/pharmacies-on-duty`, {
    params: {
      apiKey: API_KEY,
      city,
    },
  });

  return response?.data?.data || [];
};
