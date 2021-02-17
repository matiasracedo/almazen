import React from "react";
import "./Navbar.scss";
import { Link } from "react-router-dom";
import SearchBar from "../SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../redux/actions/actions";
import { ADD_DATA_USER } from "../../redux/constants/constantes";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config()

const Navbar = () => {
  const {REACT_APP_URL} = process.env
  const history = useHistory();
  const dispatch = useDispatch();
  const carritoCounter = useSelector((state) => state.cartCounter);
  const user = useSelector((state) => state.dataUser);
  const token = window.localStorage.getItem("token");
  return (
    <header className="header">
      <Link to="/">
        <h1 className="nav-title">AlmaZen</h1>
      </Link>
      <div className="search">
        {" "}
        <SearchBar />{" "}
      </div>
      <nav className="header__nav">
        <Link to="/products" onClick={() => dispatch(getAllProducts())}>
          Catalogo
        </Link>

        <Link to="/carrito">
          <svg
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
          >
            <path
              d="M.979.356L.02.644 3.128 11H15V4.5A2.5 2.5 0 0012.5 2H1.472L.979.356z"
              fill="currentColor"
            ></path>
            {/* cambie fill-rule por fillRule en react se usa camelCase para los nombres de clases */}
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.5 12a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM5 13.5a.5.5 0 111 0 .5.5 0 01-1 0zm7.5-1.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-.5 1.5a.5.5 0 111 0 .5.5 0 01-1 0z"
              fill="currentColor"
            ></path>
          </svg>
        </Link>
        <span className="number-carrito">{carritoCounter}</span>
        {user && user.isAdmin ? (
          <Link to="/admin/addProduct">Admin</Link>
        ) : null}
        {!user ? (
          <>
            <Link to="/login" className="header__ingresar">
              Ingresar
            </Link>
            <Link to="/register" className="header__registrar">
              Registrar
            </Link>
          </>
        ) : (
          <>
            <Link to="/me" className="header__ingresar">
              Profile
            </Link>
            <Link
              className="header__registrar"
              onClick={() => {
                axios.get(`${REACT_APP_URL}/auth/logout`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                dispatch({ type: ADD_DATA_USER, payload: null });
                dispatch({ type: "SET_CART_COUNTER", payload: 0 });
                dispatch({ type: "ADD_CART_PRODUCT", payload: [] });
                window.localStorage.removeItem("token");
                window.localStorage.removeItem("Google");
                history.push("/");
                return swal(
                  "Se ha cerrado la sesión exitosamente! Nos vemos pronto :)"
                );
              }}
            >
              Logout
            </Link>
          </>
        )}
        <Link to="/developers" className="developerButton">
          Developers
        </Link>
      </nav>
    </header>
  );
};
export default Navbar;
