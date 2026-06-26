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
          {text.shareLocation}
        </button>
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
