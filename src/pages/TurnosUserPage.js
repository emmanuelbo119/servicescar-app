import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import './TurnosUserPage.css';

const TurnosUserPage = () => {
  const [turnos, setTurnos] = useState([]);
  const [noTurnos, setNoTurnos] = useState(false);
  const navigate = useNavigate();

  const statusColors = {
    'Solicitado': '#FFD700',
    'Confirmado': '#1E90FF',
    'En proceso de presupuesto': '#FFA500',
    'Presupuestado': '#ADFF2F',
    'Cancelado': '#FF4500',
    'En proceso': '#FF8C00',
    'Pausado': '#808080',
    'Completado': '#32CD32',
    'En Progreso': '#FF8C00',  // Agrega otros estados según sea necesario
    'Ocupado': '#FF8C00',     // Agrega otros estados según sea necesario
  };

  useEffect(() => {
    const uuidUsuario = localStorage.getItem('uuidUsuario');
    if (uuidUsuario) {
      fetch(`http://localhost:8000/turnos/${uuidUsuario}/turnos`)
        .then(response => {
          if (response.status === 404) {
            setNoTurnos(true);
            return [];
          }
          return response.json();
        })
        .then(data => {
          setTurnos(data);
        })
        .catch(error => {
          console.error('Error fetching turnos:', error);
        });
    }
  }, []);

  const handleTurnoClick = (turno) => {
    navigate(`/turnos/${turno.uuidTurno}`);
  };

  const handleRedirection = () => {
    navigate('/reservation');
  };

  return (
    <div className="container">
      <Navbar />
      <div className="turnos-container">
        <h1>Mis Turnos Reservados</h1>
        {noTurnos ? (
          <div className="no-turnos-message">
            <p>No se encontraron turnos reservados.</p>
            <button className="redirect-button" onClick={handleRedirection}>Reservar Turno</button>
          </div>
        ) : (
          <div className="turnos-list">
            {turnos.map(turno => (
              <div key={turno.uuidTurno} className="turno-card" onClick={() => handleTurnoClick(turno)}>
                <div className="turno-header">
                  <h3>{turno.taller_mecanico.nombre}</h3>
                  <div
                    className="status-indicator"
                    style={{ backgroundColor: statusColors[turno.estado.nombre || 'Solicitado'] }}
                  >
                    {turno.estado.nombre || 'Solicitado'}
                  </div>
                </div>
                <p><strong>Fecha:</strong> {new Date(turno.fecha).toLocaleDateString()}</p>
                <p><strong>Hora:</strong> {new Date(turno.hora).toLocaleTimeString()}</p>
                <p><strong>Dirección:</strong> {turno.taller_mecanico.direccion}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TurnosUserPage;
