import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './TurnosUserPage.css';
import ReservaConfirmadaModal from '../components/ReservaConfirmadaModal';

const TurnosUserPage = () => {
  const [turnos, setTurnos] = useState([]);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const uuidUsuario = localStorage.getItem('uuidUsuario');
    if (uuidUsuario) {
      fetch(`http://localhost:8000/turnos/${uuidUsuario}/turnos`)
        .then(response => response.json())
        .then(data => {
          setTurnos(data);
        })
        .catch(error => {
          console.error('Error fetching turnos:', error);
        });
    }
  }, []);

  const handleTurnoClick = (turno) => {
    setSelectedTurno(turno);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTurno(null);
  };

  return (
    <div className="turnos-container">
      <h1>Mis Turnos Reservados</h1>
      <div className="turnos-list">
        {turnos.map(turno => (
          <div key={turno.uuidTurno} className="turno-card" onClick={() => handleTurnoClick(turno)}>
            <div className="turno-header">
              <h3>{turno.taller_mecanico.nombre}</h3>
              <img src="/images/logo_placeholder.png" alt={turno.taller_mecanico.nombre} className="turno-logo" />
            </div>
            <p><strong>Fecha:</strong> {new Date(turno.fecha).toLocaleDateString()}</p>
            <p><strong>Hora:</strong> {new Date(turno.hora).toLocaleTimeString()}</p>
            <p><strong>Dirección:</strong> {turno.taller_mecanico.direccion}</p>
            <p><strong>Estado:</strong> {turno.estado.nombre}</p>
          </div>
        ))}
      </div>

      {selectedTurno && (
        <ReservaConfirmadaModal
          showModal={showModal}
          setShowModal={setShowModal}
          turnoReservado={selectedTurno}
        />
      )}
    </div>
  );
};

export default TurnosUserPage;
