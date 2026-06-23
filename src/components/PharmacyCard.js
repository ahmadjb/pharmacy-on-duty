import QRCode from 'qrcode.react';
import { getPharmacyMapUrl } from '../utils/maps';

const PharmacyCard = ({ pharmacy }) => {
  const mapUrl = getPharmacyMapUrl(pharmacy);

  return (
    <>
      <div className="pharmacy-card__name">{pharmacy?.pharmacyName}</div>
      <div className="pharmacy-card__address">
        {pharmacy?.address}
      </div>
      <div className="pharmacy-card__district">
        {`${pharmacy?.district} (${Math.round(pharmacy?.distance)}-${Math.round(pharmacy?.distance + 2)})km`}
      </div>
      <div className="pharmacy-card__phone">
        TEL: <a href={`tel:${pharmacy?.phone}`} className="linkStyle">{pharmacy?.phone}</a>
      </div>

      <a href={mapUrl} target="_blank" rel="noopener noreferrer">
        <div>
          <QRCode value={mapUrl} className="pharmacy-card__qr" />
        </div>
      </a>
    </>
  );
};

export default PharmacyCard;
