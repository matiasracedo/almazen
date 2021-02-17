import { useSelector } from "react-redux";
import { useState } from "react";
import { useDispatch } from "react-redux";
import jwt from "jsonwebtoken";
import emailjs from "emailjs-com";
import swal from "sweetalert";
import useCarrito from "./../Carrito/useCarrito";
import { useHistory } from "react-router-dom";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const useCheckout = () => {
  const {
    REACT_APP_YOUR_SERVICE_ID,
    REACT_APP_TEMPLATE_ORDER_DETAIL_ID,
    REACT_APP_YOUR_USER_ID,
    REACT_APP_URL
  } = process.env;
  const order = useSelector((state) => state.order);
  const orderProducts = order && order.products;
  const cartProducts = useSelector((state) => state.cartProducts);
  let products = cartProducts || orderProducts;
  const token = window.localStorage.getItem("token");
  const user = jwt.decode(token);
  const [total, setTotal] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const { checkStock } = useCarrito();
  const [state, setState] = useState([
    { nombre: "", precio: "", cantidad: "", total: "" },
  ]);
  const cardType = [
    { label: "MASTER", value: "MASTER" },
    { label: "VISA", value: "VISA" },
    { label: "AMEX", value: "AMEX" },
  ];
  const [form, setForm] = useState();
 

  const modifyProducts = () => {
    var total = 0;
    const productos =
      products &&
      products.map((product) => {
        Object.assign(product, product.orderLine);
        Object.assign(product, {
          total: `$ ${product.price * product.quantity}`,
        });
        total += product.price * product.quantity;
        return product;
      });
    if (productos) {
      setState(productos);
      setTotal(total);
    }
  }

  const handleCompra = async () => {
    try {
      swal('Espera un momento por favor...')
      if (token) {
        const { productos } = checkStock({ buy: true }, products);
        await axios.put(
          `${REACT_APP_URL}/users/${user.id}/cart/`,
          {
            products: productos,
            crear: true,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        dispatch({ type: "ADD_CART_PRODUCT", payload: [] });
        dispatch({ type: "SET_CART_COUNTER", payload: 0 });
        emailjs
          .send(
            REACT_APP_YOUR_SERVICE_ID,
            REACT_APP_TEMPLATE_ORDER_DETAIL_ID,
            {
              to_name: user?.name,
              to_receive: `${form?.name} ${form?.lastName}`,
              address: form?.address,
              dni: form?.dni,
              cellphone: form?.cellphone,
              message: htmlTable(),
              to_email: user?.email,
            },
            REACT_APP_YOUR_USER_ID
          )
          .then(
            (result) => {
              // console.log(result.text)
              history.push('/')
            swal("¡Gracias por tu compra!");
            },
            (error) => {
              console.log(error.text);
            }
          )
      } else {
        alert("Contanos como llegaste acá");
        history.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const goCart = () => {
    if (token) {
      history.push("/carrito");
    }
  }

  const getCheckoutOrder = async (orderId) => {
    const { data } = await axios.get(
      `${REACT_APP_URL}/orders/${orderId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    if (data) return dispatch({ type: "GET_ORDER_BY_ID", payload: data });
  }
  
  const handleChange = (formValue) => {
    setForm(formValue);
  };
  
   function htmlTable() {
     return `
            <div>
        <h3>Detalle de orden N° ${order?.id} </h3>
      <table>
        <tr>
          <th>Foto</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Sub-total</th>
        </tr>
        ${
          products &&
          products.map((product) => {
            return `<tr>
              <td>
                <img
                  src=${
                    product.imageUrl ||
                    "https://images-ext-2.discordapp.net/external/5jO7pc5KH1Avm3Bqa93QP2ED6bKINCZElzNeGRxeDMA/https/grupoact.com.ar/wp-content/uploads/2020/04/placeholder.png?width=400&height=267"
                  }
                  className="tableCart__imagen"
                  alt="imagen"
                  width="50"
                  height="50"
                />
              </td>
              <td>${product.name}</td>
              <td>$ ${product.price}</td>
              <td>${product.orderLine.quantity}</td>
              <td>$ ${product.price * product.orderLine.quantity}</td>
                        </tr>`;
          })
        }
        <tr>
          <th></th>
          <th></th>
          <th></th>
          <th>Total</th>
          <th>$ ${
            products &&
            products
              .map((product) => product.price * product.orderLine.quantity)
              .reduce((acc, arg) => acc + arg)
          }</th>
        </tr>
      </table>
    </div>`;
   }
  
  return {
    state,
    total,
    handleCompra,
    cardType,
    goCart,
    modifyProducts,
    getCheckoutOrder,
    handleChange,
    order,
	};
};

export default useCheckout;
