import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import EditProfile from "./EditProfile";
import PasswordReset from "./PasswordReset";
import "./profile.scss";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config()
const Profile = () => {
  const { REACT_APP_URL } = process.env;
  const dataUser = useSelector((state) => state.dataUser);
  const dispatch = useDispatch();
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    try {
      axios
        .get(`${REACT_APP_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          return dispatch({
            type: "ADD_DATA_USER",
            payload: res.data,
          });
        });
    } catch (err) {
      console.log(err);
    }
  }, [dispatch]);
  return (
    <>
      <div className="profile">
        <img
          alt=""
          className="profile__img"
          src="https://media.pictofolio.com/media/f54df0aa-d07c-4c35-85fc-cb43c918ccf9/fc8d26ce-86f4-4814-949e-2b83258ecb02_1920x800.gif"
          width="300"
        />
        <p className="profile__name">
          <span> Nombre:</span> {dataUser && dataUser["name"]}
          {dataUser && dataUser["isAdmin"] ? "  (Admin)" : null}
        </p>
        <p className="profile__email">
          <span> Email:</span>
          {dataUser && dataUser["email"]}
        </p>
        <p className="profile__address">
          <span> Dirección:</span>
          {(dataUser && dataUser["address"]) ||
            "No has agregado una dirección."}
        </p>
      </div>
      <div className="EditButtons">
        <EditProfile />
        {window.localStorage.getItem("Google") ? null : <PasswordReset />}
      </div>
    </>
  );
};
export default Profile;
