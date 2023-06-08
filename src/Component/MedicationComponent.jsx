import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import './MedicationComponent.css';


const MedicationComponent = () => {
  const [medications, setMedications] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [newMedication, setNewMedication] = useState(false);
  const [medication, setMedication] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8090/medications');
      const data = await response.json();
      setMedications(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const saveMedication = async () => {
    try {
      const url = newMedication
        ? 'http://localhost:8090/medications'
        : `http://localhost:8090/medications/${medication.id}`;
  
      const method = newMedication ? 'POST' : 'PUT';
      const headers = {
        'Content-Type': 'application/json',
      };
  
      const updatedMedication = {
        ...medication,
        price: parseFloat(medication.price), // Convert price to a number
      };
  
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(updatedMedication),
      });
  
      if (response.ok) {
        const message = newMedication
          ? 'Medication created successfully.'
          : 'Medication updated successfully.';
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: message,
          life: 3000,
        });
        setDisplayDialog(false);
        setMedication(null);
        fetchData();
      } else {
        console.error('Error saving medication:', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  const deleteMedication = async () => {
    try {
      const response = await fetch(
        `http://localhost:8090/medications/${selectedMedication.id}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Medication deleted successfully.',
          life: 3000,
        });
        setDisplayDialog(false);
        setMedication(null);
        fetchData();
      } else {
        console.error('Error deleting medication:', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openNewMedicationDialog = () => {
    setMedication({
      name: '',
      price: 0,
    });
    setNewMedication(true);
    setDisplayDialog(true);
  };

  const openEditMedicationDialog = () => {
    if (selectedMedication) {
      setMedication({ ...selectedMedication }); // Create a copy of selected medication
      setNewMedication(false);
      setDisplayDialog(true);
    }
  };

  const updateMedicationInTable = (updatedMedication) => {
    const updatedMedications = medications.map((m) => {
      if (m.id === updatedMedication.id) {
        return updatedMedication;
      }
      return m;
    });
    setMedications(updatedMedications);
  };

  const formatPrice = (rowData) => {
    const priceInLE = rowData.price + " LE";
    return <span>{priceInLE}</span>;
  };

  return (
    <div className="container">
      <Toast ref={toast} />

      
      <div className="content-section implementation">
        <DataTable
          className="slide-in-from-left"
          value={medications}
          selectionMode="single"
          selection={selectedMedication}
          onSelectionChange={(e) => setSelectedMedication(e.value)}
          paginator
          rows={10}
          loading={loading}
        >
          <Column field="id" header="ID" sortable></Column>
          <Column field="name" header="Name" sortable></Column>
          <Column field="price" header="Price" body={formatPrice}></Column>
        </DataTable>

        <div className="p-toolbar">
          <Button
            label="New"
            icon="pi pi-plus"
            className="p-button-success p-mr-2"
            onClick={openNewMedicationDialog}
          />
          <Button
            label="Edit"
            icon="pi pi-pencil"
            className="p-button-warning p-mr-2"
            onClick={openEditMedicationDialog}
            disabled={!selectedMedication}
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={deleteMedication}
            disabled={!selectedMedication}
          />
        </div>

        <Dialog
          visible={displayDialog}
          modal
          style={{ width: '600px' }}
          header="Medication Details"
          onHide={() => setDisplayDialog(false)}
        >
          <div className="p-grid p-fluid">
            <div className="p-col-4">
              <label htmlFor="name">Name</label>
            </div>
            <div className="p-col-8">
              <InputText
                id="name"
                value={medication?.name || ''}
                onChange={(e) =>
                  setMedication({ ...medication, name: e.target.value })
                }
              />
            </div>


            <div className="p-col-4">
              <label htmlFor="price">Price</label>
            </div>
            <div className="p-col-8">
              <InputText
                id="price"
                value={medication?.price || ''}
                onChange={(e) =>
                  setMedication({ ...medication, price: e.target.value })
                }
              />
            </div>

            
          </div>

          <div className="p-dialog-footer">
            <div className="p-dialog-footer-buttons">
              <Button
                label="Save"
                onClick={() => {
                  saveMedication();
                  updateMedicationInTable(medication);
                }}
                className="p-button-success"
              />
              <Button
                label="Cancel"
                onClick={() => setDisplayDialog(false)}
                className="p-button-secondary"
              />
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default MedicationComponent;
