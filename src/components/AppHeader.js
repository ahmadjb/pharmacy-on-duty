const AppHeader = ({ currentDay, currentDate, cities, selectedCity, onCityChange }) => (
  <div className="row app-header">
    <div className="col-md-3 col-12 text-center app-header__left">
      <div>{currentDay} / {currentDate}</div>
      <div className="app-header__select-wrapper">
        {cities.length > 0 && (
          <select className="city-select" value={selectedCity} onChange={(event) => onCityChange(event.target.value)}>
            <option value="">Bir şehir seçin</option>
            {cities.map((city) => (
              <option key={city.slug} value={city.slug}>{city.slug}</option>
            ))}
          </select>
        )}
      </div>
    </div>

    <div className="col-md-5 col-12 text-center">
      <div className="app-title">
        ANKARA ECZACI ODASI
        <br />
        NÖBETÇİ ECZANELER
      </div>
    </div>

    <div className="col-md-3 col-12 text-center app-header__right">
      Nöbetçi Eczanenin Konum Bilgisi için Karekodu Okutunuz
    </div>
  </div>
);

export default AppHeader;
