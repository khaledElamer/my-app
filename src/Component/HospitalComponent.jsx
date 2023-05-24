import { Button } from 'primereact/button';
import React, { useRef, useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import './HospitalComponent.css';

const HospitalComponent = () => {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [hospitalNumber, setHospitalNumber] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [availableSpecialties, setAvailableSpecialties] = useState('');
  const [errors, setErrors] = useState({});
  const toast = useRef(null);

  useEffect(() => {
    axios
      .get('http://localhost:8090/hospitals')
      .then((response) => setHospitals(response.data))
      .catch((error) => console.error(error));
  }, []);

  const createHospital = () => {
    const hospital = {
      hospitalNumber,
      hospitalName,
      hospitalAddress,
      availableSpecialties,
    };

    const validationErrors = validateHospital(hospital);

    if (Object.keys(validationErrors).length === 0) {
      axios
        .post('http://localhost:8090/hospitals', hospital)
        .then((response) => {
          setHospitals([...hospitals, response.data]);
          setDialogVisible(false);
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Hospital created.',
          });
        })
        .catch((error) => console.error(error));
    } else {
      setErrors(validationErrors);
    }
  };

  const updateHospital = () => {
    const updatedHospital = {
      ...selectedHospital,
      hospitalNumber,
      hospitalName,
      hospitalAddress,
      availableSpecialties,
    };

    const validationErrors = validateHospital(updatedHospital);

    if (Object.keys(validationErrors).length === 0) {
      axios
        .put(`http://localhost:8090/hospitals/${selectedHospital.id}`, updatedHospital)
        .then(() => {
          setDialogVisible(false);
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Hospital updated.',
          });
          setHospitals((prevHospitals) =>
            prevHospitals.map((hospital) => (hospital.id === selectedHospital.id ? updatedHospital : hospital))
          );
        })
        .catch((error) => console.error(error));
    } else {
      setErrors(validationErrors);
    }
  };

  const deleteHospital = (hospitalId) => {
    axios
      .delete(`http://localhost:8090/hospitals/${hospitalId}`)
      .then(() => {
        setHospitals((prevHospitals) => prevHospitals.filter((hospital) => hospital.id !== hospitalId));
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Hospital deleted.',
        });
      })
      .catch((error) => console.error(error));
  };

  const validateHospital = (hospital) => {
    const errors = {};

    if (!hospital.hospitalNumber) {
      errors.hospitalNumber = 'Hospital number is required.';
    }

    if (!hospital.hospitalName) {
      errors.hospitalName = 'Hospital name is required.';
    }

    if (!hospital.hospitalAddress) {
      errors.hospitalAddress = 'Hospital address is required.';
    }

    if (!hospital.availableSpecialties || hospital.availableSpecialties.length === 0) {
      errors.availableSpecialties = 'At least one specialty is required.';
    }

    return errors;
  };

  const openCreateDialog = () => {
    setSelectedHospital(null);
    setHospitalNumber('');
    setHospitalName('');
    setHospitalAddress('');
    setAvailableSpecialties('');
    setErrors({});
    setDialogVisible(true);
  };

  const openEditDialog = (hospital) => {
    setSelectedHospital(hospital);
    setHospitalNumber(hospital.hospitalNumber);
    setHospitalName(hospital.hospitalName);
    setHospitalAddress(hospital.hospitalAddress);
    setAvailableSpecialties(hospital.availableSpecialties);
    setErrors({});
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  const hospitalDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label={selectedHospital ? 'Update' : 'Create'} icon="pi pi-check" onClick={selectedHospital ? updateHospital : createHospital} />
    </>
  );

  return (
    <div>
      <div className="card">
        <h1>Hospitals</h1>
        <Button label="Create Hospital" icon="pi pi-plus" className="p-button-success" onClick={openCreateDialog} />

        <DataTable value={hospitals} className="p-datatable-sm">
          <Column field="hospitalNumber" header="Hospital Number" sortable></Column>
          <Column field="hospitalName" header="Name" sortable></Column>
          <Column field="hospitalAddress" header="Address" sortable></Column>
          <Column field="availableSpecialties" header="Specialties"></Column>
          <Column body={(rowData) => (
            <div>
              <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => openEditDialog(rowData)} />
              <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteHospital(rowData.id)} />
            </div>
          )}></Column>
        </DataTable>
      </div>

      <Dialog
        visible={dialogVisible}
        style={{ width: '450px' }}
        header={selectedHospital ? 'Edit Hospital' : 'Create Hospital'}
        onHide={hideDialog}
        footer={hospitalDialogFooter}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="hospitalNumber">Hospital Number</label>
            <InputText
              id="hospitalNumber"
              value={hospitalNumber}
              onChange={(e) => setHospitalNumber(e.target.value)}
              className={errors.hospitalNumber ? 'p-invalid' : ''}
            />
            {errors.hospitalNumber && (
              <small className="p-error">{errors.hospitalNumber}</small>
            )}
          </div>
          <div className="p-field">
            <label htmlFor="hospitalName">Hospital Name</label>
            <InputText
              id="hospitalName"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className={errors.hospitalName ? 'p-invalid' : ''}
            />
            {errors.hospitalName && <small className="p-error">{errors.hospitalName}</small>}
          </div>
          <div className="p-field">
            <label htmlFor="hospitalAddress">Hospital Address</label>
            <InputText
              id="hospitalAddress"
              value={hospitalAddress}
              onChange={(e) => setHospitalAddress(e.target.value)}
              className={errors.hospitalAddress ? 'p-invalid' : ''}
            />
            {errors.hospitalAddress && (
              <small className="p-error">{errors.hospitalAddress}</small>
            )}
          </div>
          <div className="p-field">
            <label htmlFor="availableSpecialties">Available Specialties</label>
            <InputText
              id="availableSpecialties"
              value={availableSpecialties}
              onChange={(e) => setAvailableSpecialties(e.target.value)}
              className={errors.availableSpecialties ? 'p-invalid' : ''}
            />
            {errors.availableSpecialties && (
              <small className="p-error">{errors.availableSpecialties}</small>
            )}
          </div>
        </div>
      </Dialog>

      <Toast ref={toast} />
    </div>
  );
};

export default HospitalComponent;