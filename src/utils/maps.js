export const getPharmacyMapUrl = (pharmacy) =>
  `https://www.google.com/maps?q=${encodeURIComponent(`${pharmacy?.pharmacyName || ''} ${pharmacy?.address || ''}`)}`;
