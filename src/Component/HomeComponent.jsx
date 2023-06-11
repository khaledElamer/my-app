import React, { useEffect, useState } from 'react';
import { OrderList } from 'primereact/orderlist';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import 'primeflex/primeflex.css';
import './HomeComponent.css'; // Import the CSS file

const HomeComponent = () => {
  const [clinics, setClinics] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [displayDialog, setDisplayDialog] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8090/clinics')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setClinics(data);
        }
      })
      .catch(error => console.log(error));

    fetch('http://localhost:8090/hospitals')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setHospitals(data);
        }
      })
      .catch(error => console.log(error));

    fetch('http://localhost:8090/pharmacies')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPharmacies(data);
        }
      })
      .catch(error => console.log(error));
  }, []);

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
  const handleFilterChange = (event) => {
    const filterValue = event.target.value.toLowerCase();
    setFilterText(filterValue);
  };

  const filteredClinics = clinics.filter(clinic =>
    clinic.name.toLowerCase().includes(filterText)
  );

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.hospitalName.toLowerCase().includes(filterText)
  );

  const filteredPharmacies = pharmacies.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(filterText)
  );

  const renderClinics = () => {
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

  const renderHospitals = () => {
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

  const renderPharmacies = () => {
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

  const onHideDialog = () => {
    setSelectedItem(null);
    setDisplayDialog(false);
  };

  const renderSelectedItemDetails = () => {
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
