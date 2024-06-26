import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';

const YourComponent = ({ latitude, longitude }) => {


  const [myLatitude, setMyLatitude] = useState(null);
  const [myLongitude, setMyLongitude] = useState(null);
  const [openedPharmacies, setOpenedPharmacies] = useState([]);
  const [closestLocations, setClosestLocations] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [geolocation, setGocation] = useState(false);


  const pharmacyName = "Yeni Filiz Eczanesi"; // Specify the name of the pharmacy you want to search for
  const encodedPharmacyName = encodeURIComponent(pharmacyName);
  const mapsUrl = `https://www.google.com/maps?q=${encodedPharmacyName}`;




  useEffect(() => {
    if (selectedCity) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('Location is enabled');
            setGocation(true);
          },
          (error) => {
            const openSettings = window.confirm('Konum etkin değil. Lütfen etkinleştirin.');
            if (openSettings) {
              window.location.href = 'app-settings:';
            }
          }
        );
      }
    }

    //fetchPharmacies();

  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://www.nosyapi.com/apiv2/service/pharmacies-on-duty/cities', {
          params: {
            'apiKey': 'nghLrrrA3KsrerJ0YaWCQb2VAfadnzQxUZllZNCUCY7nRhF2fnKPVEkDvKcr'
          }
        });
        setCities(response?.data?.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);



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
            'city': selectedCity
          }
        });
        setOpenedPharmacies(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedCity]);





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
      const distances = openedPharmacies.map((location, index) => {
        const earthRadius = 6371; // Earth's radius in km
        const dLat = (myLatitude - location.latitude) * Math.PI / 180;
        const dLon = (myLongitude - location.longitude) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(myLatitude * Math.PI / 180) * Math.cos(location.latitude * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;

        // Add the distance as a new key to the location object
        const locationWithDistance = { ...location, distance };

        // Log the distance for each location
        console.log(`Distance to ${openedPharmacies[index].pharmacyName}: ${distance} km`);

        return { location: locationWithDistance, distance };

      });

      const sortedDistances = distances.sort((a, b) => a.distance - b.distance);
      const closest5Locations = sortedDistances.slice(0, 12).map(item => item.location);
      setClosestLocations(closest5Locations);
    }
  }, [myLatitude, myLongitude, openedPharmacies]);

  //console.log(openedPharmacies);

  //console.log(closestLocations);
  // const numbers = Array.from({ length: 25 }, (_, index) => index + 1);
  //console.log(cities);


  const [pharmacies, setPharmacies] = useState([]);
  const [pharmacies2, setPharmacies2] = useState([]);

  useEffect(() => {
    const fetchPharmacies = async () => {

      const response = await axios.get('https://www.nosyapi.com/apiv2/service/pharmacies', {
        params: {
          'apiKey': 'nghLrrrA3KsrerJ0YaWCQb2VAfadnzQxUZllZNCUCY7nRhF2fnKPVEkDvKcr',
          'city': 'ankara'
        }
      });
      console.log("responsesssssssssss", response);
      setPharmacies2(response);
    };

    //fetchPharmacies();

  }, []); // Empty dependency array to run effect only once

  console.log('Pharmacies in ankara:', pharmacies2?.data?.data);
  console.log("---------------------------------------");
  // Log the pharmacies array

  return (
    <div>
      <div className='main-container'>
        <div className='row' style={{ width: '100%', backgroundColor: '', display: 'flex', justifyContent: 'space-between' }}>
          <div className='col-md-3 col-12 text-center' style={{ display: '', justifyContent: 'center', alignItems: 'center', paddingTop: 20 }}>
            <div>{currentDay} / {currentDate}</div>
            <div>
              <div style={{ paddingBottom: 7 }}>
                {cities.length > 0 && (
                  <select style={{ borderWidth: 4, borderColor: 'red' }} value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                    <option value="">Bir şehir seçin</option>
                    {cities.map((city, index) => (
                      <option key={index} value={city.slug}>{city.slug}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          <div className='col-md-5 col-12 text-center'>
            <div style={{ backgroundColor: '', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 25, fontWeight: 900, textAlign: 'center', lineHeight: '1.5' }}>ANKARA ECZACI ODASI
              NÖBETÇİ ECZANELER</div>

          </div>
          <div className='col-md-3 col-12 text-center' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Nöbetçi Eczanenin Konum
            Bilgisi için Karekodu Okutunuz</div>
        </div>

        <div className="container" style={{ border: '5px solid gray' }}>
          {selectedCity === "" ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 40, textAlign: 'center' }}>
              Lütfen bir şehir seçiniz
            </div>
          ):""}
          {(geolocation === false && selectedCity !== "" && closestLocations.length === 0) ?  (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 40, textAlign: 'center', color: 'red' }}>
              Konum etkin değil. Lütfen etkinleştirin.
            </div>
          ):""}

          <div className="row">
            {closestLocations.length > 0 && closestLocations?.map((number, index) => (
              <div key={index} className="col-md-3 col-sm-6" style={{ padding: 6, border: '2px solid gray' }}>
                <div style={{ border: 10, padding: 10, backgroundColor: 'white', borderRadius: 5, border: '' }}>
                  {/*{closestLocations[index]?.pharmacyName}*/}
                  {
                    closestLocations.length > 0 ? (
                      index === 11 ? (
                        <div style={{ fontSize: 16, fontWeight: 700, textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <QRCode value={`https://yakinnobetcieczane.onrender.com`} />
                          </div>
                          <div style={{ backgroundColor: '', fontSize: 15, textAlign: 'center', lineHeight: '1.5', paddingTop: 20 }}>
                            Bu QR'yi tarayarak bu sayfaya cihazınızdan ulaşabilirsiniz.
                          </div>
                        </div>
                      ) : index === closestLocations.length - 1 ? (
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
                          <div style={{ backgroundColor: '', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 22, fontWeight: 900, textAlign: 'center' }}>{closestLocations[index]?.pharmacyName}</div>
                          <div style={{ backgroundColor: '', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 15, textAlign: 'center', lineHeight: '1.5' }}>
                            {closestLocations[index]?.address}
                          </div>
                          <div style={{ backgroundColor: '', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 20, fontWeight: 500, color: 'red' }}>
                            {`${closestLocations[index]?.district} (${Math.round(closestLocations[index]?.distance)}-${Math.round(closestLocations[index]?.distance + 2)})km`}
                          </div>
                          <div style={{ backgroundColor: '', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 15, fontWeight: 400 }}>
                            TEL: <a href={`tel:${closestLocations[index]?.phone}`} className="linkStyle">{closestLocations[index]?.phone}</a>
                          </div>

                          <a href={`https://www.google.com/maps?q=${encodeURIComponent(`${closestLocations[index]?.pharmacyName}${closestLocations[index]?.address}`)}`} target="_blank" rel="noopener noreferrer">
                            <div style={{ backgroundColor: '' }}>
                              <QRCode value={`https://www.google.com/maps?q=${encodeURIComponent(`${closestLocations[index]?.pharmacyName}${closestLocations[index]?.address}`)}`} style={{ height: 60, width: 60, marginTop: -20 }} />
                            </div>
                          </a>

                        </>
                      )
                    )
                      : null}
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
