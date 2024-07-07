import React, { useState, useEffect } from 'react';
import VehicleForm from '../components/VehicleForm';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './UserVehicles.css';

const UserVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
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

  const handleDeleteVehicle = (vehicleId) => {
    fetch(`http://localhost:8000/vehiculos/${vehicleId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        setVehicles(vehicles.filter(vehicle => vehicle.uuidvehiculo !== vehicleId));
      } else {
        console.error('Error deleting vehicle');
      }
    })
    .catch(error => {
      console.error('Error deleting vehicle:', error);
    });
  };

  const handleVehicleCreatedOrUpdated = (vehicle) => {
    setVehicles((prevState) => {
      const existingVehicleIndex = prevState.findIndex(v => v.uuidvehiculo === vehicle.uuidvehiculo);
      if (existingVehicleIndex !== -1) {
        const updatedVehicles = [...prevState];
        updatedVehicles[existingVehicleIndex] = vehicle;
        return updatedVehicles;
      } else {
        return [...prevState, vehicle];
      }
    });
    setShowVehicleModal(false);
    window.location.reload();
  };

  const handleEditVehicle = (vehicle) => {
    setCurrentVehicle(vehicle);
    setShowVehicleModal(true);
  };

  return (
    <div className="container">
      <Navbar />
      <div className="vehicles-container">
        <h1>Mis Vehículos</h1>
        <button className="add-vehicle-button" onClick={() => { setCurrentVehicle(null); setShowVehicleModal(true); }}>Añadir Vehículo</button>
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
                  <div className="buttons-container">
                    <button className="edit-button" onClick={() => handleEditVehicle(vehicle)}>Editar</button>
                    <button className="edit-button" onClick={() => handleDeleteVehicle(vehicle.uuidvehiculo)}>Eliminar</button>
                  </div>
                </div>
                <div className="brand-icon-container">
                  {brandIcons[vehicle.marca.nombre] && (
                    <img src={brandIcons[vehicle.marca.nombre]} alt={vehicle.marca.nombre} className="brand-icon" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {showVehicleModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowVehicleModal(false)}>&times;</span>
            <VehicleForm onVehicleCreatedOrUpdated={handleVehicleCreatedOrUpdated} vehicle={currentVehicle} />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default UserVehicles;
