import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useHistory } from 'react-router-dom';
import './AddHospital.css'; // Import the CSS file
import HospitalComponent from './HospitalComponent';

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

const hospitals = [
{ name: 'Hospital 1', code: 'H1' },
{ name: 'Hospital 2', code: 'H2' },
// Add more hospitals as needed
];

const AddHospital = () => {
const [selectedCountry, setSelectedCountry] = useState(null);
const [selectedGovernorate, setSelectedGovernorate] = useState(null);
const [selectedSpecialist, setSelectedSpecialist] = useState(null);
const [selectedHospital, setSelectedHospital] = useState(null);
const [showHospitalComponent, setShowHospitalComponent] = useState(false); // State to control rendering of HospitalComponent
const history = useHistory();

const handleSearch = () => {
// Perform search based on selectedCountry, selectedGovernorate, selectedSpecialist, and selectedHospital
// Redirect to the add hospital page or perform necessary action

setShowHospitalComponent(true); // Set showHospitalComponent to true when search is clicked
};

// Render HospitalComponent if showHospitalComponent is true
if (showHospitalComponent) {
return <HospitalComponent/>;
}

return (
<div className="add-hospital-container">
<h1>Select Country, Governorate, Specialist, and Hospital</h1>
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
<h3>Hospital</h3>
<Dropdown
value={selectedHospital}
options={hospitals}
optionLabel="name"
placeholder="Select a hospital"
onChange={(e) => setSelectedHospital(e.value)}
/>
</div>
</div>
<Button label="Search" onClick={handleSearch} className="search-button" />
</div>
);
};

export default AddHospital;