import { useEffect, useMemo, useState } from 'react';
import AppHeader from './components/AppHeader';
import LocationSelector from './components/LocationSelector';
import PharmacyGrid from './components/PharmacyGrid';
import { fetchCities, fetchOnDutyPharmacies } from './services/pharmacyApi';
import { getClosestLocations, parseCoordinates } from './utils/location';

const LOCATION_MODES = {
  CURRENT: 'current',
  MANUAL: 'manual',
};

const App = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [openedPharmacies, setOpenedPharmacies] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [geolocation, setGeolocation] = useState(false);
  const [locationMode, setLocationMode] = useState(LOCATION_MODES.CURRENT);
  const [manualLocationText, setManualLocationText] = useState('');
  const [manualLocation, setManualLocation] = useState(null);
  const [manualLocationError, setManualLocationError] = useState('');

  useEffect(() => {
    const loadCities = async () => {
      try {
        const cityList = await fetchCities();
        setCities(cityList);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    loadCities();
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
      return;
    }

    const loadPharmacies = async () => {
      try {
        const pharmacies = await fetchOnDutyPharmacies(selectedCity);
        setOpenedPharmacies(pharmacies);
      } catch (error) {
        console.error('Error fetching pharmacies:', error);
      }
    };

    loadPharmacies();
  }, [selectedCity]);

  useEffect(() => {
    if (locationMode !== LOCATION_MODES.CURRENT) {
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
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

  const startPoint = locationMode === LOCATION_MODES.MANUAL ? manualLocation : currentLocation;
  const closestLocations = useMemo(
    () => getClosestLocations(openedPharmacies, startPoint),
    [openedPharmacies, startPoint]
  );

  const handleLocationModeChange = (mode) => {
    setLocationMode(mode);
    setManualLocationError('');

    if (mode === LOCATION_MODES.CURRENT) {
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
        <AppHeader
          currentDay={currentDay}
          currentDate={currentDate}
          cities={cities}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
        />

        <div className="container pharmacy-results">
          {selectedCity === "" ? (
            <div className="empty-state">
              Lütfen bir şehir seçiniz
            </div>
          ) : null}

          <LocationSelector
            locationMode={locationMode}
            manualLocationText={manualLocationText}
            manualLocation={manualLocation}
            manualLocationError={manualLocationError}
            onModeChange={handleLocationModeChange}
            onManualLocationTextChange={setManualLocationText}
            onManualLocationSubmit={handleManualLocationSubmit}
          />

          {(locationMode === LOCATION_MODES.CURRENT && geolocation === false && selectedCity !== "" && closestLocations.length === 0) ? (
            <div className="error-state error-state--large">
              Konum etkin değil. Lütfen etkinleştirin.
            </div>
          ) : null}

          {(locationMode === LOCATION_MODES.MANUAL && selectedCity !== "" && !manualLocation) ? (
            <div className="error-state">
              Lütfen hesaplama için bir nokta giriniz.
            </div>
          ) : null}

          <PharmacyGrid pharmacies={closestLocations} />
        </div>

        <div className="working-hours text-center">Eczanelerimiz, hafta içi 08.30-19.00, Cumartesi 09.30-19.00 arası çalışır. Nöbetçi eczaneler ertesi gün açılış saatine kadar
          hizmet verir, Pazar ve tatil günlerinde ise 09.30’da açılır, ertesi güne kadar hizmet verir.</div>

      </div>

    </div>
  );
};

export default App;
