import React, { useEffect, useState, useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import './medicalComponent.css';

const MedicalComponent = () => {
  const [medicalInsurances, setMedicalInsurances] = useState([]);
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [insuranceProviders, setInsuranceProviders] = useState([]);
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [medicalInsurancesResponse, enumResponse] = await Promise.all([
        axios.get('http://localhost:8090/medical-insurances'),
        axios.get('http://localhost:8090/medical-insurances/enums')
      ]);

      setMedicalInsurances(medicalInsurancesResponse.data);
      setInsuranceProviders(enumResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const insuranceOptions = insuranceProviders.map((provider) => ({
    label: provider,
    value: provider,
  }));

  const handleInsuranceChange = (e) => {
    setSelectedInsurance(e.value);
  };

  const handleInsuranceNumberChange = (e) => {
    setInsuranceNumber(e.target.value);
  };

  const saveMedicalInsurance = () => {
    if (selectedInsurance && insuranceNumber) {
      axios
        .post('http://localhost:8090/medical-insurances', {
          insuranceProvider: selectedInsurance,
          insuranceNumber,
        })
        .then((response) => {
          console.log('Medical insurance saved successfully:', response.data);
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Medical insurance saved successfully.',
            life: 3000, // Duration in milliseconds
          });
          setShowConfirmation(true);
        })
        .catch((error) => {
          console.error('Error saving medical insurance:', error);
        });
    } else {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Please provide both insurance provider and number.',
        life: 3000, // Duration in milliseconds
      });
    }
  };

  const handleBackClick = () => {
    setShowConfirmation(false);
    setSelectedInsurance(null);
    setInsuranceNumber('');
  };

  return (
    <div className="medical-component">
      <h2>Medical Component</h2>
      {!showConfirmation ? (
        <>
          <div className="form-group">
            <label htmlFor="insuranceNumber">Insurance Number:</label>
            <input
              type="text"
              id="insuranceNumber"
              className="p-inputtext"
              value={insuranceNumber}
              onChange={handleInsuranceNumberChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="insuranceProvider">Insurance Provider:</label>
            <Dropdown
              id="insuranceProvider"
              value={selectedInsurance}
              options={insuranceOptions}
              onChange={handleInsuranceChange}
              placeholder="Select Insurance Provider"
              className="p-inputtext"
            />
          </div>
          <Button label="Save" onClick={saveMedicalInsurance} className="p-button-primary save-button" />
        </>
      ) : (
        <>
          <div className="confirmation-message">
            <p>Thank you for adding the medical insurance!</p>
            <Button label="Add Another Medical Insurance" onClick={handleBackClick} className="p-button-secondary" />
          </div>
        </>
      )}
      <Toast ref={toast} position="top-right" />
    </div>
  );
};

export default MedicalComponent;
