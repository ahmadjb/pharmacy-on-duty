import { useEffect, useMemo, useState } from 'react';
import AppHeader from './components/AppHeader';
import LocationSelector from './components/LocationSelector';
import PharmacyGrid from './components/PharmacyGrid';
import { DATE_LOCALES, LANGUAGE_OPTIONS, translations } from './i18n/translations';
import { geocodeAddress, isGoogleMapsUrl, resolveGoogleMapsLink } from './services/geocodingApi';
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
  const [selectedLanguage, setSelectedLanguage] = useState('tr');
  const text = translations[selectedLanguage];

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
    const locale = DATE_LOCALES[selectedLanguage];

    setCurrentDate(today.toLocaleDateString(locale, options));
    setCurrentDay(today.toLocaleDateString(locale, { weekday: 'long' }));
  }, [selectedLanguage]);

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

  const handleManualLocationSubmit = async () => {
    const trimmedLocationText = manualLocationText.trim();
    const coordinates = parseCoordinates(trimmedLocationText);

    if (!trimmedLocationText) {
      setManualLocationError('emptyLocation');
      return;
    }

    if (coordinates) {
      setManualLocation(coordinates);
      setManualLocationError('');
      return;
    }

    if (isGoogleMapsUrl(trimmedLocationText)) {
      try {
        const mapsCoordinates = await resolveGoogleMapsLink(trimmedLocationText);

        if (mapsCoordinates) {
          setManualLocation(mapsCoordinates);
          setManualLocationError('');
          return;
        }

        setManualLocation(null);
        setManualLocationError('mapsLinkNotReadable');
        return;
      } catch (error) {
        console.error('Error resolving Google Maps link:', error);
        setManualLocationError('mapsLinkFailed');
        return;
      }
    }

    try {
      const geocodedLocation = await geocodeAddress(trimmedLocationText);

      if (!geocodedLocation) {
        setManualLocation(null);
        setManualLocationError('addressNotFound');
        return;
      }

      setManualLocation(geocodedLocation);
      setManualLocationError('');
    } catch (error) {
      console.error('Error geocoding address:', error);
      setManualLocationError('addressSearchFailed');
    }
  };

  const handleMapLocationSelect = (location) => {
    setManualLocation(location);
    setManualLocationText(`${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`);
    setManualLocationError('');
  };

  return (
    <div lang={selectedLanguage} dir={selectedLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className="language-switcher">
        <label className="language-select-label" htmlFor="language-select">{text.languageLabel}: </label>
        <select id="language-select" className="language-select" value={selectedLanguage} onChange={(event) => setSelectedLanguage(event.target.value)}>
          {LANGUAGE_OPTIONS.map((language) => (
            <option key={language.code} value={language.code}>{language.label}</option>
          ))}
        </select>
      </div>
      <div className='main-container'>
        <AppHeader
          currentDay={currentDay}
          currentDate={currentDate}
          cities={cities}
          selectedCity={selectedCity}
          text={text}
          onCityChange={setSelectedCity}
        />

        <div className="container pharmacy-results">
          {selectedCity === "" ? (
            <div className="empty-state">
              {text.chooseCity}
            </div>
          ) : null}

          <LocationSelector
            locationMode={locationMode}
            manualLocationText={manualLocationText}
            manualLocation={manualLocation}
            manualLocationError={manualLocationError ? text.errors[manualLocationError] : ''}
            currentLocation={currentLocation}
            text={text}
            onModeChange={handleLocationModeChange}
            onManualLocationTextChange={setManualLocationText}
            onManualLocationSubmit={handleManualLocationSubmit}
            onMapLocationSelect={handleMapLocationSelect}
          />

          {(locationMode === LOCATION_MODES.CURRENT && geolocation === false && selectedCity !== "" && closestLocations.length === 0) ? (
            <div className="error-state error-state--large">
              {text.locationDisabled}
            </div>
          ) : null}

          {(locationMode === LOCATION_MODES.MANUAL && selectedCity !== "" && !manualLocation) ? (
            <div className="error-state">
              {text.enterPoint}
            </div>
          ) : null}

          <PharmacyGrid pharmacies={closestLocations} text={text} />
        </div>

        <div className="working-hours text-center">{text.workingHours}</div>

      </div>

    </div>
  );
};

export default App;
