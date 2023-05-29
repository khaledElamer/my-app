import { Button } from 'primereact/button';
import React, { useRef, useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import './pharmacyComponent.css';

const PharmacyComponent = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [pharmacyName, setPharmacyName] = useState('');
  const [pharmacyAddress, setPharmacyAddress] = useState('');
  const [pharmacyPhone, setPharmacyPhone] = useState('');
  const [errors, setErrors] = useState({});

  const toast = useRef(null);

  useEffect(() => {
    axios
      .get('http://localhost:8090/pharmacies')
      .then((response) => setPharmacies(response.data))
      .catch((error) => console.error(error));
  }, []);

  const createPharmacy = () => {
    const pharmacy = {
      name: pharmacyName,
      address: pharmacyAddress,
      phone: pharmacyPhone,
    };

    const validationErrors = validatePharmacy(pharmacy);

    if (Object.keys(validationErrors).length === 0) {
      axios
        .post('http://localhost:8090/pharmacies', pharmacy)
        .then((response) => {
          setPharmacies([...pharmacies, response.data]);
          setDialogVisible(false);
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Pharmacy created.',
          });
        })
        .catch((error) => console.error(error));
    } else {
      setErrors(validationErrors);
    }
  };

  const updatePharmacy = () => {
    const updatedPharmacy = {
      ...selectedPharmacy,
      name: pharmacyName,
      address: pharmacyAddress,
      phone: pharmacyPhone,
    };

    const validationErrors = validatePharmacy(updatedPharmacy);

    if (Object.keys(validationErrors).length === 0) {
      axios
        .put(`http://localhost:8090/pharmacies/${selectedPharmacy.id}`, updatedPharmacy)
        .then(() => {
          setDialogVisible(false);
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Pharmacy updated.',
          });
          setPharmacies((prevPharmacies) =>
            prevPharmacies.map((pharmacy) =>
              pharmacy.id === selectedPharmacy.id ? updatedPharmacy : pharmacy
            )
          );
        })
        .catch((error) => console.error(error));
    } else {
      setErrors(validationErrors);
    }
  };

  const deletePharmacy = (pharmacyId) => {
    axios
      .delete(`http://localhost:8090/pharmacies/${pharmacyId}`)
      .then(() => {
        setPharmacies((prevPharmacies) =>
          prevPharmacies.filter((pharmacy) => pharmacy.id !== pharmacyId)
        );
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Pharmacy deleted.',
        });
      })
      .catch((error) => console.error(error));
  };

  const validatePharmacy = (pharmacy) => {
    const errors = {};

    if (!pharmacy.name) {
      errors.name = 'Pharmacy name is required.';
    }

    if (!pharmacy.address) {
      errors.address = 'Pharmacy address is required.';
    }

    if (!pharmacy.phone) {
      errors.phone = 'Pharmacy phone is required.';
    }

    return errors;
  };

  const openCreateDialog = () => {
    setSelectedPharmacy(null);
    setPharmacyName('');
    setPharmacyAddress('');
    setPharmacyPhone('');
    setErrors({});
    setDialogVisible(true);
  };

  const openEditDialog = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setPharmacyName(pharmacy.name);
    setPharmacyAddress(pharmacy.address);
    setPharmacyPhone(pharmacy.phone);
    setErrors({});
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  const pharmacyDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button
        label={selectedPharmacy ? 'Update' : 'Create'}
        icon="pi pi-check"
        onClick={selectedPharmacy ? updatePharmacy : createPharmacy}
      />
    </>
  );

  return (
    <div>
      <div className="card">
        <h1>Pharmacies</h1>
        <Button
          label="Create Pharmacy"
          icon="pi pi-plus"
          className="p-button p-button-success"
          onClick={openCreateDialog}
        />

        <DataTable value={pharmacies} className="p-datatable p-datatable-sm">
          <Column field="name" header="Name" sortable></Column>
          <Column field="address" header="Address" sortable></Column>
          <Column field="phone" header="Phone" sortable></Column>
          <Column
            body={(rowData) => (
              <div>
                <Button
                  icon="pi pi-pencil"
                  className="p-button p-button-rounded p-button-success p-mr-2"
                  onClick={() => openEditDialog(rowData)}
                />
                <Button
                  icon="pi pi-trash"
                  className="p-button p-button-rounded p-button-danger"
                  onClick={() => deletePharmacy(rowData.id)}
                />
              </div>
            )}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={dialogVisible}
        style={{ width: '450px' }}
        header={selectedPharmacy ? 'Edit Pharmacy' : 'Create Pharmacy'}
        onHide={hideDialog}
        footer={pharmacyDialogFooter}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="pharmacyName">Pharmacy Name</label>
            <InputText
              id="pharmacyName"
              value={pharmacyName}
              onChange={(e) => setPharmacyName(e.target.value)}
              className={errors.name ? 'p-invalid' : ''}
            />
            {errors.name && <small className="p-error">{errors.name}</small>}
          </div>
          <div className="p-field">
            <label htmlFor="pharmacyAddress">Pharmacy Address</label>
            <InputText
              id="pharmacyAddress"
              value={pharmacyAddress}
              onChange={(e) => setPharmacyAddress(e.target.value)}
              className={errors.address ? 'p-invalid' : ''}
            />
            {errors.address && <small className="p-error">{errors.address}</small>}
          </div>
          <div className="p-field">
            <label htmlFor="pharmacyPhone">Pharmacy Phone</label>
            <InputText
              id="pharmacyPhone"
              value={pharmacyPhone}
              onChange={(e) => setPharmacyPhone(e.target.value)}
              className={errors.phone ? 'p-invalid' : ''}
            />
            {errors.phone && <small className="p-error">{errors.phone}</small>}
          </div>
        </div>
      </Dialog>

      <Toast ref={toast} />
    </div>
  );
};

export default PharmacyComponent;
