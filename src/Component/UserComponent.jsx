import React, { useState, useEffect, useRef } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { useHistory } from 'react-router-dom'; // Import useHistory hook
import './UserComponent.css';

const UserComponent = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [signInData, setSignInData] = useState({ username: '', email: '', password: '', rememberMe: false });
  const [signUpData, setSignUpData] = useState({ username: '', email: '', password: '', confirmPassword: '', gender: null, mobileNumber: '', agreePolicy: false });
  const [genderOptions, setGenderOptions] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const toast = useRef(null);
  const history = useHistory(); // Initialize useHistory hook

  useEffect(() => {
    fetch('http://localhost:8090/user/gender')
      .then((response) => response.json())
      .then((data) => {
        setGenderOptions(data.map((gender) => ({ label: gender, value: gender })));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const handleTabChange = (e) => {
    setActiveTab(e.index);
  };

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRememberMeChange = (e) => {
    const { checked } = e.target;
    setSignInData((prevData) => ({ ...prevData, rememberMe: checked }));
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    // Handle sign in submission logic here
    console.log('Sign In Data:', signInData);

    // Send sign in data to the server
    fetch('http://localhost:8090/user/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(signInData)
    })
      .then((response) => {
        if (response.ok) {
          // Sign in successful, handle accordingly
          console.log('Sign In Successful');
          toast.current.show({ severity: 'success', summary: 'Sign In Successful' });
        } else {
          // Sign in failed, handle accordingly
          console.error('Sign In Failed');
          toast.current.show({ severity: 'error', summary: 'Sign In Failed' });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleSignUpChange = (e) => {
    const { name, value, checked, type } = e.target;
    let inputValue = type === 'checkbox' ? checked : value;

    if (name === 'gender') {
      // Set the selected value directly
      inputValue = value;
    }

    setSignUpData((prevData) => ({ ...prevData, [name]: inputValue }));
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    console.log('Sign Up Data:', signUpData);
  
    fetch('http://localhost:8090/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(signUpData)
    })
      .then((response) => {
        if (response.ok) {
          console.log('Sign Up Successful');
          setShowSuccessMessage(true);
          toast.current.show({ severity: 'success', summary: 'Sign Up Successful' });
  
          setTimeout(() => {
            history.push('/thanks'); // Redirect to '/thanks' page
          }, 2000);
        } else {
          console.error('Sign Up Failed');
          toast.current.show({ severity: 'error', summary: 'Sign Up Failed' });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  

  return (
    <div className="user-component">
      <TabMenu activeIndex={activeTab} onTabChange={handleTabChange} model={[
        { label: 'Sign In' },
        { label: 'Sign Up' }
      ]} />

      <div className="user-form">
        {activeTab === 0 && (
          <form onSubmit={handleSignInSubmit}>
            <div className="p-field">
              <label htmlFor="username">Username</label>
              <InputText id="username" name="username" value={signInData.username} onChange={handleSignInChange} />
            </div>
            <div className="p-field">
              <label htmlFor="email">Email</label>
              <InputText id="email" name="email" value={signInData.email} onChange={handleSignInChange} />
            </div>
            <div className="p-field">
              <label htmlFor="password">Password</label>
              <InputText
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={signInData.password}
                onChange={handleSignInChange}
              />
            </div>
            <div className="p-field">
              <label htmlFor="rememberMe">Remember Me</label>
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={signInData.rememberMe}
                onChange={handleRememberMeChange}
              />
            </div>
            <Button type="submit" label="Sign In" className="p-button p-button-primary" />
          </form>
        )}

        {activeTab === 1 && (
          <form onSubmit={handleSignUpSubmit}>
            <div className="p-field">
              <label htmlFor="username">Username</label>
              <InputText id="username" name="username" value={signUpData.username} onChange={handleSignUpChange} />
            </div>
            <div className="p-field">
              <label htmlFor="email">Email</label>
              <InputText id="email" name="email" value={signUpData.email} onChange={handleSignUpChange} />
            </div>
            <div className="p-field">
              <label htmlFor="password">Password</label>
              <InputText
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={signUpData.password}
                onChange={handleSignUpChange}
              />
            </div>
            <div className="p-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <InputText
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={signUpData.confirmPassword}
                onChange={handleSignUpChange}
              />
            </div>
            <div className="p-field">
              <label htmlFor="gender">Gender</label>
              <Dropdown id="gender" name="gender" value={signUpData.gender} options={genderOptions} onChange={handleSignUpChange} />
            </div>
            <div className="p-field">
              <label htmlFor="mobileNumber">Mobile Number</label>
              <InputText id="mobileNumber" name="mobileNumber" value={signUpData.mobileNumber} onChange={handleSignUpChange} />
            </div>
            <div className="p-field">
              <label htmlFor="agreePolicy">I agree to the terms and conditions</label>
              <input
                id="agreePolicy"
                name="agreePolicy"
                type="checkbox"
                checked={signUpData.agreePolicy}
                onChange={handleSignUpChange}
              />
            </div>
            <Button type="submit" label="Sign Up" className="p-button p-button-primary" />
          </form>
        )}
      </div>

      <Toast ref={toast} />

      {showSuccessMessage && (
        <div className="success-message">
          <h3>Thanks for Registering!</h3>
          <p>Your registration was successful. Please check your email for further instructions.</p>
        </div>
      )}
    </div>
  );
};

export default UserComponent;
