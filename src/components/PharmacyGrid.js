import PageQrCard from './PageQrCard';
import PharmacyCard from './PharmacyCard';

const PharmacyGrid = ({ pharmacies }) => (
  <div className="row">
    {pharmacies.map((pharmacy, index) => {
      const shouldShowPageQr = index === 11 || index === pharmacies.length - 1;

      return (
        <div key={`${pharmacy?.pharmacyName}-${pharmacy?.address}-${index}`} className="col-md-3 col-sm-6 pharmacy-grid__item">
          <div className="pharmacy-card">
            {shouldShowPageQr ? (
              <PageQrCard />
            ) : (
              <PharmacyCard pharmacy={pharmacy} />
            )}
          </div>
          {(index + 1) % 4 === 0 && <div className="w-100"></div>}
        </div>
      );
    })}
  </div>
);

export default PharmacyGrid;
