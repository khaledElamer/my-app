import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const LocationComponent = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [clinics, setClinics] = useState([
    { name: 'Clinic A', latitude: 30.0444, longitude: 31.2357 },
    { name: 'Clinic B', latitude: 31.2001, longitude: 29.9187 },
    // Add more clinic data here...
  ]);

  const [hospitals, setHospitals] = useState([
    { name: 'Hospital A', latitude: 30.0499, longitude: 31.2236 },
    { name: 'Hospital B', latitude: 31.2156, longitude: 29.9457 },
    // Add more hospital data here...
  ]);

  const [pharmacies, setPharmacies] = useState([
    { name: 'Pharmacy A', latitude: 30.0561, longitude: 31.2394 },
    { name: 'Pharmacy B', latitude: 31.2151, longitude: 29.9553 },
    // Add more pharmacy data here...
  ]);

  const locations = {
    Clinics: clinics,
    Hospitals: hospitals,
    Pharmacies: pharmacies,
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.value);
    setSelectedLocation(null); // Reset selected location when type changes
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    const clickedLocation = locations[selectedType].find(
      (location) =>
        Math.abs(location.latitude - lat) < 0.0001 && Math.abs(location.longitude - lng) < 0.0001
    );

    if (clickedLocation) {
      setSelectedLocation(clickedLocation);
    } else {
      const customLocation = {
        name: `Custom Location ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        latitude: lat,
        longitude: lng,
      };
      setSelectedLocation(customLocation);
    }
  };

  const SelectedMarker = () => {
    if (selectedLocation) {
      return (
        <Marker
          position={[selectedLocation.latitude, selectedLocation.longitude]}
          title={selectedLocation.name}
          icon={
            L.icon({
              iconUrl:
                selectedType === 'Pharmacies'
                  ? 'path/to/pharmacy-icon.png'
                  : 'path/to/hospital-icon.png',
              iconSize: [32, 32],
            })
          }
        />
      );
    }
    return null;
  };

  const LocationSelector = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  };

  return (
    <div className="location-container">
      <div className="location-header">
        <h2>Find Nearby Clinics, Hospitals, and Pharmacies</h2>
        <Dropdown
          value={selectedType}
          options={Object.keys(locations)}
          onChange={handleTypeChange}
          placeholder="Select a location type"
        />
      </div>

      <div className="location-map">
        <MapContainer center={[30.0444, 31.2357]} zoom={13} style={{ width: '100%', height: '500px' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="Map data © OpenStreetMap contributors"
          />
          {selectedType &&
            locations[selectedType].map((location) => (
              <Marker
                key={location.name}
                position={[location.latitude, location.longitude]}
                title={location.name}
                icon={
                  L.icon({
                    iconUrl:
                      selectedType === 'Pharmacies'
                        ? 'path/to/pharmacy-icon.png'
                        : 'path/to/hospital-icon.png',
                    iconSize: [32, 32],
                  })
                }
              />
            ))}
          <SelectedMarker />
          <LocationSelector />
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationComponent;
