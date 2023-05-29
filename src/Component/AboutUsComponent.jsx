import React from 'react';
import { Card } from 'primereact/card';
import './AboutUsComponent.css';

const AboutUsComponent = () => {
  return (
    <div className="about-us-page p-grid p-dir-row">
      <div className="p-col-12 p-md-8">
        <h2 className="fade-in">About Us</h2>
        <p className="slide-up">Learn more about our healthcare organization and our mission.</p>

        <div className="mission-vision-values p-grid">
          <div className="p-col-12 p-md-4">
            <Card title="Our Mission" className="fade-in-left">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eleifend, mauris vitae vestibulum ultricies,
                odio felis ullamcorper arcu, a posuere velit nulla vel lacus. Suspendisse tincidunt auctor semper. In
                consectetur venenatis metus vitae bibendum. Nullam pharetra lacus mauris, eu gravida dui aliquam in.
              </p>
            </Card>
          </div>

          <div className="p-col-12 p-md-4">
            <Card title="Our Vision" className="fade-in">
              <p>
                Ut ac turpis ultricies, elementum tortor ut, feugiat elit. Sed quis sollicitudin nulla. Donec ultrices,
                turpis ac tristique placerat, erat augue interdum lectus, et pretium enim lacus sed ligula. Proin ut nunc
                vel elit consequat ullamcorper ut sed mi. Quisque sagittis ante eget bibendum tincidunt. Proin tincidunt,
                libero eget faucibus lobortis, ex eros volutpat dolor, a ultrices risus risus ut lorem.
              </p>
            </Card>
          </div>

          <div className="p-col-12 p-md-4">
            <Card title="Our Values" className="fade-in-right">
              <ul>
                <li>Lorem ipsum dolor sit amet</li>
                <li>Consectetur adipiscing elit</li>
                <li>Sed eleifend, mauris vitae vestibulum ultricies</li>
                <li>Odio felis ullamcorper arcu</li>
                <li>A posuere velit nulla vel lacus</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      <div className="p-col-12 p-md-4">
        <div className="contact-us fade-in">
          <h2>Contact Us</h2>
          <p>If you have any questions or inquiries, please feel free to contact us.</p>
          <div className="contact-info">
            <div className="contact-item">
              <h3>Email</h3>
              <p>info@example.com</p>
            </div>
            <div className="contact-item">
              <h3>Phone</h3>
              <p>+1 123-456-7890</p>
            </div>
            <div className="contact-item">
              <h3>Address</h3>
              <p>123 Main Street, City, Country</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsComponent;
