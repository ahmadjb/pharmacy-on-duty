export const geocodeAddress = async (query) => {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Address geocoding failed');
  }

  const results = await response.json();
  const firstResult = results[0];

  if (!firstResult) {
    return null;
  }

  return {
    latitude: Number(firstResult.lat),
    longitude: Number(firstResult.lon),
  };
};
