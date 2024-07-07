import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './CreateTurnoModal.css';

const CreateTurnoModal = ({ showModal, handleClose, shop, setTurnoData }) => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [intervalo, setIntervalo] = useState('');
  const [cupo, setCupo] = useState(1);

  const handleCreateTurno = () => {
    const url = `http://localhost:8000/turnos/CrearTurnos?tallermecanico_id=${shop.uuidTallermecanico}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&horaInicio=${horaInicio}&horaFin=${horaFin}&intervalo=${intervalo}&cupo=${cupo}`;
    fetch(url, { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        setTurnoData({ fechaInicio, fechaFin, horaInicio, horaFin, intervalo });
        handleClose();
      })
      .catch(error => console.error('Error creating turno:', error));
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Turno en {shop.nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Fecha Inicio</Form.Label>
            <Form.Control type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Fecha Fin</Form.Label>
            <Form.Control type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Hora Inicio</Form.Label>
            <Form.Control type="time" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Hora Fin</Form.Label>
            <Form.Control type="time" value={horaFin} onChange={e => setHoraFin(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Intervalo (minutos)</Form.Label>
            <Form.Control type="number" value={intervalo} onChange={e => setIntervalo(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Cupo</Form.Label>
            <Form.Control type="number" value={cupo} onChange={e => setCupo(e.target.value)} min="1" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleCreateTurno}>Crear Turno</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateTurnoModal;
