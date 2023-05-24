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

const HomeTab = () => (
  <div className="home-page-content">
    <h2 className="fade-in">Welcome to the Home Page</h2>
    <p className="slide-up">Explore the different sections using the menu items.</p>
    
    <div className="card-container">
      <Card title="Card 1" style={{ width: '300px', margin: '20px' }}>
        <p>Card 1 content</p>
      </Card>
      
      <Card title="Card 2" style={{ width: '300px', margin: '20px' }}>
        <p>Card 2 content</p>
      </Card>
      
      <Card title="Card 3" style={{ width: '300px', margin: '20px' }}>
        <p>Card 3 content</p>
      </Card>
    </div>
  </div>
);


const AboutUsTab = () => (
  <div className="about-us-page-content">
    <h2 className="fade-in">About Us</h2>
    <p className="slide-up">Learn more about our healthcare organization and our mission.</p>
  </div>
);

const OrdersTab = () => (
  <div className="orders-page-content">
    <h2 className="fade-in">Orders</h2>
    <p className="slide-up">Manage your orders here.</p>
  </div>
);

const OrderMedicationTab = () => (
  <div className="order-medication-page-content">
    <h2 className="fade-in">Order Medication</h2>
    <p className="slide-up">Place an order for medication.</p>
  </div>
);

const ReservationTab = () => (
  <div className="reservation-page-content">
    <h2 className="fade-in">Reservation</h2>
    <p className="slide-up">Make a reservation.</p>
  </div>
);

const UserTab = () => (
  <div className="user-page-content">
    <h2 className="fade-in">User</h2>
    <p className="slide-up">Manage user information.</p>
  </div>
);

const HospitalTab = () => (
  <div className="hospital-page-content">
    <AddHospital />
  </div>
);

const LocationTab = () => (
  <div className="location-page-content">
    <h2 className="fade-in">Location</h2>
    <p className="slide-up">View our locations.</p>
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
    const path = location.pathname.substr(1);
    const selectedTab = path.charAt(0).toUpperCase() + path.slice(1);

    if (tabComponents[selectedTab]) {
      setActiveItem(selectedTab);
    } else {
      setActiveItem('Home');
    }

    // Fetch subscribed clinics data
    const fetchSubscribedClinics = async () => {
      try {
        const clinicsData = await ClinicComponent.fetchSubscribedClinics();
        setSubscribedClinics(clinicsData);
      } catch (error) {
        console.error('Error fetching subscribed clinics:', error);
      }
    };

    // Fetch subscribed hospitals data
    const fetchSubscribedHospitals = async () => {
      try {
        const hospitalsData = await HospitalComponent.fetchSubscribedHospitals();
        setSubscribedHospitals(hospitalsData);
      } catch (error) {
        console.error('Error fetching subscribed hospitals:', error);
      }
    };

    fetchSubscribedClinics();
    fetchSubscribedHospitals();
  }, [location]);

  const handleToggleSidebar = () => {
    setSidebarVisible((prevState) => !prevState);
  };

  const handleTabChange = (event) => {
    const selectedLabel = event.value.label;
    setActiveItem(selectedLabel);
    history.push(`/${selectedLabel.toLowerCase().replace(/\s/g, '')}`);
  };
  const backgroundStyle = {
    backgroundImage: `url(${healthcareBackground})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
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
    { icon: 'pi pi-pencil', label: 'Home' },
    { icon: 'pi pi-fw pi-hospital', label: 'Clinics' },
    { icon: 'pi pi-fw pi-hospital', label: 'Hospital' },
    { icon: 'pi pi-fw pi-dollar', label: 'Medical Insurance' },
    { icon: 'pi pi-fw pi-medkit', label: 'Medication' },
    { icon: 'pi pi-fw pi-tablet', label: 'Pharmacy' },
    { icon: 'pi pi-fw pi-info', label: 'About Us' },
  ];

  const sidebarItems = [
    { label: 'Orders', icon: 'pi pi-fw pi-file', action: () => handleSidebarItemClick({ label: 'Orders' }) },
    { label: 'Order Medication', icon: 'pi pi-fw pi-shopping-cart', action: () => handleSidebarItemClick({ label: 'Order Medication' }) },
    { label: 'Reservation', icon: 'pi pi-fw pi-calendar', action: () => handleSidebarItemClick({ label: 'Reservation' }) },
    { label: 'User', icon: 'pi pi-fw pi-user', action: () => handleSidebarItemClick({ label: 'User' }) },
    { label: 'Location', icon: 'pi pi-fw pi-map-marker', action: () => handleSidebarItemClick({ label: 'Location' }) },
  ];

  const tabComponents = {
    Home: <HomeTab />,
    'About Us': <AboutUsTab />,
    Clinics: <AddClinic subscribedClinics={subscribedClinics} />,
    Hospital: <HospitalTab subscribedHospitals={subscribedHospitals} />,
    Orders: <OrdersTab />,
    'Order Medication': <OrderMedicationTab />,
    Reservation: <ReservationTab />,
    User: <UserTab />,
    Location: <LocationTab />,
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
          <TabMenu model={tabMenuItems} activeItem={activeItem} onTabChange={handleTabChange} />
          {tabComponents[activeItem]}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
