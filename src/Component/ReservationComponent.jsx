import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import './ReservationComponent.css';

const ReservationComponent = () => {
  const [reservations, setReservations] = useState([]);
  const [reservation, setReservation] = useState({
    name: '',
    age: 0,
    gender: '',
    address: '',
    reservationTime: null,
    medicalRecordNumber: '',
    clinic: null,
    schedule: null,
    user: null,
  });
  const [genderOptions, setGenderOptions] = useState([]);
  const [clinicOptions, setClinicOptions] = useState([]);
  const [scheduleOptions, setScheduleOptions] = useState([]);

  useEffect(() => {
    fetchAllReservations();
  }, []);

  const fetchAllReservations = () => {
    axios
      .get('http://localhost:8090/reservations')
      .then((response) => {
        setReservations(response.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetch('http://localhost:8090/reservations/gender')
      .then((response) => response.json())
      .then((data) => {
        setGenderOptions(data.map((gender) => ({ label: gender, value: gender })));
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch('http://localhost:8090/reservations/clinics')
      .then((response) => response.json())
      .then((data) => {
        setClinicOptions(data.map((clinic) => ({ label: clinic.name, value: clinic })));
        setScheduleOptions(
          data.map((clinic) => ({
            label: clinic.schedule,
            value: clinic.schedule,
          }))
        );
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const createReservation = () => {
    axios
      .post('http://localhost:8090/reservations', reservation)
      .then(() => {
        setReservation({
          name: '',
          age: 0,
          gender: '',
          address: '',
          reservationTime: null,
          medicalRecordNumber: '',
          clinic: null,
          schedule: null,
          user: null,
        });
        fetchAllReservations();
      })
      .catch((error) => console.log(error));
  };

  const cancelReservation = (id) => {
    axios
      .delete(`http://localhost:8090/reservations/${id}`)
      .then(() => {
        fetchAllReservations();
      })
      .catch((error) => console.log(error));
  };

  const cancelReservationButtonTemplate = (rowData) => {
    return (
      <Button
        label="Cancel Reservation"
        className="p-button-danger"
        onClick={() => cancelReservation(rowData.id)}
      />
    );
  };

  const handleInputChange = (e, field) => {
    const value = field === 'age' ? e.value : e.target.value;
    setReservation({ ...reservation, [field]: value });
  };

  const handleDropdownChange = (e, field) => {
    setReservation({ ...reservation, [field]: e.value });
  };

  const handleCalendarChange = (e, field) => {
    setReservation({ ...reservation, [field]: e.value });
  };

  return (
    <div className="reservation-component">
      <div className="reservation-form">
        <div className="p-grid">
          <div className="p-col-12 p-md-6">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              className="p-inputtext"
              value={reservation.name}
              onChange={(e) => handleInputChange(e, 'name')}
            />
          </div>
          <div className="p-col-12 p-md-6">
            <label htmlFor="age">Age</label>
            <InputText
              id="age"
              className="p-inputtext"
              value={reservation.age}
              onChange={(e) => handleInputChange(e, 'age')}
            />
          </div>
        </div>

        <div className="p-grid">
          <div className="p-col-12 p-md-6">
            <label htmlFor="gender">Gender</label>
            <Dropdown
              id="gender"
              className="p-dropdown"
              value={reservation.gender}
              options={genderOptions}
              onChange={(e) => handleDropdownChange(e, 'gender')}
              placeholder="Select a gender"
            />
          </div>
          <div className="p-col-12 p-md-6">
            <label htmlFor="address">Address</label>
            <InputText
              id="address"
              className="p-inputtext"
              value={reservation.address}
              onChange={(e) => handleInputChange(e, 'address')}
            />
          </div>
        </div>

        <div className="p-grid">
          <div className="p-col-12 p-md-6">
            <label htmlFor="reservationTime">Reservation Time</label>
            <Calendar
              id="reservationTime"
              className="p-calendar"
              value={reservation.reservationTime}
              onChange={(e) => handleCalendarChange(e, 'reservationTime')}
              showTime
            />
          </div>
          <div className="p-col-12 p-md-6">
            <label htmlFor="medicalRecordNumber">Medical Record Number</label>
            <InputText
              id="medicalRecordNumber"
              className="p-inputtext"
              value={reservation.medicalRecordNumber}
              onChange={(e) => handleInputChange(e, 'medicalRecordNumber')}
            />
          </div>
        </div>

        <div className="p-grid">
          <div className="p-col-12 p-md-6">
            <label htmlFor="clinic">Clinic</label>
            <Dropdown
              id="clinic"
              className="p-dropdown"
              value={reservation.clinic}
              options={clinicOptions}
              onChange={(e) => handleDropdownChange(e, 'clinic')}
              placeholder="Select a clinic"
            />
          </div>
          <div className="p-col-12 p-md-6">
            <label htmlFor="schedule">Schedule</label>
            <Dropdown
              id="schedule"
              className="p-dropdown"
              value={reservation.schedule}
              options={scheduleOptions}
              onChange={(e) => handleDropdownChange(e, 'schedule')}
              placeholder="Select a schedule"
            />
          </div>
        </div>

        <Button label="Create Reservation" className="p-button-primary" onClick={createReservation} />
      </div>

      <div className="reservation-table">
        <DataTable value={reservations} emptyMessage="No reservations found">
          <Column field="id" header="ID" />
          <Column field="name" header="Name" />
          <Column field="age" header="Age" />
          <Column field="gender" header="Gender" />
          <Column field="address" header="Address" />
          <Column field="reservationTime" header="Reservation Time" />
          <Column field="medicalRecordNumber" header="Medical Record Number" />
          <Column field="clinic.name" header="Clinic Name" />
          <Column header="Actions" body={cancelReservationButtonTemplate} />
        </DataTable>
      </div>
    </div>
  );
};

export default ReservationComponent;
