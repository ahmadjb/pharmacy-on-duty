import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER = {
  latitude: 39.9208,
  longitude: 32.8541,
};

const MapPicker = ({ selectedLocation, currentLocation, onLocationSelect }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const onLocationSelectRef = useRef(onLocationSelect);
  const center = selectedLocation || currentLocation || DEFAULT_CENTER;
  const initialCenterRef = useRef(center);

  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return undefined;
    }

    const initialCenter = initialCenterRef.current;
    const map = L.map(mapContainerRef.current).setView([initialCenter.latitude, initialCenter.longitude], 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    map.on('click', (event) => {
      onLocationSelectRef.current({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    });

    setTimeout(() => map.invalidateSize(), 0);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    mapRef.current.invalidateSize();

    if (!selectedLocation) {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      return;
    }

    const point = [selectedLocation.latitude, selectedLocation.longitude];
    mapRef.current.setView(point, 15);

    if (!markerRef.current) {
      markerRef.current = L.circleMarker(point, {
        radius: 8,
        color: 'red',
        fillColor: 'red',
        fillOpacity: 0.8,
      }).addTo(mapRef.current);
    } else {
      markerRef.current.setLatLng(point);
    }
  }, [selectedLocation]);

  return (
    <div className="map-picker">
      <div className="map-picker__map" ref={mapContainerRef} />
      <div className="map-picker__hint">Haritadan bir nokta seçmek için haritaya tıklayın.</div>
    </div>
  );
};

export default MapPicker;
