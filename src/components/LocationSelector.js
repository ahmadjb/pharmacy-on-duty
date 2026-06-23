const LocationSelector = ({
  locationMode,
  manualLocationText,
  manualLocation,
  manualLocationError,
  onModeChange,
  onManualLocationTextChange,
  onManualLocationSubmit,
}) => (
  <>
    <div className="location-mode-selector">
      <button
        type="button"
        className={`location-mode-button ${locationMode === 'current' ? 'location-mode-button--active' : ''}`}
        onClick={() => onModeChange('current')}
      >
        Benim konumum
      </button>
      <button
        type="button"
        className={`location-mode-button ${locationMode === 'manual' ? 'location-mode-button--active' : ''}`}
        onClick={() => onModeChange('manual')}
      >
        Nokta seç
      </button>
    </div>

    {locationMode === 'manual' ? (
      <div className="manual-location">
        <div className="manual-location__form">
          <input
            type="text"
            value={manualLocationText}
            onChange={(event) => onManualLocationTextChange(event.target.value)}
            placeholder="Google Maps linki veya koordinat giriniz"
            className="manual-location__input"
          />
          <button type="button" onClick={onManualLocationSubmit} className="manual-location__submit">
            Konumu kullan
          </button>
        </div>
        <div className="manual-location__hint">
          Örnek: Google Maps paylaşım linki ya da 39.9208, 32.8541
        </div>
        {manualLocation ? (
          <div className="manual-location__success">
            Seçilen nokta: {manualLocation.latitude}, {manualLocation.longitude}
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
