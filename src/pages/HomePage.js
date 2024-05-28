import React from 'react';
import { FaCar, FaHistory, FaPhone, FaTruck } from 'react-icons/fa';
import { Carousel } from 'react-bootstrap';
import './HomePage.css';

const HomePage = () => {
    const services = [
        { id: 1, name: 'Mis Vehiculos', description: 'Ver Todos', icon: <FaCar /> },
        { id: 2, name: 'Mis Turnos', description: 'Ver todos los turnos históricos', icon: <FaHistory />, link: '/reservation' },
        { id: 3, name: 'Contáctanos', description: 'Asesor en línea 24 hs', icon: <FaPhone /> },
        { id: 4, name: 'Servicio de Grua', description: 'Traslado de vehículos', icon: <FaTruck /> },
    ];

    return (
        <div className="container">
            <nav className="navbar">
                <h1>ServiceCar</h1>
                <div className="nav-links">
                    <a href="/home">Home</a>
                    <a href="/services">Servicios</a>
                    <a href="/reservation">Turnos</a>
                    <a href="/profile">Perfil</a>
                    <a href="/logout">Logout</a>
                </div>
            </nav>
            <div className="welcome-section">
                <h2>Bienvenido a ServiceCar</h2>
                <p>Administra y solicita turnos de servicio de mantenimiento de manera fácil y rápida.</p>
            </div>
            <div className="services-list">
                {services.map((service) => (
                    <div key={service.id} className="service-card">
                        <div className="service-icon">{service.icon}</div>
                        <h3>{service.name}</h3>
                        <p>{service.description}</p>
                    </div>
                ))}
            </div>
            <div className="carousel-section">
                <Carousel>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="/images/carrucel1.webp"
                            alt="First slide"
                        />
                        <Carousel.Caption>
                            <h3>Servicio Agil </h3>
                            <p>Nuestros mecanicos estan capacitados para realizar el mantenimiento de tu vehiculo lo más rapido posible.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="/images/carrucel2.webp"
                            alt="Second slide"
                        />
                        <Carousel.Caption>
                            <h3>Soporte Inmediato</h3>
                            <p>Nuestros agentes estan disponibles 24 hs para acercarte todo lo que necesites.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="/images/carrucel3.webp"
                            alt="Third slide"
                        />
                        <Carousel.Caption>
                            <h3>Servicio Especializado</h3>
                            <p>Contamos con los mejores equipos de ultima tecnología</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
        </div>
    );
};

export default HomePage;
