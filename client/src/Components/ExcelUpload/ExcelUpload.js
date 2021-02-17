import React, { useState, useEffect } from "react";
import processFile from "./utils/processFile.js";
import "./ExcelUpload.scss";
import { Modal, Button, ButtonToolbar } from "rsuite";
import swal from "sweetalert";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config()
/* esta funcion envia el fiel a procesar y sete el state con el resultado */
const ExcelUpload = () => {
  const {REACT_APP_URL} = process.env
  const [file, setFile] = useState();
  const [show, setShow] = useState(false);

  const handleSubmit = (e) => {
    if (file) {
      try {
        let token = window.localStorage.getItem("token");

        axios
          .post(`${REACT_APP_URL}/products/excel`, file, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => res.data)
          .then((resdata) => {
            if (resdata) {
              /* dispatch(addDataUser(resdata.user[0])) */
              return swal(`¡Tus productos han sido guardados exitosamente!`);
            } else return swal("No se pudo añadir la lista...");
          });

        setShow(false);
        setFile();
      } catch (error) {
        swal("Ups! Surgio un problema");
      }
    }
  };

  const fileChange = (e) => {
    e.preventDefault();
    processFile(e.target).then((result) => setFile(result));
  };

  const close = (e) => {
    setShow(false);
  };
  const toggleDrawer = (e) => {
    setShow(true);
  };

  return (
    <div className="excel">
      <ButtonToolbar>
        <Button onClick={toggleDrawer}>Carga múltiple</Button>
      </ButtonToolbar>
      <Modal show={show} onHide={close}>
        <Modal.Header>
          <Modal.Title>Carga múltiples producto desde Excel</Modal.Title>
          <div>
            <label className="label-excel">
              <input
                name="excel"
                className="excel__selector"
                accept=".xlsx"
                type="file"
                onChange={fileChange}
              />
              Seleccionar Excel
            </label>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="listContainer">
            <table className="tabla">
              <tbody>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Categorias</th>
                </tr>

                {file &&
                  file.map((product, i) => (
                    <tr key={i} className="tabla__producto">
                      <td className="tabla__name">
                        <span>{product.name}</span>{" "}
                      </td>
                      <td>{product.description}</td>
                      <td>${product.price}</td>
                      <td>{product.stock}</td>
                      <td>{product.categories}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {file && (
            <Button
              className="button-guardar"
              type="button"
              onClick={(e) => handleSubmit(e)}
              appearance="primary"
            >
              Guardar cambios
            </Button>
          )}

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
export default ExcelUpload;
