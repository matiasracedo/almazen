import React, { useState } from "react";
import { Modal, Button, ButtonToolbar } from "rsuite";
import emailjs from "emailjs-com";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import axios from "axios";
import './ForgottenPassword.scss'
import dotenv from "dotenv";
dotenv.config();

const NewPassword = () => {
  const {
    REACT_APP_YOUR_SERVICE_ID,
    REACT_APP_CONTACTO_FORM_ID,
    REACT_APP_YOUR_USER_ID,
    REACT_APP_URL
  } = process.env;
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const history=useHistory();

  const close = (e) => {
    setShow(false);
  };
  const toggleDrawer = (e) => {
    setShow(true);
  };
  const handleChange=(e)=>{
    setEmail(e.target.value)
  }
  const  sendEmail=(e,password,msg,name)=> {
          e.preventDefault();
          
          emailjs
          .send(
             REACT_APP_YOUR_SERVICE_ID,
             REACT_APP_CONTACTO_FORM_ID,
             {to_mail:email,message:password,message_type:'Esta es tu contraseña provisional:' ,to_name:name, subject:"Envío de contraseña provisional"},
             REACT_APP_YOUR_USER_ID
             )
             .then(
               (result) => {
               
               swal("Exito!", msg, "success");
              },
              (error) => {
                swal(msg)
              }
              );
            }
  const handleSubmit = async(e) => {
    e.preventDefault();
    try{

      const res = await axios.patch(`${REACT_APP_URL}/users/passwordOlvidado`,{confirm:true, email})

      if(res.data.result){
      
        swal('Por favor espere un momento...')
          sendEmail(e,res.data.password,res.data.msg,res.data.name)
          setEmail('')
          setShow(false)
          history.push('/login')
          return 
          }else{
            setShow(false)
            return swal(res.data.msg)
          
          }

    }catch(err){
      console.log(err)
    }
      
    setShow(false);
  };
  return (
    <div className="modal-container">
      <ButtonToolbar>
        <p>
          Olvidaste tu contraseña?{" "}
          <a className="login" onClick={toggleDrawer}>
            {" "}
            Haz click aqui
          </a>
        </p>
      </ButtonToolbar>
      <Modal show={show} onHide={close} autoFocus={true} backdrop="static">
        <Modal.Header>
          <Modal.Title>Envío de contraseña provisional</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form type="submit">
            <div className="Pop-up-email-newPassword">
              <label for="email">Email</label>
              <input
                name="to_email"
                type="email"
                value={email}
                onChange={handleChange}
              />
              <p>
                Te enviaremos un email con un password provisional para que
                puedas iniciar sesión.
              </p>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={!email || !email.includes('@') || !email.includes('.')}
            className="button-guardar"
            type="submit"
            onClick={handleSubmit}
            appearance="primary"
          >
            Enviar email
          </Button>
          <Button
            className="button-cancelar"
            onClick={close}
            appearance="subtle"
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NewPassword;
