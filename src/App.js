import React, { useEffect, useState } from 'react';
import axios from 'axios';

import QRCode from 'qrcode.react';

import NumberBlock from './block';

const YourComponent = ({ latitude, longitude }) => {






  const [myLatitude, setMyLatitude] = useState(null);
  const [myLongitude, setMyLongitude] = useState(null);
  const [openedPharmacies, setOpenedPharmacies] = useState([]);
  const [closestLocations, setClosestLocations] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [currentDay, setCurrentDay] = useState('');

  const pharmacyName = "Yeni Filiz Eczanesi"; // Specify the name of the pharmacy you want to search for
  const encodedPharmacyName = encodeURIComponent(pharmacyName);
  const mapsUrl = `https://www.google.com/maps?q=${encodedPharmacyName}`;

  useEffect(() => {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    // Set the current date and day in the state
    setCurrentDate(today.toLocaleDateString('tr-TR', options));
    setCurrentDay(today.toLocaleDateString('tr-TR', { weekday: 'long' }));
  }, []); // Empty dependency array ensures the effect runs only once on component mount




  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://www.nosyapi.com/apiv2/service/pharmacies-on-duty', {
          params: {
            'apiKey': 'nghLrrrA3KsrerJ0YaWCQb2VAfadnzQxUZllZNCUCY7nRhF2fnKPVEkDvKcr',
            'city': 'ankara'
          }
        });
        setOpenedPharmacies(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);





  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMyLatitude(position.coords.latitude);
        setMyLongitude(position.coords.longitude);
      }, (error) => {
        console.error('Error getting geolocation:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);
  console.log(myLatitude, myLongitude);


  useEffect(() => {
    if (myLatitude !== null && myLongitude !== null && openedPharmacies.length > 0) {
      const distances = openedPharmacies.map(location => {
        const earthRadius = 6371; // Earth's radius in km
        const dLat = (myLatitude - location.latitude) * Math.PI / 180;
        const dLon = (myLongitude - location.longitude) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(myLatitude * Math.PI / 180) * Math.cos(location.latitude * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;
        return { location, distance };
      });

      const sortedDistances = distances.sort((a, b) => a.distance - b.distance);
      const closest5Locations = sortedDistances.slice(0, 12).map(item => item.location);
      setClosestLocations(closest5Locations);
    }
  }, [myLatitude, myLongitude, openedPharmacies]);

  console.log(openedPharmacies);

  console.log(closestLocations);
  // const numbers = Array.from({ length: 25 }, (_, index) => index + 1);

  return (
    <div>

      <div className='main-container'>
        <div className='row' style={{ width: '100%', backgroundColor: '', display: 'flex', justifyContent: 'space-between' }}>
          <div className='col-md-3 col-12 text-center' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {currentDay} / {currentDate}
          </div>

          <div className='col-md-5 col-12 text-center'>
            <div style={{ backgroundColor: '', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 25, fontWeight: 900, textAlign: 'center', lineHeight: '1.5' }}>ANKARA ECZACI ODASI
              NÖBETÇİ ECZANELER</div>

          </div>
          <div className='col-md-3 col-12 text-center' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Nöbetçi Eczanenin Konum
            Bilgisi için Karekodu Okutunuz</div>
        </div>

        <div className="container" style={{ border: '5px solid gray' }}>
          <div className="row">
            {closestLocations.length > 0 && closestLocations?.map((number, index) => (
              <div key={index} className="col-md-3 col-sm-6" style={{ padding: 6, border: '2px solid gray' }}>
                <div style={{ border: 10, padding: 10, backgroundColor: 'white', borderRadius: 5, border: '' }}>
                  {/*{closestLocations[index]?.pharmacyName}*/}
                  {index === 11 ? (
                    <div style={{ fontSize: 16, fontWeight: 700, textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <QRCode value={`https://yakinnobetcieczane.onrender.com`} />
                      </div>
                      <div style={{ backgroundColor: '', fontSize: 15, textAlign: 'center', lineHeight: '1.5', paddingTop: 20 }}>
                        Bu QR'yi tarayarak bu sayfaya cihazınızdan ulaşabilirsiniz.
                      </div>
                    </div>

                  ) : (
                    <>
                      <div style={{ backgroundColor: '', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 22, fontWeight: 900 }}>{closestLocations[index]?.pharmacyName}</div>
                      <div style={{ backgroundColor: '', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 15, textAlign: 'center', lineHeight: '1.5' }}>{closestLocations[index]?.address}</div>
                      <div style={{ backgroundColor: '', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 20, fontWeight: 500 }}>{closestLocations[index]?.district}</div>
                      <div style={{ backgroundColor: '', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 15, fontWeight: 500 }}>TEL: {closestLocations[index]?.phone}</div>

                      <a href={`https://www.google.com/maps?q=${encodeURIComponent(`${closestLocations[index]?.pharmacyName}`)}`} target="_blank" rel="noopener noreferrer">
                        <div style={{ backgroundColor: '' }}>
                          <QRCode value={`https://www.google.com/maps?q=${encodeURIComponent(`${closestLocations[index]?.pharmacyName}`)}`} style={{ height: 60, width: 60, marginTop: -20 }} />
                        </div>
                      </a>

                    </>
                  )}
                </div>

                {(index + 1) % 4 === 0 && <div className="w-100"></div>} {/* Add a new row after every 4 items */}
              </div>
            ))}


          </div>
        </div>

        <div className=' text-center' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Eczanelerimiz, hafta içi 08.30-19.00, Cumartesi 09.30-19.00 arası çalışır. Nöbetçi eczaneler ertesi gün açılış saatine kadar
          hizmet verir, Pazar ve tatil günlerinde ise 09.30’da açılır, ertesi güne kadar hizmet verir.</div>

      </div>


      {/* <div>
        <p>Google Maps URL: {mapsUrl}</p>
        <QRCode value={mapsUrl} />
      </div>*/}
    </div>
  );
};

export default YourComponent;
