import React from 'react';
import { FaCar, FaHistory, FaPhone, FaTruck } from 'react-icons/fa';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './HomePage.css';

const HomePage = () => {
    const services = [
        { id: 1, name: 'Mis Vehiculos', description: 'Ver Todos', icon: <FaCar />, link: '/userVehiculos' },
        { id: 2, name: 'Mis Turnos', description: 'Ver todos los turnos históricos', icon: <FaHistory />, link: '/turnos' },
        { id: 3, name: 'Contáctanos', description: 'Asesor en línea 24 hs', icon: <FaPhone />, link: '/contact' },
        { id: 4, name: 'Servicio de Grua', description: 'Traslado de vehículos', icon: <FaTruck />, link: '/tow-service' },
    ];

    return (
        <div className="container">
            <Navbar />
            <div className="welcome-section">
                <h2>Bienvenido a ServiceCar</h2>
                <p>Administra y solicita turnos de servicio de mantenimiento de manera fácil y rápida.</p>
            </div>
            <div className="services-list">
                {services.map((service) => (
                    <div key={service.id} className="service-card">
                        <div className="service-icon">{service.icon}</div>
                        <h3>{service.name}</h3>
                        <Link className='link-card' to={service.link}>
                            <p>{service.description}</p>
                        </Link>
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
                            <h3>Servicio Ágil</h3>
                            <p>Nuestros mecánicos están capacitados para realizar el mantenimiento de tu vehículo lo más rápido posible.</p>
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
                            <p>Nuestros agentes están disponibles 24 hs para acercarte todo lo que necesites.</p>
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
                            <p>Contamos con los mejores equipos de última tecnología.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;
