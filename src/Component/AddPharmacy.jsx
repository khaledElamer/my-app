import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useHistory } from 'react-router-dom';
import { Checkbox } from 'primereact/checkbox';
import PharmacyComponent from './PharmacyComponent';

const countries = [
  { name: 'Country 1', code: 'C1' },
  { name: 'Country 2', code: 'C2' },
  // Add more countries as needed
];

const governorates = [
  { name: 'Governorate 1', code: 'G1' },
  { name: 'Governorate 2', code: 'G2' },
  // Add more governorates as needed
];

const pharmacies = [
  { name: 'Pharmacy 1', code: 'P1' },
  { name: 'Pharmacy 2', code: 'P2' },
  // Add more pharmacies as needed
];

const AddPharmacy = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedGovernorate, setSelectedGovernorate] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [showPharmacyComponent, setShowPharmacyComponent] = useState(false); // State to control rendering of HospitalComponent
  const [loading, setLoading] = useState(false); // State to control loading state
  const history = useHistory();
  const [hasInsurance, setHasInsurance] = useState(false); // State to control checkbox for medical insurance
  const [locationChecked, setLocationChecked] = useState(false); // State to control checkbox for location

  const handleSearch = () => {
    if (!selectedCountry || !selectedGovernorate || !selectedPharmacy) {
      alert('Please select all options before searching.'); // Update the alert message
      return;
    }

    setLoading(true); // Set loading state to true when search is clicked

    // Redirect to the add Pharmacy page or perform necessary action

    setTimeout(() => {
      setLoading(false); // Set loading state to false when search is complete
      setShowPharmacyComponent(true); // Set showPharmacyComponent to true when search is clicked
    }, 2000);
  };

  // Render showPharmacyComponent if showPharmacyComponent is true
  if (showPharmacyComponent) {
    return <PharmacyComponent />;
  }

  return (
    <div className="add-hospital-container">
      <h1>Select Country, Governorate, and Pharmacy</h1>
      <div className="form-container">
        <div className="form-group">
          <h3>Country</h3>
          <Dropdown
            value={selectedCountry}
            options={countries}
            optionLabel="name"
            placeholder="Select a country"
            onChange={(e) => setSelectedCountry(e.value)}
          />
        </div>
        <div className="form-group">
          <h3>Governorate</h3>
          <Dropdown
            value={selectedGovernorate}
            options={governorates}
            optionLabel="name"
            placeholder="Select a governorate"
            onChange={(e) => setSelectedGovernorate(e.value)}
          />
        </div>
        <div className="form-group">
          <h3>Pharmacy</h3>
          <Dropdown
            value={selectedPharmacy}
            options={pharmacies}
            optionLabel="name"
            placeholder="Select a pharmacy"
            onChange={(e) => setSelectedPharmacy(e.value)}
          />
        </div>
        <div className="form-group">
          <h3>Do you have medical insurance?</h3>
          <Checkbox checked={hasInsurance} onChange={(e) => setHasInsurance(e.checked)} />
        </div>
        <div className="form-group">
          <h3>Location</h3>
          <Checkbox checked={locationChecked} onChange={(e) => setLocationChecked(e.checked)} />
        </div>
      </div>
      <Button
        label={loading ? 'Loading...' : 'Search'}
        onClick={handleSearch}
        className="search-button"
        disabled={loading}
      />
    </div>
  );
};

export default AddPharmacy;
