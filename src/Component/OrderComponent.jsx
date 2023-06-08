import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';

const OrderComponent = () => {
  const [orders, setOrders] = useState([]);
  const [medications, setMedications] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [medicationName, setMedicationName] = useState('');
  // const [dosage, setDosage] = useState('');
  const [quantity, setQuantity] = useState('');
  // const deliveryOptions = [
  //   { label: 'Option 1', value: 'option1' },
  //   { label: 'Option 2', value: 'option2' },
  //   { label: 'Option 3', value: 'option3' }
  // ];
  // const [deliveryOption, setDeliveryOption] = useState(deliveryOptions[0]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [medicationPrice, setMedicationPrice] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchMedications();
    fetchPharmacies();
  }, []);

  useEffect(() => {
    const ordersWithMedicationName = orders.map((order) => ({
      ...order,
      medicationName: medications.find((med) => med.id === order.medication)?.name || '',
    }));
    setOrders(ordersWithMedicationName);
  }, [medications]);

  const fetchOrders = () => {
    axios
      .get('http://localhost:8090/orders')
      .then((response) => {
        const ordersWithMedicationInfo = response.data.map((order) => {
          const medication = medications.find((med) => med.id === order.medication);
          return {
            ...order,
            medicationName: medication?.name || '',
            price: medication?.price || '',
          };
        });
        setOrders(ordersWithMedicationInfo);
      })
      .catch((error) => {
        console.error('Failed to fetch orders:', error);
      });
  };

  const fetchMedications = () => {
    axios
      .get('http://localhost:8090/medications')
      .then((response) => {
        setMedications(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch medications:', error);
      });
  };

  const fetchPharmacies = () => {
    axios
      .get('http://localhost:8090/pharmacies')
      .then((response) => {
        setPharmacies(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch pharmacies:', error);
      });
  };

  const saveOrder = () => {
    const order = {
      medication: medicationName,
      quantity,
      pharmacy: selectedPharmacy,
      price: medicationPrice,
    };

    axios
      .post('http://localhost:8090/orders', order)
      .then((response) => {
        console.log('Order saved successfully:', response.data);
        setShowConfirmation(false);
        clearForm();
        fetchOrders();
      })
      .catch((error) => {
        console.error('Failed to save order:', error);
      });
  };

  const handleOrder = () => {
    if (selectedOrder) {
      updateOrder();
    } else {
      saveOrder();
    }
  };

  const updateOrder = () => {
    const updatedOrder = {
      id: selectedOrder.id,
      medication: medicationName,
      quantity,
      pharmacy: selectedPharmacy,
      price: medicationPrice,
    };

    axios
      .put(`http://localhost:8090/orders/${selectedOrder.id}`, updatedOrder)
      .then((response) => {
        console.log('Order updated successfully:', response.data);
        setShowConfirmation(false);
        clearForm();
        fetchOrders();
      })
      .catch((error) => {
        console.error('Failed to update order:', error);
      });
  };

  const deleteOrder = (orderId) => {
    axios
      .delete(`http://localhost:8090/orders/${orderId}`)
      .then((response) => {
        console.log('Order deleted successfully:', response.data);
        fetchOrders();
      })
      .catch((error) => {
        console.error('Failed to delete order:', error);
      });
  };

  const editOrder = (order) => {
    setSelectedOrder(order);
    setMedicationName(order.medication);
    setQuantity(order.quantity);
    setSelectedPharmacy(order.pharmacy);
    setMedicationPrice(order.price);
    setShowConfirmation(true);
  };

  const clearForm = () => {
    setSelectedOrder(null);
    setMedicationName('');
    setQuantity('');
    setSelectedPharmacy(null);
    setMedicationPrice('');
  };

  const deleteButtonTemplate = (rowData) => (
    <Button
      icon="pi pi-trash"
      className="p-button-rounded p-button-danger"
      onClick={() => deleteOrder(rowData.id)}
    />
  );

  const fetchMedicationPrice = (medicationId) => {
    axios
      .get(`http://localhost:8090/medications/${medicationId}`)
      .then((response) => {
        const medication = response.data;
        setMedicationPrice(medication.price);
      })
      .catch((error) => {
        console.error('Failed to fetch medication price:', error);
      });
  };

  const medicationOptions = medications.map((medication) => ({
    label: medication.name,
    value: medication.id,
  }));

  const pharmacyOptions = pharmacies.map((pharmacy) => ({
    label: pharmacy.name,
    value: pharmacy.id,
  }));

  return (
    <div>
      <Dialog
        visible={showConfirmation}
        onHide={() => setShowConfirmation(false)}
        header={selectedOrder ? 'Edit Order' : 'Create Order'}
      >
        <div className="p-grid p-fluid">
          <div className="p-col-4">
            <label htmlFor="medicationName">Medication Name</label>
          </div>
          <div className="p-col-8">
            <Dropdown
              id="medicationName"
              options={medicationOptions}
              value={medicationName}
              onChange={(e) => {
                setMedicationName(e.value);
                fetchMedicationPrice(e.value); // Fetch medication price when the name is selected
              }}
              placeholder="Select Medication Name"
            />
          </div>

         

          <div className="p-col-4">
            <label htmlFor="quantity">Quantity</label>
          </div>
          <div className="p-col-8">
            <InputText
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>



          <div className="p-col-4">
            <label htmlFor="pharmacy">Pharmacy</label>
          </div>
          <div className="p-col-8">
            <Dropdown
              id="pharmacy"
              options={pharmacyOptions}
              value={selectedPharmacy}
              onChange={(e) => setSelectedPharmacy(e.value)}
              placeholder="Select Pharmacy"
            />
          </div>

          <div className="p-col-4">
            <label htmlFor="medicationPrice">Price</label>
          </div>
          <div className="p-col-8">
            <InputText
              id="medicationPrice"
              value={medicationPrice}
              readOnly
            />
          </div>
        </div>

        <div className="p-dialog-footer">
          <Button label="Cancel" onClick={() => setShowConfirmation(false)} />
          <Button label="Save" onClick={handleOrder} />
        </div>
      </Dialog>

      <Button
        label="New Order"
        icon="pi pi-plus"
        onClick={() => setShowConfirmation(true)}
      />

<DataTable value={orders}>
  <Column field="medicationName" header="Medication Name" />
  <Column field="quantity" header="Quantity" />
  <Column field="pharmacy.name" header="Pharmacy" />
  <Column field="price" header="Price" />
  <Column
    body={deleteButtonTemplate}
    style={{ textAlign: 'center', width: '8em' }}
  />
  <Column
    body={(rowData) => (
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-success"
        onClick={() => editOrder(rowData)}
      />
    )}
    style={{ textAlign: 'center', width: '8em' }}
  />
</DataTable>

    </div>
  );
};

export default OrderComponent;
