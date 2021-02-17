import React, { useState } from "react";
import "./user.scss";
import axios from "axios";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import dotenv from "dotenv";
dotenv.config();

export const UserRegister = () => {
  const { REACT_APP_URL } = process.env;
  const history = useHistory();
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    } else if (input.password !== input.confirmPassword) {
      errors.password = "Las contraseñas tienen que coincidir";
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setInput({
      name: "",
      email: "",
      confirmPassword: "",
      password: "",
    });
    try {
      if (
        input.password === input.confirmPassword &&
        input.password.length >= 6 &&
        input.confirmPassword
      ) {
        axios
          .post(`${REACT_APP_URL}/users`, input)
          .then((res) => res.data)
          .then((resdata) => {
            if (resdata.result) {
              history.push("/login");
              return swal("Te has registrado exitosamente! Vamos!");
            } else return swal(resdata.msg);
          });
      } else
        return swal(
          "Las contraseñas deben coincidir! o tiene menos de 6 digitos"
        );
    } catch (error) {
      swal("Ups! Surgio un problema");
    }
  };

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
    setErrors(
      validate({
        ...input,
        [e.target.name]: e.target.value,
      })
    );
  };

  return (
    <div className="user">
      <form className="user__form" onSubmit={handleSubmit}>
        <h1 className="titulo titulo-shadow">Registro de Usuario</h1>
        <div>
          <label for="name" className="label">
            <svg
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
            >
              <path
                clip-rule="evenodd"
                d="M10.5 3.498a2.999 2.999 0 01-3 2.998 2.999 2.999 0 113-2.998zm2 10.992h-10v-1.996a3 3 0 013-3h4a3 3 0 013 3v1.997z"
                stroke="currentColor"
                stroke-linecap="square"
              ></path>
            </svg>
          </label>
          <input
            name="name"
            type="name"
            value={input.name}
            className="inputs"
            onChange={(e) => handleChange(e)}
            placeholder="Ingresa tu Nombre"
            required
          />
        </div>
        <div>
          <label for="email" className="label">
            <svg
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
            >
              <path
                clip-rule="evenodd"
                d="M10.5 3.498a2.999 2.999 0 01-3 2.998 2.999 2.999 0 113-2.998zm2 10.992h-10v-1.996a3 3 0 013-3h4a3 3 0 013 3v1.997z"
                stroke="currentColor"
                stroke-linecap="square"
              ></path>
            </svg>
          </label>
          <input
            name="email"
            type="email"
            value={input.email}
            className="inputs"
            onChange={(e) => handleChange(e)}
            placeholder="Ingresa tu Email"
            required
          />
        </div>

        <div className="password">
          <label for="confirmPassword" className="label">
            <svg
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
            >
              <path
                d="M12.5 8.5v-1a1 1 0 00-1-1h-10a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1v-1m0-4h-4a2 2 0 100 4h4m0-4a2 2 0 110 4m-9-6v-3a3 3 0 016 0v3m2.5 4h1m-3 0h1m-3 0h1"
                stroke="currentColor"
              ></path>
            </svg>
          </label>

          <input
            name="confirmPassword"
            type="password"
            value={input.confirmPassword}
            className={
              errors.confirmPassword ? "inputs inputsPassword" : "inputs"
            }
            onChange={(e) => handleChange(e)}
            placeholder="Ingresa tu contraseña"
            required
          />
          {errors.confirmPassword ? (
            <span>{errors.confirmPassword}</span>
          ) : null}
        </div>
        <div className="password">
          <label for="password" className="label">
            <svg
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
            >
              <path
                d="M12.5 8.5v-1a1 1 0 00-1-1h-10a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1v-1m0-4h-4a2 2 0 100 4h4m0-4a2 2 0 110 4m-9-6v-3a3 3 0 016 0v3m2.5 4h1m-3 0h1m-3 0h1"
                stroke="currentColor"
              ></path>
            </svg>
          </label>

          <input
            name="password"
            type="password"
            value={input.password}
            className={errors.password ? "inputs inputsPassword" : "inputs"}
            onChange={(e) => handleChange(e)}
            placeholder="Confirma tu contraseña"
            required
          />

          {errors.password ? <span>{errors.password}</span> : null}
        </div>

        <button
          disabled={errors.password || errors.confirmPassword}
          type="submit"
        >
          Aceptar
        </button>
      </form>
    </div>
  );
};
