import React, { useState, useEffect } from "react";
import "./user.scss";
import axios from "axios";
import swal from "sweetalert";
import { Icon } from "rsuite";
import { useHistory, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addDataUser, getCart } from "../../../redux/actions/actions";
import GoogleLogin from "react-google-login";
import NewPassword from "./ForgottenPassword";
import dotenv from 'dotenv'
dotenv.config()

export const UserLogin = () => {
  const {REACT_APP_URL} = process.env
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const history = useHistory();
  /* const cartProducts = useSelector((state) => state.cartProducts); */

  const handleCart = async (user, token) => {
    const localCart = JSON.parse(window.localStorage.getItem("cart"));
    dispatch(addDataUser(user));
    if (localCart) {
      /* Borramos el carrito de localStorage y lo mandamos a la DB */
      let arr = [];
      /* Creamos la orden carrito */
      const {
        data: { orderLine },
      } = await axios.post(
        `${REACT_APP_URL}/users/${user.id}/cart`,
        {
          productId: localCart[0].id,
          quantity: 1,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      /* updateamos el carrito con todos los productos que selecciono el GUEST */
      const orderId = orderLine.orderId;
      localCart.forEach((product) => {
        arr.push({
          productId: product.id,
          orderId: orderId,
          price: product.price,
          quantity: product.orderLine.quantity,
        });
      });
      await axios.put(
        `${REACT_APP_URL}/users/${user.id}/cart/`,
        {
          products: arr,
          crear: false,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      window.localStorage.removeItem("cart");
      dispatch(getCart(user.id));
      history.push("/");
      return swal(`¡Bienvenid@ ${user.name}!`);
    } else {
      dispatch(getCart(user.id));
      history.push("/");
      return swal(`¡Bienvenid@ ${user.name}!`);
    }
  };
  const responseGoogle = async (response) => {
    try {
      const google = response.profileObj;
      window.localStorage.setItem("Google", JSON.stringify(google));
      let { givenName, email, googleId } = google;
      const {
        data: { result: user, token },
      } = await axios.post(`${REACT_APP_URL}/users`, {
        name: givenName,
        email,
        password: googleId,
      });
      if (user) {
        window.localStorage.setItem("token", token);
        return handleCart(user, token);
      } else {
        window.localStorage.removeItem("Google");
        window.localStorage.removeItem("token");
        swal("Verifica tu email y contraseña e intenta de nuevo por favor");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      data: { user, token },
    } = await axios.post(`${REACT_APP_URL}/auth/login`, input);
    if (user) {
      window.localStorage.setItem("token", token);
      return handleCart(user, token);
    } else {
      window.localStorage.removeItem("Google");
      window.localStorage.removeItem("token");
      swal("Verifica tu email y contraseña e intenta de nuevo por favor");
    }
  };
  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="user">
      <form className="user__form" onSubmit={(e) => handleSubmit(e)}>
        <h1 className="titulo titulo-shadow">Iniciar Sesión</h1>
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

        <div>
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
            className="inputs"
            onChange={(e) => handleChange(e)}
            placeholder="Ingresa tu Password"
            required
          />
        </div>

        <button type="submit">Aceptar</button>
        <div>
          <GoogleLogin
            clientId={`635416282098-p3pjno62rnkvsm6p7t4iagf1huh67opu.apps.googleusercontent.com`}
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                Acceder con <Icon icon="google" />
                oogle
              </button>
            )}
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={"single_host_origin"}
          />
        </div>
        <div>
          <NewPassword />
          <p>
            No tienes una cuenta?{" "}
            <Link className="login" to="/register">
              Registrate
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
