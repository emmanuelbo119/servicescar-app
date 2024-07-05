import React from 'react';
import './AboutUs.css';
import profilePhoto from '../assets/profilePhoto.jpg'; 
import universityLogo from '../assets/universityLogo.png'; 

const AboutUs = () => {
    return (
        <div className="about-us-container">
            <div className="profile-section">
                <img src={profilePhoto} alt="Profile" className="profile-photo" />
                <div className="profile-details">
                    <h2>Botta, Alberto Emmanuel</h2>
                    <p>Legajo: SOFO1299</p>
                    <p>Materia: Seminario Final de Analista de Software</p>
                </div>
            </div>
            <div className="university-section">
                <img src={universityLogo} alt="University Logo" className="university-logo" />
                <h3>Universidad</h3>
                <p>Presentación del proyecto en la universidad.</p>
            </div>
        </div>
    );
};

export default AboutUs;
