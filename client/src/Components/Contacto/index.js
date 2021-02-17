import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './Contacto.scss'
import swal from 'sweetalert';
import dotenv from "dotenv";
dotenv.config();
const { REACT_APP_YOUR_SERVICE_ID, REACT_APP_CONTACTO_FORM_ID, REACT_APP_YOUR_USER_ID } = process.env;

const ContactUs = () => {
    const [input, setInput] = useState({
        to_name: "",
        to_mail: "",
        message:"",
        message_type:"Hemos recibido tu consulta, responderemos a la brevedad posible. Tu consulta era:",
        subject:"Recibimos tu consulta"
    })
    let handleChange = (e) => {
        e.preventDefault();
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    function sendEmail (e) {
    e.preventDefault();
    
    swal('Espera un momento por favor')

    try{
      emailjs.send(REACT_APP_YOUR_SERVICE_ID, REACT_APP_CONTACTO_FORM_ID, input, REACT_APP_YOUR_USER_ID)
    .then((result) => { 
      setInput({
        to_name: "",
        to_mail: "",
        message: "",
        message_type:
          "Hemos recibido tu consulta, responderemos a la brevedad posible. Tu consulta era:",
        subject: "Recibimos tu consulta",
      });   
      return swal("Se ha enviado tu consulta!", "Tu consulta será respondida a la brevedad", "success");
    }).catch(err =>{
      
      return swal("Hubo un problema! Por favor vuelve a intentar...");
    })
    
  }catch(err){
    
    swal('Hubo un problema! Por favor vuelve a intentar..')
  }
  }
  
    return (
      <div>
      <form className="contact-form" onSubmit={sendEmail}>
      
        <input type="hidden" name="contact_number" />
        <label>Nombre</label>
        <input
          type="text"
          name="to_name"
          value={input.to_name}
          onChange={handleChange}
          required
        />
        <label>Email</label>
        <input
          type="email"
          name="to_mail"
          value={input.to_mail}
          onChange={handleChange}
          required
        />
        <label>Mensaje</label>
        <textarea name="message" value={input.message} onChange={handleChange} required />
        <input type="submit" className="button" value="Send" />
      </form>
    </div>
  );
}

export default ContactUs;