import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { getAllUsers } from "../../../redux/actions/actions.js";
import swal from "sweetalert";
import dotenv from "dotenv";
dotenv.config()

const UserPromote = (props) => {
  const {REACT_APP_URL} = process.env
  const { id, isAdmin } = props.user;
  let rango;
  /* REDUX */
  const dispatch = useDispatch();
  /* States */
  const [estado, setEstado] = useState(isAdmin);
  /* Handlers */
  const handleChange = (e) => {
    setEstado(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAdmin) {
      rango = "Admin";
    } else {
      rango = "Usuario";
    }
    if (estado === isAdmin) {
      return swal(`Este usuario ya es ${rango}`);
    } else {
      const token = window.localStorage.getItem("token");
      try {
        axios
          .post(
            `${REACT_APP_URL}/auth/promote/${id}`,
            { isAdmin: estado },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then((res) => {
            if (res.data.result) {
              swal("Exito", `${res.data.msg}`, "success");
              dispatch(getAllUsers());
            } else {
              swal(`${res.data.msg}`);
            }
          });
       
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      {props.children}
      <div>
        <select value={estado} onChange={handleChange}>
          <option value={true}>Admin</option>
          <option value={false}>User</option>
        </select>
      </div>
      <button type="submit">Guardar</button>
    </form>
  );
};
export default UserPromote;
