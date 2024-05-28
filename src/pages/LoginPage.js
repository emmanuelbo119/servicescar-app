import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import './LoginPage.css';
import loginIMG from '../assets/loginIMG.jpg';

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            onLogin()
            navigate("/home")
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-image" style={{ backgroundImage: `url(${loginIMG})` }}></div>
                <div className="login-form">
                    <h2><span style={{ color: '#6c63ff' }}>ServiceCar</span></h2>
                    <p>Cuida lo importante, de tu auto, nos encargamos nosotros</p>
                    
                    <form onSubmit={handleSubmit} >
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {error && <div>{error}</div>}
                        <button type="submit" >Log in</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
