import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';

const API_KEY = 'nghLrrrA3KsrerJ0YaWCQb2VAfadnzQxUZllZNCUCY7nRhF2fnKPVEkDvKcr';

const getPharmacyMapUrl = (pharmacy) =>
  `https://www.google.com/maps?q=${encodeURIComponent(`${pharmacy?.pharmacyName || ''} ${pharmacy?.address || ''}`)}`;

const parseCoordinates = (value) => {
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

const YourComponent = () => {
  const [myLatitude, setMyLatitude] = useState(null);
  const [myLongitude, setMyLongitude] = useState(null);
  const [openedPharmacies, setOpenedPharmacies] = useState([]);
  const [closestLocations, setClosestLocations] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [geolocation, setGeolocation] = useState(false);
  const [locationMode, setLocationMode] = useState('current');
  const [manualLocationText, setManualLocationText] = useState('');
  const [manualLocation, setManualLocation] = useState(null);
  const [manualLocationError, setManualLocationError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://www.nosyapi.com/apiv2/service/pharmacies-on-duty/cities', {
          params: {
            apiKey: API_KEY
          }
        });
        setCities(response?.data?.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);



  useEffect(() => {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    setCurrentDate(today.toLocaleDateString('tr-TR', options));
    setCurrentDay(today.toLocaleDateString('tr-TR', { weekday: 'long' }));
  }, []);

  useEffect(() => {
    if (!selectedCity) {
      setOpenedPharmacies([]);
      setClosestLocations([]);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get('https://www.nosyapi.com/apiv2/service/pharmacies-on-duty', {
          params: {
            apiKey: API_KEY,
            city: selectedCity
          }
        });
        setOpenedPharmacies(response?.data?.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedCity]);





  useEffect(() => {
    if (locationMode !== 'current') {
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMyLatitude(position.coords.latitude);
        setMyLongitude(position.coords.longitude);
        setGeolocation(true);
      }, (error) => {
        console.error('Error getting geolocation:', error);
        setGeolocation(false);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
      setGeolocation(false);
    }
  }, [locationMode]);

  useEffect(() => {
    const startPoint = locationMode === 'manual'
      ? manualLocation
      : { latitude: myLatitude, longitude: myLongitude };
    const hasStartPoint = Number.isFinite(startPoint?.latitude) && Number.isFinite(startPoint?.longitude);

    if (hasStartPoint && openedPharmacies.length > 0) {
      const distances = openedPharmacies.map((location) => {
        const earthRadius = 6371; // Earth's radius in km
        const dLat = (startPoint.latitude - location.latitude) * Math.PI / 180;
        const dLon = (startPoint.longitude - location.longitude) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(startPoint.latitude * Math.PI / 180) * Math.cos(location.latitude * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;

        const locationWithDistance = { ...location, distance };

        return { location: locationWithDistance, distance };

      });

      const sortedDistances = distances.sort((a, b) => a.distance - b.distance);
      const closest12Locations = sortedDistances.slice(0, 12).map(item => item.location);
      setClosestLocations(closest12Locations);
    } else {
      setClosestLocations([]);
    }
  }, [myLatitude, myLongitude, openedPharmacies, locationMode, manualLocation]);

  const handleLocationModeChange = (mode) => {
    setLocationMode(mode);
    setManualLocationError('');

    if (mode === 'current') {
      setManualLocation(null);
    }
  };

  const handleManualLocationSubmit = () => {
    const coordinates = parseCoordinates(manualLocationText);

    if (!coordinates) {
      setManualLocation(null);
      setManualLocationError('Konum okunamadı. Google Maps linki veya "39.9208, 32.8541" formatında koordinat giriniz.');
      return;
    }

    setManualLocation(coordinates);
    setManualLocationError('');
  };

  return (
    <div>
      <div className='main-container'>
        <div className='row' style={{ width: '100%', backgroundColor: '', display: 'flex', justifyContent: 'space-between' }}>
          <div className='col-md-3 col-12 text-center' style={{ display: '', justifyContent: 'center', alignItems: 'center', paddingTop: 20 }}>
            <div>{currentDay} / {currentDate}</div>
            <div>
              <div style={{ paddingBottom: 7 }}>
                {cities.length > 0 && (
                  <select style={{ borderWidth: 4, borderColor: 'red' }} value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                    <option value="">Bir şehir seçin</option>
                    {cities.map((city, index) => (
                      <option key={index} value={city.slug}>{city.slug}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          <div className='col-md-5 col-12 text-center'>
            <div style={{ backgroundColor: '', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 25, fontWeight: 900, textAlign: 'center', lineHeight: '1.5' }}>ANKARA ECZACI ODASI
              NÖBETÇİ ECZANELER</div>

          </div>
          <div className='col-md-3 col-12 text-center' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Nöbetçi Eczanenin Konum
            Bilgisi için Karekodu Okutunuz</div>
        </div>

        <div className="container" style={{ border: '5px solid gray' }}>
          {selectedCity === "" ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 40, textAlign: 'center' }}>
              Lütfen bir şehir seçiniz
            </div>
          ) : ""}

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, paddingTop: 15, paddingBottom: 15, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleLocationModeChange('current')}
              style={{ padding: '8px 16px', border: locationMode === 'current' ? '3px solid red' : '1px solid gray', backgroundColor: locationMode === 'current' ? '#ffe5e5' : 'white', fontWeight: 700 }}
            >
              Benim konumum
            </button>
            <button
              type="button"
              onClick={() => handleLocationModeChange('manual')}
              style={{ padding: '8px 16px', border: locationMode === 'manual' ? '3px solid red' : '1px solid gray', backgroundColor: locationMode === 'manual' ? '#ffe5e5' : 'white', fontWeight: 700 }}
            >
              Nokta seç
            </button>
          </div>

          {locationMode === 'manual' ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingBottom: 15 }}>
              <div style={{ width: '100%', maxWidth: 650, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                <input
                  type="text"
                  value={manualLocationText}
                  onChange={(event) => setManualLocationText(event.target.value)}
                  placeholder="Google Maps linki veya koordinat giriniz"
                  style={{ flex: 1, minWidth: 260, padding: 8, border: '1px solid gray' }}
                />
                <button type="button" onClick={handleManualLocationSubmit} style={{ padding: '8px 16px', border: '1px solid gray', backgroundColor: 'white', fontWeight: 700 }}>
                  Konumu kullan
                </button>
              </div>
              <div style={{ maxWidth: 650, paddingTop: 6, fontSize: 13, textAlign: 'center' }}>
                Örnek: Google Maps paylaşım linki ya da 39.9208, 32.8541
              </div>
              {manualLocation ? (
                <div style={{ color: 'green', paddingTop: 6, fontWeight: 700 }}>
                  Seçilen nokta: {manualLocation.latitude}, {manualLocation.longitude}
                </div>
              ) : ""}
              {manualLocationError ? (
                <div style={{ color: 'red', paddingTop: 6, textAlign: 'center' }}>
                  {manualLocationError}
                </div>
              ) : ""}
            </div>
          ) : ""}

          {(locationMode === 'current' && geolocation === false && selectedCity !== "" && closestLocations.length === 0) ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 40, textAlign: 'center', color: 'red' }}>
              Konum etkin değil. Lütfen etkinleştirin.
            </div>
          ) : ""}

          {(locationMode === 'manual' && selectedCity !== "" && !manualLocation) ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 26, textAlign: 'center', color: 'red' }}>
              Lütfen hesaplama için bir nokta giriniz.
            </div>
          ) : ""}

          <div className="row">
            {closestLocations.length > 0 && closestLocations.map((location, index) => (
              <div key={index} className="col-md-3 col-sm-6" style={{ padding: 6, border: '2px solid gray' }}>
                <div style={{ padding: 10, backgroundColor: 'white', borderRadius: 5 }}>
                  {
                    closestLocations.length > 0 ? (
                      index === 11 ? (
                        <div style={{ fontSize: 16, fontWeight: 700, textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <QRCode value={`https://yakinnobetcieczane.onrender.com`} />
                          </div>
                          <div style={{ backgroundColor: '', fontSize: 15, textAlign: 'center', lineHeight: '1.5', paddingTop: 20 }}>
                            Bu QR'yi tarayarak bu sayfaya cihazınızdan ulaşabilirsiniz.
                          </div>
                        </div>
                      ) : index === closestLocations.length - 1 ? (
                        <div style={{ fontSize: 16, fontWeight: 700, textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <QRCode value={`https://yakinnobetcieczane.onrender.com`} />
                          </div>
                          <div style={{ backgroundColor: '', fontSize: 15, textAlign: 'center', lineHeight: '1.5', paddingTop: 20 }}>
                            Bu QR'yi tarayarak bu sayfaya cihazınızdan ulaşabilirsiniz.
                          </div>
                        </div>
                      ) : (
                        <>
                          <div style={{ backgroundColor: '', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 22, fontWeight: 900, textAlign: 'center' }}>{location?.pharmacyName}</div>
                          <div style={{ backgroundColor: '', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 15, textAlign: 'center', lineHeight: '1.5' }}>
                            {location?.address}
                          </div>
                          <div style={{ backgroundColor: '', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 20, fontWeight: 500, color: 'red' }}>
                            {`${location?.district} (${Math.round(location?.distance)}-${Math.round(location?.distance + 2)})km`}
                          </div>
                          <div style={{ backgroundColor: '', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 15, fontWeight: 400 }}>
                            TEL: <a href={`tel:${location?.phone}`} className="linkStyle">{location?.phone}</a>
                          </div>

                          <a href={getPharmacyMapUrl(location)} target="_blank" rel="noopener noreferrer">
                            <div style={{ backgroundColor: '' }}>
                              <QRCode value={getPharmacyMapUrl(location)} style={{ height: 60, width: 60, marginTop: -20 }} />
                            </div>
                          </a>

                        </>
                      )
                    )
                      : null}
                </div>
                {(index + 1) % 4 === 0 && <div className="w-100"></div>} {/* Add a new row after every 4 items */}
              </div>
            ))}
          </div>
        </div>

        <div className=' text-center' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Eczanelerimiz, hafta içi 08.30-19.00, Cumartesi 09.30-19.00 arası çalışır. Nöbetçi eczaneler ertesi gün açılış saatine kadar
          hizmet verir, Pazar ve tatil günlerinde ise 09.30’da açılır, ertesi güne kadar hizmet verir.</div>

      </div>

    </div>
  );
};

export default YourComponent;
