import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, ButtonToolbar } from "rsuite";
import { useHistory } from "react-router-dom";
import { ADD_DATA_USER } from "../../../../redux/constants/constantes";
import swal from "sweetalert";
import axios from "axios";
import "./PasswordReset.scss";
import dotenv from 'dotenv';
dotenv.config()

const PasswordReset = () => {
  const {REACT_APP_URL} = process.env
  const [show, setShow] = useState(false);
  const [contra, setContra] = useState({
    password: "",
    confirmPassword: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState({});

  const validate = (input) => {
    let errors = {};
    if (
      !/(?=.*[0-9])/.test(input.confirmPassword) ||
      input.confirmPassword.length < 6
    ) {
      errors.confirmPassword =
        "La contraseña debe tener mas de 6 caracteres y un numero";
    } else if (input.newPassword !== input.confirmPassword) {
      errors.newPassword = "Las contraseñas tienen que coincidir";
    }
    return errors;
  };
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.dataUser);
  const close = (e) => {
    setShow(false);
  };
  const toggleDrawer = (e) => {
    setShow(true);
  };

  const handleChangePass = (e) => {
    e.preventDefault();
    setContra({
      ...contra,
      [e.target.name]: e.target.value,
    });
     setErrors(
       validate({
         ...contra,
         [e.target.name]: e.target.value,
       })
     );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (contra.confirmPassword === contra.newPassword) {
      try {
        let { id } = user;
        let token = window.localStorage.getItem("token");
        axios
          .put(`${REACT_APP_URL}/users/password/${id}`, contra, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => res.data)
          .then((resdata) => {
            if (resdata.result) {
              window.localStorage.removeItem("token");
              dispatch({ type: ADD_DATA_USER, payload: null });
              history.push("/login");

              return swal(
                resdata.msg,
                "Por favor vuelve a iniciar sesión",
                "success"
              );
            } else {
              return swal(resdata.msg);
            }
          });
      } catch (err) {
        console.log(err);
      }
    } else {
      swal("¡Los campos de nueva contraseña deben coincidir!");
    }
    setShow(false);
  };
  return (
    <div className="modal-container">
      <ButtonToolbar>
        <Button onClick={toggleDrawer}>Cambiar contraseña</Button>
      </ButtonToolbar>
      <Modal show={show} onHide={close} autoFocus={true} backdrop="static">
        <Modal.Header>
          <Modal.Title>Cambiar contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form type="submit">
            <div className="Pop-up-passwords">
              <label for="password">Contraseña actual</label>
              <input
                name="password"
                type="password"
                value={contra.password}
                onChange={handleChangePass}
              />
              <label for="confirmPassword">Nueva contraseña</label>
              <input
                name="confirmPassword"
                type="password"
                onChange={handleChangePass}
              />
              {errors.confirmPassword ? <p>{errors.confirmPassword}</p> : null}
              <label for="newPassword">Confirma tu nueva contraseña</label>
              <input
                name="newPassword"
                type="password"
                onChange={handleChangePass}
              />
              {errors.newPassword ? <p>{errors.newPassword}</p> : null}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={errors.newPassword || errors.confirmPassword}
            className="button-guardar"
            type="submit"
            onClick={handleSubmit}
            appearance="primary"
          >
            Guardar cambios
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

export default PasswordReset;
