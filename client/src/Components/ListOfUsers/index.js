import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, removeUser } from "../../redux/actions/actions.js";
import jwt from "jsonwebtoken";
import UserPromote from "./UserPromote";
import swal from "sweetalert";

const ListOfUsers = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const admin = jwt.decode(window.localStorage.getItem("token"));

  const handleRemove = (e) => {
    e.preventDefault();
    let id = e.target.value;
    swal({
      title: "¿Estas seguro que deseas borrar este usuario?",
      text: "Este usuario se borrará de la pagina",
      icon: "warning",
      buttons: ["No, hoy me siento piadoso!", "Sí, se lo merece!"],
      dangerMode: true,
    }).then(function (isConfirm) {
      if (isConfirm) {
        swal({
          title: "Borrado!",
          text: "Este usuario no volverá a ser visto por aqui!",
          icon: "success",
        }).then(function () {
          dispatch(removeUser(id));
        });
      } else {
        swal("Cancelado", "Hoy se salvó este usuario :)", "error");
      }
    });
  };

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  return (
    <div className="listContainer">
      <h1 className="titulo">Lista de Usuarios</h1>
      <table className="tabla">
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rango</th>
          <th>Eliminar</th>
        </tr>
        {users[0] &&
          users.map((user) => {
            if (user.id !== admin.id) {
              return (
                <tr className="tabla__users">
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <UserPromote user={user} />
                  </td>
                  <td>
                    <button
                      value={user.id}
                      onClick={(e) => {
                        handleRemove(e);
                      }}
                    >
                      X
                    </button>
                  </td>
                </tr>
              );
            } else return null;
          })}
      </table>
    </div>
  );
};
export default ListOfUsers;
