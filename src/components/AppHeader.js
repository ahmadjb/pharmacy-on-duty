const AppHeader = ({
  currentDay,
  currentDate,
  cities,
  selectedCity,
  text,
  onCityChange,
}) => (
  <div className="row app-header">
    <div className="col-md-3 col-12 text-center app-header__left">
      <div>{currentDay} / {currentDate}</div>
      <div className="app-header__select-wrapper">
        {cities.length > 0 && (
          <select className="city-select" value={selectedCity} onChange={(event) => onCityChange(event.target.value)}>
            <option value="">{text.cityPlaceholder}</option>
            {cities.map((city) => (
              <option key={city.slug} value={city.slug}>{city.slug}</option>
            ))}
          </select>
        )}
      </div>
    </div>

    <div className="col-md-5 col-12 text-center">
      <div className="app-title">
        {text.titleLine1}
        <br />
        {text.titleLine2}
      </div>
    </div>

    <div className="col-md-3 col-12 text-center app-header__right">
      {text.qrInfo}
    </div>
  </div>
);

export default AppHeader;
