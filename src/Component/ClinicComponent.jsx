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
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [clinicNumber, setClinicNumber] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [schedule, setSchedule] = useState('');

  const [clinicServices, setClinicServices] = useState('');
  const [errors, setErrors] = useState({});
  const toast = useRef(null);

  useEffect(() => {
    axios
      .get('http://localhost:8090/clinics')
      .then((response) => setClinics(response.data))
      .catch((error) => console.error(error));
  }, []);

  const createClinic = () => {
    const clinic = {
      clinicNumber,
      name,
      address,
      specialization,
      schedule,
    };

    const validationErrors = validateClinic(clinic);

    if (Object.keys(validationErrors).length === 0) {
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

  const updateClinic = () => {
    const updatedClinic = {
      ...selectedClinic,
      clinicNumber,
      name,
      address,
      specialization,
      schedule,
    };

    const validationErrors = validateClinic(updatedClinic);

    if (Object.keys(validationErrors).length === 0) {
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

  const deleteClinic = (clinicId) => {
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

    return errors;
  };

  const openCreateDialog = () => {
    setSelectedClinic(null);
    setClinicNumber('');
    setName('');
    setAddress('');
    setSpecialization('');
    setSchedule('');
    setErrors({});
    setDialogVisible(true);
  };

  const openEditDialog = (clinic) => {
    setSelectedClinic(clinic);
    setClinicNumber(clinic.clinicNumber);
    setName(clinic.name);
    setAddress(clinic.address);
    setSpecialization(clinic.specialization);
    setSchedule(clinic.schedule);
    setErrors({});
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  const clinicDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label={selectedClinic ? 'Update' : 'Create'} icon="pi pi-check" onClick={selectedClinic ? updateClinic : createClinic} />
    </>
  );

  return (
    <div>
      <div className="card">
        <h1>Clinics</h1>
        <Button label="Create Clinic" icon="pi pi-plus" className="p-button-success" onClick={openCreateDialog} />

        <DataTable value={clinics} className="p-datatable-sm">
          <Column field="clinicNumber" header="Clinic Number" sortable></Column>
          <Column field="name" header="Name" sortable></Column>
          <Column field="address" header="Address" sortable></Column>
          <Column field="specialization" header="Specialization"></Column>
          <Column field="schedule" header="Schedule"></Column>

          <Column body={(rowData) => (
            <div>
              <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => openEditDialog(rowData)} />
              <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteClinic(rowData.id)} />
            </div>
          )}></Column>
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
        </div>
      </Dialog>

      <Toast ref={toast} />
    </div>
  );
};

export default ClinicComponent;
