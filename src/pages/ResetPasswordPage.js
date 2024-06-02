import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResetPasswordPage.css';
import resetPasswordIMG from '../assets/loginIMG.jpg';  // Usa la misma imagen del login para consistencia

const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/users/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    new_password: newPassword,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to reset password');
            }

            const data = await response.json();
            setMessage(data.msg);
            setTimeout(() => {
                navigate("/login");
            }, 3000); // Redirigir a la página de login después de 3 segundos
        } catch (error) {
            setMessage('Error resetting password');
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                <div className="reset-password-image" style={{ backgroundImage: `url(${resetPasswordIMG})` }}></div>
                <div className="reset-password-form">
                    <h2>Restablecer Contraseña</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Nueva Contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Enviar</button>
                    </form>
                    {message && <div>{message}</div>}
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
