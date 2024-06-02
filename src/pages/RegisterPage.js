import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';
import registerIMG from '../assets/loginIMG.jpg';
import { login } from '../services/authService';  // Importar la función de login

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        email: '',
        edad: '',
        telefono: '',
        username: '',
        contraseña: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to register');
            }

            const data = await response.json();
            setMessage(data.msg);

            // Loguear automáticamente al usuario después del registro
            await login(formData.email, formData.contraseña);
            navigate("/home");

        } catch (error) {
            setMessage('Error registering user');
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-image" style={{ backgroundImage: `url(${registerIMG})` }}></div>
                <div className="register-form">
                    <h2>Registrarse</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="apellido"
                            placeholder="Apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="dni"
                            placeholder="DNI"
                            value={formData.dni}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="number"
                            name="edad"
                            placeholder="Edad"
                            value={formData.edad}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="telefono"
                            placeholder="Teléfono"
                            value={formData.telefono}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="username"
                            placeholder="Nombre de Usuario"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="contraseña"
                            placeholder="Contraseña"
                            value={formData.contraseña}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit">Registrarse</button>
                    </form>
                    {message && <div>{message}</div>}
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
