import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./OrderDetails.scss";
import { getOrderById } from "../../redux/actions/actions";
import { useParams, useHistory } from "react-router-dom";

const OrderDetails = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  /* Se trae el estado "order" de redux, que se guardó al hacer click en la lupa de OrdersTable. */
  const order = useSelector((state) => state.order);
  const products = order && order.products;
  let { id } = useParams();

  useEffect(() => {
    dispatch(getOrderById(id));
  }, [dispatch, id]);

  const handleClick = () => {
    history.goBack();
  };

  /* Renderizado de la tabla */
  return (
    <div className="table_container">
      {order ? (
        <h3 className="titulo">Detalle de orden N° {order.id} </h3>
      ) : (
        <h3>Cargando...</h3>
      )}

      <table className="detalles">
        <tr className="tabla__producto">
          <th>Foto</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Sub-total</th>
        </tr>
        {products &&
          products.map((product) => {
            return (
              <tr className="tableCart__producto">
                <td>
                  <img
                    src={
                      product.imageUrl ||
                      product.prodImages?.[0].name ||
                      "https://images-ext-2.discordapp.net/external/5jO7pc5KH1Avm3Bqa93QP2ED6bKINCZElzNeGRxeDMA/https/grupoact.com.ar/wp-content/uploads/2020/04/placeholder.png?width=400&height=267"
                    }
                    className="tableCart__imagen"
                    alt="imagen"
                    width="150"
                    height="150"
                  />
                </td>
                <td>{product.name}</td>
                <td>{`$ ${product.price}`}</td>
                <td>{product.orderLine.quantity}</td>
                <td>{`$ ${product.price * product.orderLine.quantity}`}</td>
              </tr>
            );
          })}
        <tr>
          <th></th>
          <th></th>
          <th></th>
          <th>Total</th>
          <th>{`$ ${
            products &&
            products
              .map((product) => product.price * product.orderLine.quantity)
              .reduce((acc, arg) => acc + arg)
          }`}</th>
        </tr>
        <button onClick={handleClick}>Atrás</button>
      </table>
    </div>
  );
};

export default OrderDetails;
