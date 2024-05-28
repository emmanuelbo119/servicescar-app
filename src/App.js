import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ReservationPage from './pages/ReservationPage';
import 'bootstrap/dist/css/bootstrap.min.css';



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
                <Route path="*" element={<Navigate to="/login" />} />
                <Route path="/reservation" element={isLoggedIn ? <ReservationPage /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
