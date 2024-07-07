import React, { useState } from 'react';
import './ContactForm.css';
import contactIMG from '../assets/contactIMG.webp';
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario enviado:', formData);
    setShowModal(true);
  };

  return (
    <div className="contact-container">
      <div className="contact-card">
        <div className="contact-image" style={{ backgroundImage: `url(${contactIMG})` }}></div>
        <div className="form-container">
          <h1>Contactar Soporte Técnico</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Mensaje</label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                required 
              />
            </div>
            <button type="submit" className="confirm-button">Enviar</button>
          </form>
        </div>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2>Mensaje Enviado</h2>
            <p>Gracias por contactarnos. Nos pondremos en contacto contigo lo antes posible.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactForm;
