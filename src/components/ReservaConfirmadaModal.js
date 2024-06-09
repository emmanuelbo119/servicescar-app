import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './ReservaConfirmadaModal.css';

const ReservaConfirmadaModal = ({ showModal, setShowModal, turnoReservado }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    setShowModal(false);
    //navigate('/home');
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-check-circle" style={{ color: 'green' }}></i> Reserva Confirmada
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {turnoReservado && (
          <>
            <p><i className="fas fa-calendar-alt"></i> <strong>Fecha:</strong> {new Date(turnoReservado.fecha).toLocaleDateString()}</p>
            <p><i className="fas fa-clock"></i> <strong>Hora:</strong> {new Date(turnoReservado.hora).toLocaleTimeString()}</p>
            <p><i className="fas fa-warehouse"></i> <strong>Taller Mecánico:</strong> {turnoReservado.taller_mecanico.nombre}</p>
            <p><i className="fas fa-map-marker-alt"></i> <strong>Dirección:</strong> {turnoReservado.taller_mecanico.direccion}</p>
            {turnoReservado.vehiculos && turnoReservado.vehiculos.length > 0 && (
              <div>
                <h5>Datos del Vehículo</h5>
                {turnoReservado.vehiculos.map((vehiculo, index) => (
                  <div key={index}>
                    <p><i className="fas fa-car"></i> <strong>Marca:</strong> {vehiculo.marca.nombre}</p>
                    <p><i className="fas fa-car-side"></i> <strong>Modelo:</strong> {vehiculo.modelo.nombre}</p>
                    <p><i className="fas fa-id-card"></i> <strong>Patente:</strong> {vehiculo.patente}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReservaConfirmadaModal;
