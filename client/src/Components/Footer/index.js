import React from "react";
import "./Footer.scss";
import imgLogo from "../../assets/fruits.png";
import { Link } from "react-router-dom";
import dotenv from "dotenv";
dotenv.config();

const Footer = () => {
  const { REACT_APP_PHONE } = process.env;
  const message = 'Hola Almazen!%20Quiero%20hacerles%20una%20consulta'
  const handleClick = () => {
    window.open(`https://api.whatsapp.com/send?phone=${REACT_APP_PHONE}&text=${message}`);
  }

  return (
    <footer className="footer">
      <img className="logo-foo" alt="img-logo" src={imgLogo} />
      <div>
        <svg
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
        >
          <path
            d="M1.9 11.7l.447.224.138-.277L2.3 11.4l-.4.3zm1.4 1.4l.3-.4-.247-.185-.277.138.224.447zM.5 14.5l-.447-.224a.5.5 0 00.67.671L.5 14.5zm4-10l-.277-.416A.5.5 0 004 4.5h.5zm6 6v.5a.5.5 0 00.416-.223L10.5 10.5zM6.254 5.026l.493-.083-.493.083zm.14.836l-.493.082.493-.082zm-.432.997l.277.416-.277-.416zm4.68 3.428l.416.277-.416-.277zm-.668-1.541l.083-.493-.083.493zm-.836-.14l-.082.493.082-.493zm-.997.432l-.416-.277.416.277zM0 7.5c0 1.688.558 3.247 1.5 4.5l.8-.6A6.47 6.47 0 011 7.5H0zM7.5 0A7.5 7.5 0 000 7.5h1A6.5 6.5 0 017.5 1V0zM15 7.5A7.5 7.5 0 007.5 0v1A6.5 6.5 0 0114 7.5h1zM7.5 15A7.5 7.5 0 0015 7.5h-1A6.5 6.5 0 017.5 14v1zM3 13.5A7.47 7.47 0 007.5 15v-1a6.469 6.469 0 01-3.9-1.3l-.6.8zM.723 14.947l2.8-1.4-.448-.894-2.8 1.4.448.894zm.729-3.47l-1.4 2.8.894.447 1.4-2.8-.894-.447zM4 4.5v1h1v-1pzM9.5 11h1v-1h-1v1zM4 5.5A5.5 5.5 0 009.5 11v-1A4.5 4.5 0 015 5.5pzm.777-.584l.214-.142-.555-.832-.213.142.554.832zm.984.192l.14.836.986-.164-.14-.837-.986.165zm-.076 1.335l-.962.641.554.832.962-.641-.554-.832zm.216-.499a.5.5 0 01-.216.499l.554.832a1.5 1.5 0 00.648-1.495l-.986.164zm-.91-1.17a.5.5 0 01.77.334l.986-.165a1.5 1.5 0 00-2.311-1.001l.555.832zm5.925 6.003l.142-.213-.832-.555-.142.214.832.554zm-.86-2.524l-.836-.14-.164.987.836.139.165-.986zm-2.33.508l-.642.962.832.554.641-.962-.832-.554zm1.494-.648a1.5 1.5 0 00-1.495.648l.832.554a.5.5 0 01.499-.216l.164-.986zm1.838 2.451a1.5 1.5 0 00-1.001-2.311l-.165.986a.5.5 0 01.334.77l.832.555z"
            fill="currentColor"
          ></path>
        </svg>
        <button className='whatsapp' onClick={handleClick}>-1130887542-</button>
      </div>

      <p>almazenhenry@gmail.com</p>

      <Link to="/contacto">Contactanos</Link>
      <div>
        <svg
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
        >
          <path
            d="M11 3.5h1M4.5.5h6a4 4 0 014 4v6a4 4 0 01-4 4h-6a4 4 0 01-4-4v-6a4 4 0 014-4zm3 10a3 3 0 110-6 3 3 0 010 6z"
            stroke="currentColor"
          ></path>
        </svg>

        <svg
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
        >
          <path
            d="M7.5 14.5a7 7 0 110-14 7 7 0 010 14zm0 0v-8a2 2 0 012-2h.5m-5 4h5"
            stroke="currentColor"
          ></path>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;
