import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/home" className="navbar-title-link">
                <h1 className="navbar-title">ServiceCar</h1>
            </Link>
            <div className="nav-links">
                <Link to="/CreateTurno">Taller Mecánico</Link>
                <Link to="/reservation">Turnos</Link>
                <Link to="/about">Sobre Nosotros</Link>
                <Link to="/logout">Salir</Link>
            </div>
        </nav>
    );
};

export default Navbar;
