import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ReservationPage.css';
import ReservaConfirmadaModal from '../components/ReservaConfirmadaModal';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import incluirTrasladoPaso1 from '../assets/incluir_retiro_paso1.png';
import incluirTrasladoPaso2 from '../assets/incluir_retiro_paso2.png';
import incluirTrasladoPaso3 from '../assets/incluir_retiro_paso3.png';

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

  const [includeTowService, setIncludeTowService] = useState(false);
  const [showTowServicePopup, setShowTowServicePopup] = useState(false);
  const [towService, setTowService] = useState('');
  const [currentLocation, setCurrentLocation] = useState({ lat: null, lng: null });

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
      fetch(`http://localhost:8000/marcas_vehiculos/${newVehicle.marca}/modelos/`)
        .then(response => response.json())
        .then(data => {
          setModelos(data);
        })
        .catch(error => {
          console.error('Error fetching modelos:', error);
        });
    }
  }, [newVehicle.marca]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          showMap(latitude, longitude);
        },
        () => {
          console.error('Error getting current location');
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const showMap = (lat, lng) => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat, lng },
      zoom: 15
    });

    new window.google.maps.Marker({
      position: { lat, lng },
      map,
      title: 'Ubicación Actual'
    });
  };

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
    const uuidUsuario = localStorage.getItem('uuidUsuario');
    const availableTimesForSelectedDate = availableTimes[selectedDate.toISOString().split('T')[0]] || [];
    const selectedTurno = availableTimesForSelectedDate.find(t => t.time === selectedTime);

    if (selectedTurno) {
      const { uuidTurno } = selectedTurno;
      fetch(`http://localhost:8000/turnos/${uuidTurno}/reservar?vehiculo_id=${selectedVehicle}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
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
    const uuidUsuario = localStorage.getItem('uuidUsuario');
    const newVehicleData = {
      ...newVehicle,
      usuario_id: uuidUsuario,
      marca_id: newVehicle.marca,
      modelo_id: newVehicle.modelo,
      fechaCreacion: new Date().toISOString(),
      fechaModificacion: new Date().toISOString()
    };
    fetch('http://localhost:8000/vehiculos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newVehicleData)
    })
      .then(response => response.json())
      .then(data => {
        setVehicles(prevState => [...prevState, data]);
        setShowVehicleModal(false);
        window.location.reload();
        setNewVehicle({
          marca: '',
          modelo: '',
          anio: '',
          patente: '',
          color: ''
        });
      })
      .catch(error => {
        console.error('Error creating vehicle:', error);
      });
  };

  const handleIncludeTowServiceChange = (e) => {
    setShowTowServicePopup(true);
    setIncludeTowService(e.target.checked);
  };

  const handleTowServicePopupClose = () => {
    setShowTowServicePopup(false);
    setIncludeTowService(true);
    getCurrentLocation();
  };

  const availableTimesForSelectedDate = availableTimes[selectedDate.toISOString().split('T')[0]] || [];

  return (
    <div className="reservation-container">
      <Navbar />
      <div className="form-container">
        <h1>Reserva tu Turno</h1>
        <div className='principa-div'>
          <h5>Elige el mejor momento para cuidar tu auto</h5>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mis Vehículos</label>
            <div className="d-flex align-items-center">
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
            <label className='textoFecha'>Fecha</label>
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

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={includeTowService}
                onChange={handleIncludeTowServiceChange}
              />
              Incluir traslado
            </label>
          </div>
          {includeTowService && (
            <>
              <div id="map" style={{ width: '100%', height: '400px', marginTop: '20px' }}></div>
            </>
          )}

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
                    <option key={marca.uuidmarcavehiculo} value={marca.uuidmarcavehiculo}>
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
                    <option key={modelo.uuidmodelovehiculo} value={modelo.uuidmodelovehiculo}>
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

      {showTowServicePopup && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowTowServicePopup(false)}>&times;</span>
            <h2>Servicio de Traslado</h2>
            <div className="tow-service-step">
              <p>Paso 1: Retiramos tu vehiculo desde la ubicación de tu preferencia</p>
              <img src={incluirTrasladoPaso1} alt="Paso 1" />
            </div>
            <div className="tow-service-step">
              <p>Paso 2: Realizamos el mantenimiento que tu vehiculo necesita</p>
              <img src={incluirTrasladoPaso2} alt="Paso 2" />
            </div>
            <div className="tow-service-step">
              <p>Paso 3: Trasladamos de nuevo tu vehiculo para que no tengas que moverte de tu casa</p>
              <img src={incluirTrasladoPaso3} alt="Paso 3" />
            </div>
            <button className="confirm-button" onClick={handleTowServicePopupClose}>Aceptar</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default ReservationPage;
