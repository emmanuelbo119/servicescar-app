import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ReservationPage.css';
import ReservaConfirmadaModal from '../components/ReservaConfirmadaModal';

function ReservationPage() {
  const [vehicles, setVehicles] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedWorkshop, setSelectedWorkshop] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [turnoReservado, setTurnoReservado] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

      fetch('http://localhost:8000/tallerMecanico/')
        .then(response => response.json())
        .then(data => {
          setWorkshops(data);
        })
        .catch(error => {
          console.error('Error fetching workshops:', error);
        });
    }
  }, []);

  useEffect(() => {
    if (selectedWorkshop) {
      fetch(`http://localhost:8000/tallerMecanico/${selectedWorkshop}/turnosDisponibles`)
        .then(response => response.json())
        .then(data => {
          const dates = data.map(turno => new Date(turno.fecha));
          setAvailableDates(dates);

          const timesByDate = data.reduce((acc, turno) => {
            const date = turno.fecha.split('T')[0];
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push({ time: turno.hora.split('T')[1].substring(0, 5), uuidTurno: turno.uuidTurno });
            return acc;
          }, {});
          
          setAvailableTimes(timesByDate);
        })
        .catch(error => {
          console.error('Error fetching available dates and times:', error);
        });
    }
  }, [selectedWorkshop]);

  const handleVehicleChange = (e) => {
    setSelectedVehicle(e.target.value);
  };

  const handleWorkshopChange = (e) => {
    setSelectedWorkshop(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const availableTimesForSelectedDate = availableTimes[selectedDate.toISOString().split('T')[0]] || [];
    const selectedTurno = availableTimesForSelectedDate.find(t => t.time === selectedTime);

    if (selectedTurno) {
      const { uuidTurno } = selectedTurno;
      fetch(`http://localhost:8000/turnos/${uuidTurno}/reservar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vehicle: selectedVehicle,
          workshop: selectedWorkshop,
          date: selectedDate,
          time: selectedTime
        })
      })
        .then(response => response.json())
        .then(data => {
          setTurnoReservado(data);
          setShowModal(true);
        })
        .catch(error => {
          console.error('Error making reservation:', error);
        });
    } else {
      console.error('No available turno found for selected time');
    }
  };

  const availableTimesForSelectedDate = availableTimes[selectedDate.toISOString().split('T')[0]] || [];

  return (
    <Container className="reservation-container">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <div className="form-container">
            <h1>Reserva tu Turno</h1>
            <p>Elige el mejor momento para cuidar tu auto</p>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formVehicle">
                <Form.Label>Mis Vehículos</Form.Label>
                <Form.Control as="select" value={selectedVehicle} onChange={handleVehicleChange} required>
                  <option value="">Selecciona tu vehículo</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.uuidvehiculo} value={vehicle.uuidvehiculo}>
                      {`${vehicle.marca.nombre} - ${vehicle.modelo.nombre} -  ${vehicle.anio} - ${vehicle.patente}`}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formWorkshop">
                <Form.Label>Taller Mecánico</Form.Label>
                <Form.Control as="select" value={selectedWorkshop} onChange={handleWorkshopChange} required>
                  <option value="">Selecciona el taller mecánico</option>
                  {workshops.map(workshop => (
                    <option key={workshop.uuidTallermecanico} value={workshop.uuidTallermecanico}>{`${workshop.nombre} - ${workshop.servicios}`}</option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formDate">
                <Form.Label>Fecha</Form.Label>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  minDate={new Date()}
                  includeDates={availableDates}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formTime">
                <Form.Label>Hora</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedTime}
                  onChange={handleTimeChange}
                  required
                >
                  <option value="">Selecciona la hora</option>
                  {availableTimesForSelectedDate.map((turno, index) => (
                    <option key={index} value={turno.time}>{turno.time}</option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Button variant="primary" type="submit">
                Confirmar Reserva
              </Button>
            </Form>
          </div>
        </Col>
      </Row>

      <ReservaConfirmadaModal
        showModal={showModal}
        setShowModal={setShowModal}
        turnoReservado={turnoReservado}
      />
    </Container>
  );
}

export default ReservationPage;
