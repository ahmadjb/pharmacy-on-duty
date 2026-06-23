import QRCode from 'qrcode.react';

const APP_URL = 'https://yakinnobetcieczane.onrender.com';

const PageQrCard = () => (
  <div className="page-qr-card">
    <div className="qr-wrapper">
      <QRCode value={APP_URL} />
    </div>
    <div className="page-qr-card__text">
      Bu QR'yi tarayarak bu sayfaya cihazınızdan ulaşabilirsiniz.
    </div>
  </div>
);

export default PageQrCard;
