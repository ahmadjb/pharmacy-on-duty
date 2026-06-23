import MapPicker from './MapPicker';

const LocationSelector = ({
  locationMode,
  manualLocationText,
  manualLocation,
  manualLocationError,
  currentLocation,
  text,
  onModeChange,
  onManualLocationTextChange,
  onManualLocationSubmit,
  onMapLocationSelect,
}) => (
  <>
    <div className="location-mode-selector">
      <button
        type="button"
        className={`location-mode-button ${locationMode === 'current' ? 'location-mode-button--active' : ''}`}
        onClick={() => onModeChange('current')}
      >
        {text.myLocation}
      </button>
      <button
        type="button"
        className={`location-mode-button ${locationMode === 'manual' ? 'location-mode-button--active' : ''}`}
        onClick={() => onModeChange('manual')}
      >
        {text.choosePoint}
      </button>
    </div>

    {locationMode === 'manual' ? (
      <div className="manual-location">
        <div className="manual-location__form">
          <input
            type="text"
            value={manualLocationText}
            onChange={(event) => onManualLocationTextChange(event.target.value)}
            placeholder={text.manualLocationPlaceholder}
            className="manual-location__input"
          />
          <button type="button" onClick={onManualLocationSubmit} className="manual-location__submit">
            {text.useLocation}
          </button>
        </div>
        <div className="manual-location__hint">
          {text.manualLocationHint}
        </div>
        <MapPicker
          selectedLocation={manualLocation}
          currentLocation={currentLocation}
          text={text}
          onLocationSelect={onMapLocationSelect}
        />
        {manualLocation ? (
          <div className="manual-location__success">
            {text.selectedPoint}: {manualLocation.latitude}, {manualLocation.longitude}
          </div>
        ) : null}
        {manualLocationError ? (
          <div className="manual-location__error">
            {manualLocationError}
          </div>
        ) : null}
      </div>
    ) : null}
  </>
);

export default LocationSelector;
