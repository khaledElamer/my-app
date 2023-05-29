import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import './OrderComponent.css';

const OrderComponent = () => {
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [quantity, setQuantity] = useState('');
  const [deliveryOption, setDeliveryOption] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editable, setEditable] = useState(false);
  const [pharmacies, setPharmacies] = useState([]);

  const deliveryOptions = [
    { label: 'Standard Delivery', value: 'standard' },
    { label: 'Express Delivery', value: 'express' }
  ];

  useEffect(() => {
    fetchOrders();
    fetchPharmacies();
  }, []);

  const fetchOrders = () => {
    axios.get('http://localhost:8090/orders')
      .then(response => {
        const fetchedOrders = response.data.map(order => ({
          ...order,
          editable: false
        }));
        setOrders(fetchedOrders);
      })
      .catch(error => {
        console.error('Failed to fetch orders:', error);
      });
  };

  const fetchPharmacies = () => {
    axios.get('http://localhost:8090/orders/pharmacy')
      .then(response => {
        const fetchedPharmacies = response.data.map(pharmacy => ({
          label: pharmacy.name,
          value: pharmacy.id
        }));
        setPharmacies(fetchedPharmacies);
      })
      .catch(error => {
        console.error('Failed to fetch pharmacies:', error);
      });
  };

  const handleOrder = () => {
    const orderData = {
      medicationName,
      dosage,
      quantity,
      deliveryOption,
      pharmacy: selectedPharmacy
    };

    if (editable) {
      axios.put(`http://localhost:8090/orders/${selectedOrder.id}`, orderData)
        .then(response => {
          console.log('Order updated successfully:', response.data);
          const updatedOrder = response.data;

          // Update the order in the orders state array
          setOrders(prevOrders => {
            const updatedOrders = prevOrders.map(order => {
              if (order.id === updatedOrder.id) {
                return updatedOrder;
              }
              return order;
            });
            return updatedOrders;
          });

          resetForm();
        })
        .catch(error => {
          console.error('Failed to update order:', error);
        });
    } else {
      axios.post('http://localhost:8090/orders', orderData)
        .then(response => {
          console.log('Order placed successfully:', response.data);
          const newOrder = response.data;

          // Add the new order to the beginning of the orders state array
          setOrders(prevOrders => [newOrder, ...prevOrders]);

          resetForm();
        })
        .catch(error => {
          console.error('Failed to place order:', error);
        });
    }

    setShowConfirmation(true);
  };

  const handleConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setMedicationName(order.medicationName);
    setDosage(order.dosage);
    setQuantity(order.quantity);
    setDeliveryOption(order.deliveryOption);
    setSelectedPharmacy(order.pharmacy);
    setEditable(true);
  };

  const handleDelete = (order) => {
    axios.delete(`http://localhost:8090/orders/${order.id}`)
      .then(response => {
        console.log('Order deleted successfully:', response.data);
        fetchOrders();
      })
      .catch(error => {
        console.error('Failed to delete order:', error);
      });
  };

  const resetForm = () => {
    setMedicationName('');
    setDosage('');
    setQuantity('');
    setDeliveryOption(null);
    setSelectedPharmacy(null);
    setSelectedOrder(null);
    setEditable(false);
  };

  return (
    <div>
      <h2>Order Medications</h2>
      <div className="p-fluid">
        <label htmlFor="medicationName">Medication Name</label>
        <InputText
          id="medicationName"
          value={medicationName}
          onChange={(e) => setMedicationName(e.target.value)}
        />
      </div>
      <div className="p-fluid">
        <label htmlFor="dosage">Dosage</label>
        <InputText
          id="dosage"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
        />
      </div>
      <div className="p-fluid">
        <label htmlFor="quantity">Quantity</label>
        <InputText
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      <div className="p-fluid">
        <label htmlFor="deliveryOption">Delivery Option</label>
        <Dropdown
          id="deliveryOption"
          options={deliveryOptions}
          value={deliveryOption}
          onChange={(e) => setDeliveryOption(e.value)}
          placeholder="Select a delivery option"
        />
      </div>
      <div className="p-fluid">
        <label htmlFor="pharmacy">Select Pharmacy</label>
        <Dropdown
          id="pharmacy"
          options={pharmacies}
          value={selectedPharmacy}
          onChange={(e) => setSelectedPharmacy(e.value)}
          placeholder="Select a pharmacy"
        />
      </div>
      {editable ? (
        <div>
          <Button label="Update Order" onClick={handleOrder} />
          <Button label="Cancel" onClick={resetForm} className="p-button-secondary" />
        </div>
      ) : (
        <Button label="Place Order" onClick={handleOrder} />
      )}

      <DataTable value={orders}>
        <Column field="medicationName" header="Medication Name" />
        <Column field="dosage" header="Dosage" />
        <Column field="quantity" header="Quantity" />
        <Column field="deliveryOption" header="Delivery Option" />
        <Column field="pharmacy" header="Pharmacy" />
        <Column
          header="Actions"
          body={(rowData) => (
            <div>
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-secondary"
                onClick={() => handleEdit(rowData)}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => handleDelete(rowData)}
              />
            </div>
          )}
        />
      </DataTable>

      <Dialog
        visible={showConfirmation}
        onHide={handleConfirmation}
        header="Order Confirmation"
        footer={
          <div>
            <Button label="OK" onClick={handleConfirmation} autoFocus />
          </div>
        }
      >
        <p>Your order for {quantity} {medicationName} ({dosage}) has been placed with {deliveryOption} delivery from {selectedPharmacy}.</p>
        <p>Thank you for using our pharmacy services!</p>
      </Dialog>
    </div>
  );
};

export default OrderComponent;
