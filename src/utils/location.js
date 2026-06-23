const EARTH_RADIUS_IN_KM = 6371;

export const parseCoordinates = (value) => {
  if (!value) {
    return null;
  }

  let decodedValue = value;

  try {
    decodedValue = decodeURIComponent(value);
  } catch (error) {
    decodedValue = value;
  }

  const patterns = [
    /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
    /[?&](?:q|ll)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
    /(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)/,
  ];

  for (const pattern of patterns) {
    const match = decodedValue.match(pattern);

    if (match) {
      const latitude = Number(match[1]);
      const longitude = Number(match[2]);

      if (Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180) {
        return { latitude, longitude };
      }
    }
  }

  return null;
};

export const hasValidCoordinates = (location) =>
  Number.isFinite(location?.latitude) && Number.isFinite(location?.longitude);

export const getDistanceInKm = (startPoint, destination) => {
  const dLat = (startPoint.latitude - destination.latitude) * Math.PI / 180;
  const dLon = (startPoint.longitude - destination.longitude) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(startPoint.latitude * Math.PI / 180) * Math.cos(destination.latitude * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_IN_KM * c;
};

export const getClosestLocations = (locations, startPoint, limit = 12) => {
  if (!hasValidCoordinates(startPoint) || locations.length === 0) {
    return [];
  }

  return locations
    .map((location) => ({
      ...location,
      distance: getDistanceInKm(startPoint, location),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
};
