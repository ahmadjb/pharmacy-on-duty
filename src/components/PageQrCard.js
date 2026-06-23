import QRCode from 'qrcode.react';

const APP_URL = 'https://yakinnobetcieczane.onrender.com';

const PageQrCard = ({ text }) => (
  <div className="page-qr-card">
    <div className="qr-wrapper">
      <QRCode value={APP_URL} />
    </div>
    <div className="page-qr-card__text">
      {text.pageQrText}
    </div>
  </div>
);

export default PageQrCard;
