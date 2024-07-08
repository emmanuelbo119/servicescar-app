import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TurnoDetailModal from '../components/TurnoDetailModal';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './DetailTurnoPage.css';

const statusColors = {
  'Solicitado': '#FFD700',
  'Confirmado': '#1E90FF',
  'En proceso de presupuesto': '#FFA500',
  'Presupuestado': '#ADFF2F',
  'Cancelado': '#FF4500',
  'En proceso': '#FF8C00',
  'Pausado': '#808080',
  'Completado': '#32CD32'
};

const DetailTurnoPage = () => {
  const { id } = useParams();
  const [turno, setTurno] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/turnos/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setTurno(data[0]);
        } else {
          throw new Error('Turno data is missing');
        }
      })
      .catch(error => console.error('Error fetching turno details:', error));
  }, [id]);

  const handleAddDetail = (turnoId) => {
    fetch(`http://localhost:8000/mantenimientos/turnos/${id}/cambiar-estado-presupuesto?estado=En proceso de presupuesto`, 
      {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      })
    setSelectedDetail(null);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteDetail = (detailId) => {
    fetch(`http://localhost:8000/mantenimientos/turnos/${id}/detalles/${detailId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setTurno(prevTurno => ({
          ...prevTurno,
          detalles: prevTurno.detalles.filter(detail => detail.uuidDetalle !== detailId)
        }));
      })
      .catch(error => console.error('Error deleting detail:', error));
  };

  const handleSaveDetail = (newDetail) => {
    setShowModal(false);
    setTurno(prevTurno => ({
      ...prevTurno,
      detalles: [...prevTurno.detalles, newDetail]
    }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFinalizeBudget = () => {
    setLoading(true);
    fetch(`http://localhost:8000/mantenimientos/turnos/${id}/cambiar-estado-presupuesto?estado=Presupuestado`, 
      {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      })

    fetch(`http://localhost:8000/turnos/${id}/crear_factura`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setLoading(false);
        console.log('Invoice data:', data);
        if (data) {
          setInvoiceUrl(data.invoice_url);
        }
      })
      .catch(error => {
        setLoading(false);
        console.error('Error finalizing budget:', error);
      });
  };

  const handleSimulatePayment = () => {
    fetch(`http://localhost:8000/mantenimientos/turnos/${id}/cambiar-estado-presupuesto?estado=Completado`, 
      {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setIsSimulating(true);
      })
      .catch(error => console.error('Error simulating payment:', error));
  };

  const handlePay = () => {
    if (invoiceUrl) {
      window.open(invoiceUrl, '_blank');
    }
  };

  if (!turno) return <div>Loading...</div>;

  const totalCost = turno.detalles.reduce((acc, detail) => acc + detail.costo_total, 0);

  return (
    <div className="container">
      <Navbar />
      <div className="turno-detail-container">
        <div className="turno-header">
          <div className="info">
            <h2>{turno.taller_mecanico.nombre}</h2>
          </div>
        </div>
        <div className="info2">
          <p><strong>Fecha:</strong> {new Date(turno.fecha).toLocaleDateString()}</p>
          <p><strong>Hora:</strong> {new Date(turno.hora).toLocaleTimeString()}</p>
        </div>
        <div className="info">
          <p><strong>Dirección:</strong> {turno.taller_mecanico.direccion}</p>
        </div>
        <div
          className="status-indicator"
          style={{ backgroundColor: statusColors[turno.estadoMantenimiento?.nombre || 'Solicitado'] }}
        >
          {turno.estadoMantenimiento?.nombre || 'Solicitado'}
        </div>
        <div className="turno-details">
          <div className="details-header">
            <h3>Servicios Realizados</h3>
          </div>
          <table className="detail-table">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {turno.detalles.length > 0 ? (
                turno.detalles.map(detail => (
                  <tr key={detail.uuidDetalle} className="detail-card">
                    <td>{detail.descripcion}</td>
                    <td>{detail.cantidad}</td>
                    <td>{detail.costo_total}</td>
                    <td className="detail-actions">
                      <button onClick={() => handleDeleteDetail(detail.uuidDetalle)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No hay detalles de servicios para este turno.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="total-cost">
            <p><strong>Costo Total del Turno:</strong> ${totalCost}</p>
          </div>
        </div>
        <div className="button-container">
          {!isSimulating && (
            <>
              <button onClick={handleAddDetail}>Agregar Detalle</button>
              <button onClick={handleFinalizeBudget} disabled={loading}>
                {loading ? 'Finalizando...' : 'Finalizar Presupuesto'}
              </button>
            </>
          )}
          {invoiceUrl && (
            <button onClick={handlePay}>Pagar</button>
          )}
          <button onClick={handleSimulatePayment}>Simular Pago</button>
        </div>
      </div>
      <Footer />

      {showModal && (
        <TurnoDetailModal
          show={showModal}
          onHide={handleCloseModal}
          onSave={handleSaveDetail}
          turnoId={id}
          detail={selectedDetail}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default DetailTurnoPage;
