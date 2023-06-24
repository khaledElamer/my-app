import React, { useRef, useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import './clinicComponent.css';

const ClinicComponent = () => {
  // Component state variables
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [clinicNumber, setClinicNumber] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [schedule, setSchedule] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [clinicServices, setClinicServices] = useState('');
  const [errors, setErrors] = useState({});
  const toast = useRef(null);

  // Fetch clinics data from the server
  useEffect(() => {
    axios
      .get('http://localhost:8090/clinics')
      .then((response) => setClinics(response.data))
      .catch((error) => console.error(error));
  }, []);

  // Create a new clinic
  const createClinic = () => {
    // Clinic object
    const clinic = {
      clinicNumber,
      name,
      address,
      specialization,
      schedule,
      phoneNumber
    };

    // Validate clinic
    const validationErrors = validateClinic(clinic);

    if (Object.keys(validationErrors).length === 0) {
      // Send POST request to the server to create a new clinic
      axios
        .post('http://localhost:8090/clinics', clinic)
        .then((response) => {
          setClinics([...clinics, response.data]);
          setDialogVisible(false);
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Clinic created.',
          });
        })
        .catch((error) => console.error(error));
    } else {
      setErrors(validationErrors);
    }
  };

  // Update an existing clinic
  const updateClinic = () => {
    // Updated clinic object
    const updatedClinic = {
      ...selectedClinic,
      clinicNumber,
      name,
      address,
      specialization,
      schedule,
      phoneNumber
    };

    // Validate updated clinic
    const validationErrors = validateClinic(updatedClinic);

    if (Object.keys(validationErrors).length === 0) {
      // Send PUT request to the server to update the clinic
      axios
        .put(`http://localhost:8090/clinics/${selectedClinic.id}`, updatedClinic)
        .then(() => {
          setDialogVisible(false);
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Clinic updated.',
          });
          setClinics((prevClinics) =>
            prevClinics.map((clinic) => (clinic.id === selectedClinic.id ? updatedClinic : clinic))
          );
        })
        .catch((error) => console.error(error));
    } else {
      setErrors(validationErrors);
    }
  };

  // Delete a clinic
  const deleteClinic = (clinicId) => {
    // Send DELETE request to the server to delete the clinic
    axios
      .delete(`http://localhost:8090/clinics/${clinicId}`)
      .then(() => {
        setClinics((prevClinics) => prevClinics.filter((clinic) => clinic.id !== clinicId));
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Clinic deleted.',
        });
      })
      .catch((error) => console.error(error));
  };

  // Validate clinic data
  const validateClinic = (clinic) => {
    const errors = {};

    if (!clinic.clinicNumber) {
      errors.clinicNumber = 'Clinic number is required.';
    }

    if (!clinic.name) {
      errors.name = 'Clinic name is required.';
    }

    if (!clinic.address) {
      errors.address = 'Clinic address is required.';
    }

    if (!clinic.specialization || clinic.specialization.length === 0) {
      errors.specialization = 'At least one specialization is required.';
    }

    if (!clinic.schedule) {
      errors.schedule = 'Schedule is required.';
    }

    if (!clinic.phoneNumber) {
      errors.phoneNumber = 'Phone number is required.';
    }

    return errors;
  };

  // Open the dialog for creating a new clinic
  const openCreateDialog = () => {
    setSelectedClinic(null);
    setClinicNumber('');
    setName('');
    setAddress('');
    setSpecialization('');
    setSchedule('');
    setPhoneNumber('');
    setErrors({});
    setDialogVisible(true);
  };

  // Open the dialog for editing an existing clinic
  const openEditDialog = (clinic) => {
    setSelectedClinic(clinic);
    setClinicNumber(clinic.clinicNumber);
    setName(clinic.name);
    setAddress(clinic.address);
    setSpecialization(clinic.specialization);
    setSchedule(clinic.schedule);
    setPhoneNumber(clinic.phoneNumber);
    setErrors({});
    setDialogVisible(true);
  };

  // Hide the dialog
  const hideDialog = () => {
    setDialogVisible(false);
  };

  // Dialog footer JSX
  const clinicDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label={selectedClinic ? 'Update' : 'Create'} icon="pi pi-check" onClick={selectedClinic ? updateClinic : createClinic} />
    </>
  );

  // Render the component
  return (
    <div>
      <div className="card">
        <h1>Clinics</h1>
        <Button label="Create Clinic" icon="pi pi-plus" className="p-button-success" onClick={openCreateDialog} />

        <DataTable value={clinics} className="p-datatable-sm">
          <Column field="id" header="ID" sortable></Column>
          <Column field="clinicNumber" header="Clinic Number" sortable></Column>
          <Column field="name" header="Name" sortable></Column>
          <Column field="address" header="Address" sortable></Column>
          <Column field="specialization" header="Specialization"></Column>
          <Column field="schedule" header="Schedule"></Column>
          <Column field="phoneNumber" header="Phone Number"></Column>
          <Column
            body={(rowData) => (
              <div>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => openEditDialog(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteClinic(rowData.id)} />
              </div>
            )}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={dialogVisible}
        style={{ width: '450px' }}
        header={selectedClinic ? 'Edit Clinic' : 'Create Clinic'}
        onHide={hideDialog}
        footer={clinicDialogFooter}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="clinicNumber">Clinic Number</label>
            <InputText
              id="clinicNumber"
              value={clinicNumber}
              onChange={(e) => setClinicNumber(e.target.value)}
              className={errors.clinicNumber ? 'p-invalid' : ''}
            />
            {errors.clinicNumber && (
              <small className="p-error">{errors.clinicNumber}</small>
            )}
          </div>
          <div className="p-field">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? 'p-invalid' : ''}
            />
            {errors.name && <small className="p-error">{errors.name}</small>}
          </div>
          <div className="p-field">
            <label htmlFor="address">Address</label>
            <InputText
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={errors.address ? 'p-invalid' : ''}
            />
            {errors.address && (
              <small className="p-error">{errors.address}</small>
            )}
          </div>
          <div className="p-field">
            <label htmlFor="specialization">Specialization</label>
            <InputText
              id="specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className={errors.specialization ? 'p-invalid' : ''}
            />
            {errors.specialization && (
              <small className="p-error">{errors.specialization}</small>
            )}
          </div>
          <div className="p-field">
            <label htmlFor="schedule">Schedule</label>
            <InputText
              id="schedule"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className={errors.schedule ? 'p-invalid' : ''}
            />
            {errors.schedule && (
              <small className="p-error">{errors.schedule}</small>
            )}
          </div>
          <div className="p-field">
            <label htmlFor="phoneNumber">Phone Number</label>
            <InputText
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={errors.phoneNumber ? 'p-invalid' : ''}
            />
            {errors.phoneNumber && (
              <small className="p-error">{errors.phoneNumber}</small>
            )}
          </div>
        </div>
      </Dialog>

      <Toast ref={toast} />
    </div>
  );
};

export default ClinicComponent;
