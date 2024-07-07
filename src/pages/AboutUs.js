import React from 'react';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 
import './AboutUs.css';
import profilePhoto from '../assets/profilePhoto.jpg';
import universityLogo from '../assets/universityLogo.png';

const AboutUs = () => {
    return (
        <div className="about-us-container">
            <Navbar />
            <div className="profile-section">
                <img src={profilePhoto} alt="Profile" className="profile-photo" />
                <div className="profile-details">
                    <h2>Botta, Alberto Emmanuel</h2>
                    <p>Legajo: SOFO1299</p>
                    <p>Materia: Seminario Final</p>
                    <p>Descripción breve sobre mí: Soy un desarrollador apasionado por la tecnología y actualmente estoy trabajando en un proyecto innovador para mi seminario final. Mi objetivo es implementar soluciones que marquen una diferencia significativa en la vida de las personas.</p>
                </div>
            </div>
            <div className="university-section">
                <img src={universityLogo} alt="University Logo" className="university-logo" />
                <h3>Universidad</h3>
                <p>Presentación del proyecto en la universidad.</p>
            </div>
            <Footer />
        </div>
    );
};

export default AboutUs;
