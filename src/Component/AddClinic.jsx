import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useHistory } from 'react-router-dom';
import ClinicComponent from './ClinicComponent'; // Import the ClinicComponent
import './AddClinic.css'; // Import the CSS file

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
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedGovernorate, setSelectedGovernorate] = useState(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [showClinicComponent, setShowClinicComponent] = useState(false); // State to control rendering of ClinicComponent
  const history = useHistory();

  const handleSearch = () => {
    // Perform search based on selectedCountry, selectedGovernorate, selectedSpecialist, and selectedClinic
    // Redirect to the add clinic page or perform necessary action
    history.push(`/clinic/${selectedCountry}/${selectedGovernorate}/${selectedSpecialist}/${selectedClinic}`);

    setShowClinicComponent(true); // Set showClinicComponent to true when search is clicked
  };

  // Render ClinicComponent if showClinicComponent is true
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
      </div>
      <Button label="Search" onClick={handleSearch} className="search-button" />
    </div>
  );
};

export default AddClinic;
    