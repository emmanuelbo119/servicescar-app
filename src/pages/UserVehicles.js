import React, { useState, useEffect } from 'react';
import './UserVehicles.css';

const UserVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const brandIcons = {
    'Ford': '/icons/ford.png',
    'Chevrolet': '/icons/chevrolet.png',
    'Toyota': '/icons/toyota.png',
    'Volkswagen': '/icons/volkswagen.png',
    'Renault': '/icons/renault.png',
    'Peugeot': '/icons/peugeot.png',
    'Fiat': '/icons/fiat.png',
    'Citroën': '/icons/citroen.png',
    'Nissan': '/icons/nissan.png',
    'Honda': '/icons/honda.png'
    // Añadir más marcas e iconos según sea necesario
  };

  useEffect(() => {
    const uuidUsuario = localStorage.getItem('uuidUsuario');
    
    if (uuidUsuario) {
      fetch(`http://localhost:8000/vehiculos/${uuidUsuario}/vehiculos`)
        .then(response => response.json())
        .then(data => {
          setVehicles(data);
        })
        .catch(error => {
          console.error('Error fetching vehicles:', error);
        });
    }
  }, []);

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
      <div className="vehicles-container">
        <h1>Mis Vehículos</h1>
        <div className="vehicles-list">
          {vehicles.length === 0 ? (
            <p>No tienes vehículos registrados.</p>
          ) : (
            vehicles.map(vehicle => (
              <div key={vehicle.uuidvehiculo} className="vehicle-card">
                <div className="vehicle-info">
                  <h2>{`${vehicle.marca.nombre} ${vehicle.modelo.nombre}`}</h2>
                  <p><strong>Año:</strong> {vehicle.anio}</p>
                  <p><strong>Patente:</strong> {vehicle.patente}</p>
                  <p><strong>Color:</strong> {vehicle.color}</p>
                  <button className="edit-button">Editar</button>
                </div>
                {brandIcons[vehicle.marca.nombre] && (
                  <img src={brandIcons[vehicle.marca.nombre]} alt={vehicle.marca.nombre} className="brand-icon" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserVehicles;
