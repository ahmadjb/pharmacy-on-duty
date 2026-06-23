import { parseCoordinates } from '../utils/location';

const GOOGLE_MAPS_HOSTS = ['maps.app.goo.gl', 'goo.gl', 'google.com', 'www.google.com', 'maps.google.com'];

export const isGoogleMapsUrl = (value) => {
  try {
    const url = new URL(value);

    return GOOGLE_MAPS_HOSTS.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
  } catch (error) {
    return false;
  }
};

export const resolveGoogleMapsLink = async (url) => {
  const response = await fetch(`https://r.jina.ai/http://${url}`, {
    headers: {
      Accept: 'text/plain',
    },
  });

  if (!response.ok) {
    throw new Error('Google Maps link could not be read');
  }

  const text = await response.text();

  return parseCoordinates(text);
};

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
