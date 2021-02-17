import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Comprar from './MercadoPago/index';
import {Loader} from 'rsuite';
import "./checkoutForm.scss";
import {
  Container,
  Header,
  Button,
  ButtonToolbar,
  Panel,
  Table,
} from "rsuite";
import useCheckout from "./useCheckout";
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config()

const CheckoutForm = () => {
  const {REACT_APP_URL} = process.env
  const dispatch = useDispatch();
  const [datos, setDatos] = useState("");
  const params = useParams();
  const { orderId } = params;
  const {
    state,
    total,
    goCart,
    modifyProducts,
    getCheckoutOrder,
    order,
  } = useCheckout();
  const { Column, HeaderCell, Cell } = Table;

  useEffect(() => {
    if (!order) getCheckoutOrder(orderId);
    modifyProducts();
  }, [dispatch, order]);

  useEffect(() => {
    axios
    .get(`${REACT_APP_URL}/mercadopago?id_orden=${orderId}`)
    .then((data)=>{
      setDatos(data.data)
    })
    .catch(err => console.error(err))
  },[orderId])

  return (
    <>
      <Container className="checkoutForm-container">
        <Panel className="sidebar-form" bordered bodyFill>
          <h1 className="title">Lista de productos</h1>
          <Table data={state} autoHeight id="tablaDetalles">
            <Column flexGrow={200} align="center">
              <HeaderCell align="center">Nombre</HeaderCell>
              <Cell dataKey="name" />
            </Column>
            <Column align="center" flexGrow={80}>
              <HeaderCell>Precio unitario</HeaderCell>
              <Cell dataKey="price" />
            </Column>
            <Column align="center" flexGrow={70}>
              <HeaderCell>Cantidad</HeaderCell>
              <Cell dataKey="quantity" />
            </Column>
            <Column align="center">
              <HeaderCell>Subtotal</HeaderCell>
              <Cell dataKey="total" />
            </Column>
          </Table>
          <Header className="checkout-total">Precio total: $ {total}</Header>{" "}
          <p>
            Al presionar el boton de Pagar seras redirigido a MercadoPago. Al
            volver al sitio deberas completar los datos para el envio.
          </p>
          <ButtonToolbar>
            <Button className="button-cancelar1" onClick={goCart}>
              Volver al carrito
            </Button>
            <Button className="Pagar">
              {!datos ? <Loader /> : <Comprar data={datos} />}
            </Button>
          </ButtonToolbar>{" "}
        </Panel>
      </Container>
    </>
  );
};

export default CheckoutForm;
