import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CreateTurnoModal from '../components/CreateTurnoModal';
import './MechanicShopsPage.css';

const MechanicShopsPage = () => {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [turnoData, setTurnoData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/tallerMecanico/')
      .then(response => response.json())
      .then(data => setShops(data))
      .catch(error => console.error('Error fetching mechanic shops:', error));
  }, []);

  const handleCreateTurno = (shop) => {
    setSelectedShop(shop);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedShop(null);
  };

  return (
    <div className="container">
      <Navbar />
      <div className="shops-container">
        <h1>Talleres Mecánicos Disponibles</h1>
        <div className="shops-list">
          {shops.map(shop => (
            <div key={shop.uuidTallermecanico} className="shop-card">
              <h3>{shop.nombre}</h3>
              <p><strong>Dirección:</strong> {shop.direccion}</p>
              <p><strong>Horario de Atención:</strong> {shop.horarioAtencion}</p>
              <p><strong>Servicios:</strong> {shop.servicios}</p>
              <button onClick={() => handleCreateTurno(shop)}>Crear Turno</button>
            </div>
          ))}
        </div>
      </div>
      {selectedShop && (
        <CreateTurnoModal 
          showModal={showModal} 
          handleClose={handleModalClose} 
          shop={selectedShop} 
          setTurnoData={setTurnoData}
        />
      )}
      {turnoData && (
        <div className="turno-result">
          <h2>Turnos Disponibles</h2>
          <p><strong>Fecha Desde:</strong> {turnoData.fechaInicio}</p>
          <p><strong>Fecha Hasta:</strong> {turnoData.fechaFin}</p>
          <p><strong>Horario Desde:</strong> {turnoData.horaInicio}</p>
          <p><strong>Horario Hasta:</strong> {turnoData.horaFin}</p>
          <p><strong>Duración:</strong> {turnoData.intervalo} minutos</p>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MechanicShopsPage;
