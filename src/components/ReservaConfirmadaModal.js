import React from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ReservaConfirmadaModal.css'; // Importar el archivo de estilos

const ReservaConfirmadaModal = ({ showModal, setShowModal, turnoReservado }) => {
  return (
    <Container>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
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
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReservaConfirmadaModal;
