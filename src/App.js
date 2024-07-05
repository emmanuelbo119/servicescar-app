import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ReservationPage from './pages/ReservationPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RegisterPage from './pages/RegisterPage';
import UserVehicles from './pages/UserVehicles';
import ContactForm from './pages/ContactForm';
import TurnosUserPage from './pages/TurnosUserPage';
import AboutUs from './pages/AboutUs';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(
        () => localStorage.getItem('user') !== null
      );
    
    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(isLoggedIn));
    }, [isLoggedIn]);

    
    const logIn = () => setIsLoggedIn(true);
    
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage onLogin={logIn}/>} />
                <Route path="/home" element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} /> 
                <Route path="*" element={<Navigate to="/login" />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<AboutUs />} />
                <Route path="/reservation" element={isLoggedIn ? <ReservationPage /> : <Navigate to="/login" />} />
                <Route path="/home" element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />} />
                <Route path="/userVehiculos" element={isLoggedIn ? <UserVehicles /> : <Navigate to="/login" />} />
                <Route path="/contact" element={isLoggedIn ? <ContactForm /> : <Navigate to="/login" />} />
                <Route path="/turnos" element={<TurnosUserPage />} />
            </Routes>
        </Router>
    );
};

export default App;
