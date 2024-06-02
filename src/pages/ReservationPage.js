import React, { useState, useEffect } from 'react';
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
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [newVehicle, setNewVehicle] = useState({
    marca: '',
    modelo: '',
    anio: '',
    patente: '',
    color: ''
  });

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
    fetch('http://localhost:8000/marcas_vehiculos/?skip=0&limit=10')
      .then(response => response.json())
      .then(data => {
        setMarcas(data);
      })
      .catch(error => {
        console.error('Error fetching marcas:', error);
      });
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

  useEffect(() => {
    if (newVehicle.marca) {
      fetch(`http://localhost:8000/marcas_vehiculos/modelos/?marca=${newVehicle.marca}`)
        .then(response => response.json())
        .then(data => {
          setModelos(data);
        })
        .catch(error => {
          console.error('Error fetching modelos:', error);
        });
    }
  }, [newVehicle.marca]);

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

  const handleNewVehicleChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleNewVehicleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/vehiculos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newVehicle)
    })
      .then(response => response.json())
      .then(data => {
        setVehicles(prevState => [...prevState, data]);
        setShowVehicleModal(false);
      })
      .catch(error => {
        console.error('Error creating vehicle:', error);
      });
  };

  const availableTimesForSelectedDate = availableTimes[selectedDate.toISOString().split('T')[0]] || [];

  return (
    <div className="reservation-container">
      <div className="form-container">
        <h1>Reserva tu Turno</h1>
        <p>Elige el mejor momento para cuidar tu auto</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mis Vehículos</label>
            <div className="d-flex">
              <select value={selectedVehicle} onChange={handleVehicleChange} required>
                <option value="">Selecciona tu vehículo</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.uuidvehiculo} value={vehicle.uuidvehiculo}>
                    {`${vehicle.marca.nombre} - ${vehicle.modelo.nombre} -  ${vehicle.anio} - ${vehicle.patente}`}
                  </option>
                ))}
              </select>
              <button type="button" className="add-vehicle-button" onClick={() => setShowVehicleModal(true)}>+</button>
            </div>
          </div>

          <div className="form-group">
            <label>Taller Mecánico</label>
            <select value={selectedWorkshop} onChange={handleWorkshopChange} required>
              <option value="">Selecciona el taller mecánico</option>
              {workshops.map(workshop => (
                <option key={workshop.uuidTallermecanico} value={workshop.uuidTallermecanico}>{`${workshop.nombre} - ${workshop.servicios}`}</option>
              ))}
            </select>
          </div>

          <div className="date-picker-wrapper">
            <label>Fecha</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              className="form-control date-picker"
              minDate={new Date()}
              includeDates={availableDates}
              required
            />
          </div>

          <div className="form-group">
            <label>Hora</label>
            <select value={selectedTime} onChange={handleTimeChange} required>
              <option value="">Selecciona la hora</option>
              {availableTimesForSelectedDate.map((turno, index) => (
                <option key={index} value={turno.time}>{turno.time}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="confirm-button">Confirmar Reserva</button>
        </form>
      </div>

      <ReservaConfirmadaModal
        showModal={showModal}
        setShowModal={setShowModal}
        turnoReservado={turnoReservado}
      />

      {showVehicleModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowVehicleModal(false)}>&times;</span>
            <h2>Crear Nuevo Vehículo</h2>
            <form onSubmit={handleNewVehicleSubmit}>
              <div className="form-group">
                <label>Marca</label>
                <select name="marca" value={newVehicle.marca} onChange={handleNewVehicleChange} required>
                  <option value="">Selecciona la marca</option>
                  {marcas.map(marca => (
                    <option key={marca.uuidMarca} value={marca.uuidMarca}>
                      {marca.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Modelo</label>
                <select name="modelo" value={newVehicle.modelo} onChange={handleNewVehicleChange} required>
                  <option value="">Selecciona el modelo</option>
                  {modelos.map(modelo => (
                    <option key={modelo.uuidModelo} value={modelo.uuidModelo}>
                      {modelo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Año</label>
                <select name="anio" value={newVehicle.anio} onChange={handleNewVehicleChange} required>
                  {Array.from(new Array(30), (v, i) => (
                    <option key={i} value={2024 - i}>{2024 - i}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Patente</label>
                <input type="text" name="patente" value={newVehicle.patente} onChange={handleNewVehicleChange} required />
              </div>

              <div className="form-group">
                <label>Color</label>
                <input type="text" name="color" value={newVehicle.color} onChange={handleNewVehicleChange} required />
              </div>

              <button type="submit" className="confirm-button">Crear Vehículo</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReservationPage;
