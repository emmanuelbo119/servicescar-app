import React, { useState, useEffect } from 'react';
import './UserVehicles.css';

const UserVehicles = () => {
  const [vehicles, setVehicles] = useState([]);

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
    <div className="vehicles-container">
      <h1>Mis Vehículos</h1>
      <div className="vehicles-list">
        {vehicles.length === 0 ? (
          <p>No tienes vehículos registrados.</p>
        ) : (
          vehicles.map(vehicle => (
            <div key={vehicle.uuidvehiculo} className="vehicle-card">
              <h2>{`${vehicle.marca.nombre} ${vehicle.modelo.nombre}`}</h2>
              <p><strong>Año:</strong> {vehicle.anio}</p>
              <p><strong>Patente:</strong> {vehicle.patente}</p>
              <p><strong>Color:</strong> {vehicle.color}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserVehicles;
