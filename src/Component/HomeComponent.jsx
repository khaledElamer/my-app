import React, { useEffect, useState } from 'react';
import { OrderList } from 'primereact/orderlist';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import 'primeflex/primeflex.css';
import './HomeComponent.css'; // Import the CSS file

// Define the HomeComponent component
const HomeComponent = () => {
    // State variables
  const [clinics, setClinics] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [displayDialog, setDisplayDialog] = useState(false);

      // Fetch data from APIs when the component mounts
  useEffect(() => {
        // Fetch clinics
    fetch('http://localhost:8090/clinics')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setClinics(data);
        }
      })
      .catch(error => console.log(error));
          // Fetch hospitals
    fetch('http://localhost:8090/hospitals')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setHospitals(data);
        }
      })
      .catch(error => console.log(error));
            // Fetch pharmacies
    fetch('http://localhost:8090/pharmacies')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPharmacies(data);
        }
      })
      .catch(error => console.log(error));
  }, []);
    // Function to render individual items in the order list
  const itemTemplate = (item) => {
  return (
    <div className="item" onClick={() => {
      setSelectedItem(item);
      setDisplayDialog(true);
    }}>
      {item.name ? (
        <>
          <h4>{item.name}</h4>
          {item.clinicNumber && <p>Clinic Number: {item.clinicNumber}</p>}
          {item.location && item.location.city && (
            <p>Address: {`${item.location.city}, ${item.location.state}, ${item.location.country}`}</p>
          )}
          {item.specialization && <p>Specialization: {item.specialization}</p>}
          {item.phoneNumber && <p>Phone Number: {item.phoneNumber}</p>}
          {item.phone && <p>Phone: {item.phone}</p>}
          {item.location && <p>Location: {item.location}</p>}
          {item.address && <p>Address: {item.address}</p>}

        </>
      ) : item.hospitalName ? (
        <>
          <h4>{item.hospitalName}</h4>
          <p>Hospital Number: {item.hospitalNumber}</p>
          {item.location && item.location.city && (
            <p>Address: {`${item.location.city}, ${item.location.state}, ${item.location.country}`}</p>
          )}
          <p>Available Specialties: {item.availableSpecialties}</p>
          <p>Available Services: {item.availableServices}</p>
          <p>phone number: {item.phoneNumber}</p>
        </>
      ) : item.pharmacyName ? (
        <>
          <h4>{item.pharmacyName}</h4>
          {item.location && item.location.city && (
            <p>Address: {`${item.location.city}, ${item.location.state}, ${item.location.country}`}</p>
          )}
          {item.phone && <p>Phone: {item.phone}</p>}
          {item.location && <p>Location: {item.location}</p>}
        </>
      ) : null}
    </div>
  );
};
    // Function to handle filter input change
  const handleFilterChange = (event) => {
        // Update the filter text state
    const filterValue = event.target.value.toLowerCase();
    setFilterText(filterValue);
  };
    // Filter clinics based on the filter text
  const filteredClinics = clinics.filter(clinic =>
    clinic.name.toLowerCase().includes(filterText)
  );
      // Filter hospitals based on the filter text
  const filteredHospitals = hospitals.filter(hospital =>
    hospital.hospitalName.toLowerCase().includes(filterText)
  );
  // Filter pharmacies based on the filter text
  const filteredPharmacies = pharmacies.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(filterText)
  );

  // Function to render the clinics order list
  const renderClinics = () => {
        // Render the clinics order list if there are filtered clinics
    if (filteredClinics.length > 0) {
      return (
        <div className="orderlist-section">
          <h3>Clinics</h3>
          <OrderList
            value={filteredClinics}
            itemTemplate={itemTemplate}
          />
        </div>
      );
    }
    return null;
  };
    // Function to render the hospitals order list
  const renderHospitals = () => {
        // Render the hospitals order list if there are filtered hospitals
    if (filteredHospitals.length > 0) {
      return (
        <div className="orderlist-section">
          <h3>Hospitals</h3>
          <OrderList
            value={filteredHospitals}
            itemTemplate={itemTemplate}
          />
        </div>
      );
    }
    return null;
  };
  // Function to render the pharmacies order list
  const renderPharmacies = () => {
        // Render the pharmacies order list if there are filtered pharmacies
    if (filteredPharmacies.length > 0) {
      return (
        <div className="orderlist-section">
          <h3>Pharmacies</h3>
          <OrderList
            value={filteredPharmacies}
            itemTemplate={itemTemplate}
          />
        </div>
      );
    }
    return null;
  };
  // Function to handle hiding the dialog 
  const onHideDialog = () => {
        // Reset the selected item and dialog display
    setSelectedItem(null);
    setDisplayDialog(false);
  };
  // Function to render the details of the selected item in a dialog
  const renderSelectedItemDetails = () => {
        // Render the selected item details in a dialog if there is a selected item
    if (selectedItem) {
      return (
        <Dialog visible={displayDialog} onHide={onHideDialog}>
          {selectedItem.name ? (
            <>
              <h2>{selectedItem.name}</h2>
              {selectedItem.clinicNumber && <p>Clinic Number: {selectedItem.clinicNumber}</p>}
              <p>Address: {selectedItem && selectedItem.location ? `${selectedItem.location.city}, ${selectedItem.location.state}, ${selectedItem.location.country}` : ''}</p>
              {selectedItem.specialization && <p>Specialization: {selectedItem.specialization}</p>}
              {selectedItem.phoneNumber && <p>Phone Number: {selectedItem.phoneNumber}</p>}
              {selectedItem.address && <p>Address: {selectedItem.address}</p>}


            </>
          ) : selectedItem.hospitalName ? (
            <>
              <h2>{selectedItem.hospitalName}</h2>
              <p>Hospital Number: {selectedItem.hospitalNumber}</p>
              <p>Address: {selectedItem && selectedItem.location ? `${selectedItem.location.city}, ${selectedItem.location.state}, ${selectedItem.location.country}` : ''}</p>
              <p>Available Specialties: {selectedItem.availableSpecialties}</p>
              <p>phone number: {selectedItem.phoneNumber}</p>
              <p>Available Services: {selectedItem.availableServices}</p>


            </>
          ) : selectedItem.pharmacyName ? (
            <>
              <h2>{selectedItem.pharmacyName}</h2>
              {selectedItem.phone && <p>Phone: {selectedItem.phone}</p>}
              {selectedItem.location && <p>Location: {selectedItem.location}</p>}
              
            </>
          ) : null}
        </Dialog>
      );
    }
    return null;
  };
  // Render the HomeComponent JSX
  return (
    <div className="home-page-content">
      <h2 className="fade-in">Welcome to the Home Page</h2>
      <p className="slide-up">Explore the different sections using the menu items.</p>

      <div className="filter-input">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            placeholder="Search items"
            value={filterText}
            onChange={handleFilterChange}
          />
        </span>
      </div>

      {renderClinics()}
      {renderHospitals()}
      {renderPharmacies()}

      {renderSelectedItemDetails()}
    </div>
  );
};

export default HomeComponent;
