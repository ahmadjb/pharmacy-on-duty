import { useState } from 'react';
import QRCode from 'qrcode.react';
import { getPharmacyMapUrl } from '../utils/maps';

const PharmacyCard = ({ pharmacy, text }) => {
  const [shareStatus, setShareStatus] = useState('');
  const mapUrl = getPharmacyMapUrl(pharmacy);
  const shareText = `${pharmacy?.pharmacyName || ''}\n${pharmacy?.address || ''}\n${mapUrl}`.trim();

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: pharmacy?.pharmacyName || text.shareLocation,
          text: shareText,
          url: mapUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setShareStatus('copied');
        setTimeout(() => setShareStatus(''), 2000);
      }
    } catch (error) {
      if (error?.name !== 'AbortError') {
        console.error('Error sharing pharmacy location:', error);
      }
    }
  };

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
        {text.phone}: <a href={`tel:${pharmacy?.phone}`} className="linkStyle">{pharmacy?.phone}</a>
      </div>
      <div className="pharmacy-card__share">
        <button type="button" className="pharmacy-card__share-button" onClick={handleShare}>
          <svg className="pharmacy-card__share-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M18 16.1c-.8 0-1.5.3-2 .8L8.9 12.8c.1-.3.1-.5.1-.8s0-.5-.1-.8L16 7.1c.6.5 1.2.8 2 .8 1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3c0 .3 0 .5.1.8L8 9.8C7.4 9.3 6.8 9 6 9c-1.7 0-3 1.3-3 3s1.3 3 3 3c.8 0 1.4-.3 2-.8l7.1 4.2c-.1.2-.1.5-.1.7 0 1.6 1.3 2.9 3 2.9s3-1.3 3-3-1.3-2.9-3-2.9z" />
          </svg>
          {text.shareLocation}
        </button>
        <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="pharmacy-card__map-button">
          {text.openInMaps}
        </a>
        {shareStatus === 'copied' ? (
          <span className="pharmacy-card__share-status">{text.linkCopied}</span>
        ) : null}
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
