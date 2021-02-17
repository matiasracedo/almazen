import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal ,Button,ButtonToolbar, } from 'rsuite';
import swal from 'sweetalert';
import axios from 'axios';
import { addDataUser } from "../../../../redux/actions/actions";
import './EditProfile.scss'
import dotenv from 'dotenv'
dotenv.config()

const EditProfile= ()=> {
  const {REACT_APP_URL} = process.env
  const [show, setShow] = useState(false);
  const [input, setInput] = useState({
    name: "",
    email: "",
    address: "",
  });
  const dispatch=useDispatch();
const dataUser = useSelector((state) => state.dataUser);
   useEffect(()=>{
     setInput({
       name: dataUser && dataUser.name || "",
       email: dataUser && dataUser.email || "",
       address: dataUser && dataUser.address || "",
     });
   },[])

  const close = (e) => {
    setShow(false);
  };
  const toggleDrawer = (e) => {
    setShow(true);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };
 const handleSubmit =(e)=>{
   e.preventDefault();
   if(input.name && input.email){
     try {       
     let {id}=dataUser
     let token = window.localStorage.getItem("token")
     axios
       .put(`${REACT_APP_URL}/users/${id}`, input, {headers:{Authorization:`Bearer ${token}`}})
       .then((res) => res.data)
       .then((resdata) => {
         if (resdata.result) {
           dispatch(addDataUser(resdata.user[0]))
           return swal(`¡Tus datos han sido guardados exitosamente!`);
          } else return swal('Error',"No se pudo actualizar tu perfil, lo siento... Puede que estes intentando usar un correo ya ocupado en nuestra pagina", 'error');
        });
      } catch (error) {
        swal("Ups! Surgio un problema");
      }
    }else {
      swal('Por favor verifica los datos ingresados!')
    }
    setShow(false);
 }
  return (
    <div>
      <ButtonToolbar>
        <Button onClick={toggleDrawer}>Editar Perfil</Button>
      </ButtonToolbar>
      <Modal show={show} onHide={close}>
        <Modal.Header>
          <Modal.Title>Editar Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form type="submit">

          <div className="Pop-up">
            <label for="name">Nombre</label>
            <input
              name="name"
              type="name"
              value={input.name}
              onChange={handleChange}
              />
           {window.localStorage.getItem('Google')? <><label for="email">Email</label>
            <input
              name="email"
              type="email"
              disabled
              value={input.email}
              onChange={handleChange}
              /></>:<><label for="email">Email</label>
            <input
              name="email"
              type="email"
              value={input.email}
              onChange={handleChange}
              /></>}
            <label for="address">Dirección</label>
            <textarea
              name="address"
              type="address"
              value={input.address}
              onChange={handleChange}
              />
          </div>
              </form>
        </Modal.Body>
        <Modal.Footer>
          <Button className='button-guardar' type="submit" onClick={handleSubmit} appearance="primary">
            Guardar cambios
          </Button>
          <Button className='button-cancelar' onClick={close} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}


export default EditProfile;

