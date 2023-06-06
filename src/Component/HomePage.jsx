import React, { useState, useEffect } from 'react';
import { TabMenu, Card, Sidebar, Button } from 'primereact';
import ClinicComponent from './ClinicComponent';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import './HomePage.css';
import HospitalComponent from './HospitalComponent';
import healthcareBackground from './healthcareBackground.jpg';
import { useHistory, useLocation } from 'react-router-dom';
import AddClinic from './AddClinic';
import AddHospital from './AddHospital';
import MedicalComponent from './medicalInsurance';
import { Galleria } from 'primereact/galleria';
import LocationComponent from './LocationComponent';
import UserComponent from './UserComponent';
import AddPharmacy from './AddPharmacy';
import AboutUsComponent from './AboutUsComponent';
import ReservationComponent from './ReservationComponent';
import OrderComponent from './OrderComponent';
import HomeComponent from './HomeComponent';
import MedicationComponent from './MedicationComponent';

const HomeTab = () => (
  <div className="home-page-content">
    <HomeComponent />
  </div>
);

const AboutUsTab = () => (
  <div className="about-us-page-content">
    <AboutUsComponent />
  </div>
);

const OrdersTab = () => (
  <div className="orders-page-content">
    <OrderComponent />
  </div>
);

const ReservationTab = () => (
  <div className="reservation-page-content">
    <ReservationComponent />
  </div>
);

const UserTab = () => (
  <div className="user-page-content">
    <UserComponent />
  </div>
);

const HospitalTab = () => (
  <div className="hospital-page-content">
    <AddHospital />
  </div>
);

const LocationTab = () => (
  <div className="location-page-content">
    <LocationComponent />
  </div>
);

const PharmacyTab = () => (
  <div className="pharmacy-page-content">
    <AddPharmacy />
  </div>
);
const MedicationTab = () => (
  <div className="medication-page-content">
    <MedicationComponent />
  </div>
);


const HomePage = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');
  const [subscribedClinics, setSubscribedClinics] = useState([]);
  const [subscribedHospitals, setSubscribedHospitals] = useState([]);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const selectedTab = location.pathname.replace('/', '');
    setActiveItem(selectedTab || 'Home');
  }, [location]);

  const handleToggleSidebar = () => {
    setSidebarVisible((prevState) => !prevState);
  };

  const handleTabChange = (event) => {
    const selectedTab = event.value.label;
    setActiveItem(selectedTab);

    if (selectedTab === 'Home') {
      history.push('/');
    } else {
      history.push(`/${selectedTab.toLowerCase().replace(/\s/g, '')}`);
    }
  };

  const backgroundStyle = {
    backgroundImage: `url(${healthcareBackground})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      const tabMenuItems = [
        { id: 'home', icon: 'pi pi-pencil', label: 'Home' },
        { id: 'clinics', icon: 'pi pi-fw pi-hospital', label: 'Clinics' },
        { id: 'hospital', icon: 'pi pi-fw pi-hospital', label: 'Hospital' },
        { id: 'medicalInsurance', icon: 'pi pi-fw pi-dollar', label: 'Medical Insurance' },
        { id: 'pharmacy', icon: 'pi pi-fw pi-tablet', label: 'Pharmacy' },
        { id: 'aboutAs', icon: 'pi pi-fw pi-info', label: 'About Us' },
      ];
      const activeIndex = tabMenuItems.findIndex((item) => item.label === activeItem);
      const nextIndex = (activeIndex + 1) % tabMenuItems.length;
      const nextLabel = tabMenuItems[nextIndex].label;
      setActiveItem(nextLabel);
      history.push(`/${nextLabel.toLowerCase().replace(/\s/g, '')}`);
    }
  };

  const handleSidebarItemClick = (item) => {
    setActiveItem(item.label);
    setSidebarVisible(false);
    history.push(`/${item.label.toLowerCase().replace(/\s/g, '')}`);
  };

  const tabMenuItems = [
    { id: 'home', icon: 'pi pi-pencil', label: 'Home' },
    { id: 'clinics', icon: 'pi pi-fw pi-hospital', label: 'Clinics' },
    { id: 'hospital', icon: 'pi pi-fw pi-hospital', label: 'Hospital' },
    { id: 'medicalInsurance', icon: 'pi pi-fw pi-dollar', label: 'Medical Insurance' },
    { id: 'pharmacy', icon: 'pi pi-fw pi-tablet', label: 'Pharmacy' },
    { id: 'aboutAs', icon: 'pi pi-fw pi-info', label: 'About Us' },
  ];

  const sidebarItems = [
    { label: 'Orders', icon: 'pi pi-fw pi-file', action: () => handleSidebarItemClick({ label: 'Orders' }) },
    { label: 'Reservation', icon: 'pi pi-fw pi-calendar', action: () => handleSidebarItemClick({ label: 'Reservation' }) },
    { label: 'User', icon: 'pi pi-fw pi-user', action: () => handleSidebarItemClick({ label: 'User' }) },
    { label: 'Location', icon: 'pi pi-fw pi-map-marker', action: () => handleSidebarItemClick({ label: 'Location' }) },
    { label: 'Medication', icon: 'pi pi-fw pi-medkit', action: () => handleSidebarItemClick({ label: 'Medication' }) }, // Add this line
  ];
  

  const tabComponents = {
    Home: <HomeTab />,
    'About Us': <AboutUsTab />,
    Clinics: <AddClinic subscribedClinics={subscribedClinics} />,
    Hospital: <HospitalTab subscribedHospitals={subscribedHospitals} />,
    Orders: <OrdersTab />,
    Reservation: <ReservationTab />,
    User: <UserTab />,
    Location: <LocationTab />,
    'Medical Insurance': <MedicalComponent />,
    Pharmacy: <PharmacyTab />,
    Medication: <MedicationTab />,
  };
  

  return (
    <div className="p-grid p-dir-row" style={backgroundStyle}>
      <div className={`p-col sidebar ${sidebarVisible ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <Sidebar visible={sidebarVisible} onHide={handleToggleSidebar}>
          <div className="sidebar-menu">
            {sidebarItems.map((item, index) => (
              <Button
                key={index}
                className={`sidebar-menu-button ${item.label === activeItem ? 'active' : ''}`}
                icon={item.icon}
                onClick={item.action}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </Sidebar>
      </div>
      <div className={`p-col main-content ${sidebarVisible ? 'content-expanded' : 'content-collapsed'}`}>
        <div className="topbar">
          <Button icon={`pi ${sidebarVisible ? 'pi-angle-double-left' : 'pi-angle-double-right'}`} onClick={handleToggleSidebar} />
        </div>
        <div className="content-wrapper" tabIndex="0" onKeyDown={handleKeyDown}>
          <TabMenu
            model={tabMenuItems}
            activeItem={activeItem}
            onTabChange={handleTabChange}
            className={activeItem === 'Home' ? 'custom-tab-menu home-tab' : 'custom-tab-menu'}
          />
          {tabComponents[activeItem]}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
