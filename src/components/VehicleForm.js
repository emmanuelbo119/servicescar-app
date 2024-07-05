import React, { useState, useEffect } from 'react';

const VehicleForm = ({ onVehicleCreatedOrUpdated, vehicle }) => {
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [newVehicle, setNewVehicle] = useState({
    marca_id: '',
    modelo_id: '',
    anio: '',
    patente: '',
    color: ''
  });

  useEffect(() => {
    fetch('http://localhost:8000/marcas_vehiculos/?skip=0&limit=10')
      .then(response => response.json())
      .then(data => {
        setMarcas(data);
      })
      .catch(error => {
        console.error('Error fetching marcas:', error);
      });

    if (vehicle) {
      setNewVehicle({
        marca_id: vehicle.marca.uuidmarcavehiculo,
        modelo_id: vehicle.modelo.uuidmodelovehiculo,
        anio: vehicle.anio,
        patente: vehicle.patente,
        color: vehicle.color
      });
    }
  }, [vehicle]);

  useEffect(() => {
    if (newVehicle.marca_id) {
      fetch(`http://localhost:8000/marcas_vehiculos/${newVehicle.marca_id}/modelos/`)
        .then(response => response.json())
        .then(data => {
          setModelos(data);
        })
        .catch(error => {
          console.error('Error fetching modelos:', error);
        });
    }
  }, [newVehicle.marca_id]);

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
      fechaCreacion: vehicle ? vehicle.fechaCreacion : new Date().toISOString(),
      fechaModificacion: new Date().toISOString()
    };

    const url = vehicle ? `http://localhost:8000/vehiculos/${vehicle.uuidvehiculo}` : 'http://localhost:8000/vehiculos';
    const method = vehicle ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newVehicleData)
    })
      .then(response => response.json())
      .then(data => {
        onVehicleCreatedOrUpdated(data);
        setNewVehicle({
          marca_id: '',
          modelo_id: '',
          anio: '',
          patente: '',
          color: ''
        });
      })
      .catch(error => {
        console.error('Error creating or updating vehicle:', error);
      });
  };

  return (
    <div>
      <h2>{vehicle ? 'Editar Vehículo' : 'Crear Nuevo Vehículo'}</h2>
      <form onSubmit={handleNewVehicleSubmit}>
        <div className="form-group">
          <label>Marca</label>
          <select name="marca_id" value={newVehicle.marca_id} onChange={handleNewVehicleChange} required>
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
          <select name="modelo_id" value={newVehicle.modelo_id} onChange={handleNewVehicleChange} required>
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

        <button type="submit" className="confirm-button">{vehicle ? 'Actualizar Vehículo' : 'Crear Vehículo'}</button>
      </form>
    </div>
  );
};

export default VehicleForm;
