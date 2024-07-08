import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './TurnoDetailModal.css';

const TurnoDetailModal = ({ show, onHide, onSave, turnoId, detail, isEditing }) => {
  const [type, setType] = useState('');
  const [concepts, setConcepts] = useState([]);
  const [selectedConcept, setSelectedConcept] = useState('');
  const [selectedConceptData, setSelectedConceptData] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (detail) {
      setType(detail.tipo_concepto || '');
      setSelectedConcept(detail.descripcion || '');
      setQuantity(detail.cantidad || 1);
    } else {
      setType('');
      setSelectedConcept('');
      setQuantity(1);
    }
  }, [detail]);

  useEffect(() => {
    if (type) {
      fetch(`http://localhost:8000/mantenimientos/conceptos-detalles?tipo=${encodeURIComponent(type)}`)
        .then(response => response.json())
        .then(data => setConcepts(data))
        .catch(error => console.error('Error fetching concepts:', error));
    }
  }, [type]);

  useEffect(() => {
    if (selectedConcept) {
      const conceptData = concepts.find(concept => concept.descripcion === selectedConcept);
      setSelectedConceptData(conceptData);
    } else {
      setSelectedConceptData(null);
    }
  }, [selectedConcept, concepts]);

  const handleSave = () => {
    const conceptoId = selectedConceptData.uuidConcepto;
    const cantidad = type === 'Repuesto' ? quantity : 1;

    fetch(`http://localhost:8000/mantenimientos/turnos/${turnoId}/detalles/${conceptoId}?cantidad=${cantidad}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then(response => response.json())
      .then(data => {
        onSave(data);
        onHide();
        window.location.reload();
      })
      .catch(error => console.error('Error saving detail:', error));
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Editar Detalle' : 'Agregar Detalle'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formType">
            <Form.Label>Tipo de Detalle</Form.Label>
            <Form.Control
              as="select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Seleccione un tipo</option>
              <option value="Tarea Manual">Tarea Manual</option>
              <option value="Repuesto">Repuesto</option>
            </Form.Control>
          </Form.Group>
          {type && (
            <Form.Group controlId="formConcept">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="select"
                value={selectedConcept}
                onChange={(e) => setSelectedConcept(e.target.value)}
              >
                <option value="">Seleccione una descripción</option>
                {concepts.map(concept => (
                  <option key={concept.descripcion} value={concept.descripcion}>
                    {concept.descripcion}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          )}
          {selectedConceptData && (
            <div>
              <p><strong>Costo:</strong> {selectedConceptData.costo}</p>
              {type === 'Repuesto' && (
                <Form.Group controlId="formQuantity">
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    as="select"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  >
                    {[...Array(10).keys()].map(n => (
                      <option key={n + 1} value={n + 1}>
                        {n + 1}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              )}
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TurnoDetailModal;
