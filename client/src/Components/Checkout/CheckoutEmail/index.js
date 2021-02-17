import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Form, ControlLabel, Button, FormControl } from "rsuite";
import useCheckout from "../useCheckout";
import "./index.scss";

const EmailConfirm = () => {
  const order = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const params = useParams();
  const {
    handleCompra,
    handleChange,
    modifyProducts,
    getCheckoutOrder,
  } = useCheckout();
  const { orderId } = params;

  useEffect(() => {
    if (!order) getCheckoutOrder(orderId);
    modifyProducts();
  }, [dispatch, order, getCheckoutOrder, modifyProducts, orderId]);

  return (
    <div className="confirmCompra">
      <h1>Gracias por tu compra!!</h1>
      <div className="img">
        <span>AlmaZen</span>
        <img
          src="https://images-ext-1.discordapp.net/external/0w_VtdQZmlJNXFQ4zGtRJvqzczIuH8bVCOeqKzDK5cE/https/saleysale.com/wp-content/uploads/2019/08/entrega.png"
          alt="Graciasporlacompra"
        />
      </div>
      <Form
        layout="inline"
        classame="checkoutForm"
        onSubmit={() => {
          handleCompra();
        }}
        onChange={handleChange}
      >
        <p>Completa tus Datos</p>

        <ControlLabel>Nombre</ControlLabel>
        <FormControl name="name" required />

        <ControlLabel>Apellido</ControlLabel>
        <FormControl name="lastName" required />

        <ControlLabel>Celular</ControlLabel>
        <FormControl name="cellphone" required />

        <ControlLabel>DNI</ControlLabel>
        <FormControl name="dni" required />

        <ControlLabel>Direccion de envio</ControlLabel>
        <FormControl name="address" required />

        <Button className="button-guardar" type="submit">
          Confirmar datos
        </Button>
      </Form>
    </div>
  );
};

export default EmailConfirm;
