import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { useHistory } from 'react-router-dom';
import ClinicComponent from './ClinicComponent';
import './AddClinic.css';

// Define the available countries, governorates, specialists, and clinics
const countries = [
  { name: 'Country 1', code: 'C1' },
  { name: 'Country 2', code: '2' },
  // Add more countries as needed
];

const governorates = [
  { name: 'Governorate 1', code: 'G1' },
  { name: 'Governorate 2', code: 'G2' },
  // Add more governorates as needed
];

const specialists = [
  { name: 'Specialist 1', code: 'S1' },
  { name: 'Specialist 2', code: 'S2' },
  // Add more specialists as needed
];

const clinics = [
  { name: 'Clinic 1', code: 'P1' },
  { name: 'Clinic 2', code: 'P2' },
  // Add more clinics as needed
];

const AddClinic = () => {
  // State variables to store the selected values and toggle the clinic component
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedGovernorate, setSelectedGovernorate] = useState(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [hasInsurance, setHasInsurance] = useState(false);
  const [showClinicComponent, setShowClinicComponent] = useState(false);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const handleSearch = () => {
    // Check if all fields are filled before searching
    if (!selectedCountry || !selectedGovernorate || !selectedSpecialist || !selectedClinic) {
      alert('Please fill in all the fields before searching.'); // Display alert using the native alert function
      return;
    }

    setLoading(true);

    // Perform search based on selectedCountry, selectedGovernorate, selectedSpecialist, selectedClinic, and hasInsurance
    // Redirect to the clinic page or perform necessary action

    setTimeout(() => {
      setLoading(false);
      setShowClinicComponent(true);
    }, 2000);
  };

  // Render the clinic component if showClinicComponent is true
  if (showClinicComponent) {
    return <ClinicComponent />;
  }

  return (
    <div className="add-clinic-container">
      <h1>Select Country, Governorate, Specialist, and Clinic</h1>
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
          <h3>Specialist</h3>
          <Dropdown
            value={selectedSpecialist}
            options={specialists}
            optionLabel="name"
            placeholder="Select a specialist"
            onChange={(e) => setSelectedSpecialist(e.value)}
          />
        </div>
        <div className="form-group">
          <h3>Clinic</h3>
          <Dropdown
            value={selectedClinic}
            options={clinics}
            optionLabel="name"
            placeholder="Select a clinic"
            onChange={(e) => setSelectedClinic(e.value)}
          />
        </div>
        <div className="form-group">
          <h3>Do you have medical insurance?</h3>
          <Checkbox checked={hasInsurance} onChange={(e) => setHasInsurance(e.checked)} />
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

export default AddClinic;
