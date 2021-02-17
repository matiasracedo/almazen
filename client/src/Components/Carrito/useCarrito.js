import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCart } from "../../redux/actions/actions";
import swal from "sweetalert";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()

const useCarrito = () => {
  const {REACT_APP_URL} = process.env
  const token = window.localStorage.getItem("token");
  const user = jwt.decode(token);

  const products = useSelector((state) => state.cartProducts);
  const carritoCounter = useSelector((state) => state.cartCounter);

  const [input, setInput] = useState({});
  const [total, setTotal] = useState(0);

  const dispatch = useDispatch();
  const history = useHistory();

  const updateTotal = (obj) => {
    var finalTotal = 0;
    products.forEach((product) => {
      if (obj[product.id]) {
        finalTotal += product.price * obj[product.id];
      } else {
        finalTotal += product.price * product.orderLine.quantity;
      }
    });
    setTotal(finalTotal);
  };
  const handleChange = (e) => {
    if (parseInt(e.target.value) <= parseInt(e.target.slot)) {
      setInput({
        ...input,
        [e.target.id]: e.target.value,
      });
      updateTotal({
        ...input,
        [e.target.id]: e.target.value,
      });
    } else if (parseInt(e.target.value) === parseInt(e.target.max)) {
      swal(`Has llegado al maximo stock de ${e.target.name}`);
    }
  };

  const checkStock = (unmount, productos) => {
    var arr = [];
    var updated = [];
    var sinStock = false;
    var listSinStock = "";
    if (unmount["buy"] || Object.keys(unmount).length > 0) {
      productos &&
        productos.forEach((product) => {
          /* Para cuando hace la compra. */
          if (unmount["buy"]) {
            if (
              !input[product.id] &&
              product.stock >= product.orderLine.quantity
            ) {
              arr.push(product.orderLine);
              updated.push(product);
            } else if (
              input[product.id] &&
              input[product.id] <= product.stock
            ) {
              product.orderLine.quantity = parseInt(input[product.id]);
              arr.push(product.orderLine);
              updated.push(product);
            } else {
              sinStock = true;
              listSinStock = listSinStock + product.name + ", ";
            }
          } else {
            if (
              unmount[product.id] /* && unmount[product.id] <= product.stock */
            ) {
              product.orderLine.quantity = parseInt(unmount[product.id]);
              arr.push(product.orderLine);
              updated.push(product);
            } else if (
              !unmount[
                product.id
              ] /* && product.stock >= product.orderLine.quantity */
            ) {
              arr.push(product.orderLine);
              updated.push(product);
            }
          }
        });
      dispatch({ type: "ADD_CART_PRODUCT", payload: updated });
    } else {
      updated.push(...productos);
    }
    return {
      productos: arr,
      sinStock: sinStock,
      listSinStock: listSinStock,
      updatedProduct: updated,
    };
  };
  const handleComprar = async (prods) => {
    if (prods.length === 0)
      return swal("No puedes comprar con el carrito vacio");
    try {
      if (token) {
        const { productos, sinStock, listSinStock } = checkStock(
          { buy: true },
          prods
        );
        if (!sinStock) {
          const newCart = await axios.put(
            `${REACT_APP_URL}/users/${user.id}/cart/`,
            {
              products: productos,
              crear: false,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const orderId = newCart["data"][0].id;
          dispatch({ type: "ADD_CART_PRODUCT", payload: products });
          history.push(`/order/checkout/${orderId}`);
        } else {
          await axios.put(
            `${REACT_APP_URL}/users/${user.id}/cart/`,
            {
              products: productos,
              crear: false,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          swal({
            title: "Lo sentimos :(",
            text: `No tenemos stock de: ${listSinStock}`,
            icon: "error",
          }).then(() => {
            window.location.reload();
            history.push(`/carrito`);
          });
        }
      } else {
        history.push("/login");
        swal("Necesitas registrarte para hacer la compra.");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleClick = (id) => {
    if (token) {
      axios
        .delete(`${REACT_APP_URL}/users/${user.id}/cart/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          dispatch({ type: "SET_CART_COUNTER", payload: carritoCounter - 1 });
          swal("Has el eliminado un producto del carrito");
          return dispatch(getCart(user.id));
        });
    } else {
      let storedProducts = window.localStorage.getItem("cart");
      let array_cart = JSON.parse(storedProducts);
      let new_cart = array_cart.filter((item) => item.id !== id);

      dispatch({ type: "ADD_CART_PRODUCT", payload: new_cart });
      dispatch({ type: "SET_CART_COUNTER", payload: carritoCounter - 1 });
      window.localStorage.setItem("cart", JSON.stringify(new_cart));
      swal("Has el eliminado un producto del carrito");
    }
  };
  const handleEmpty = () => {
    if (token) {
      axios
        .delete(`${REACT_APP_URL}/users/${user.id}/cart/`, {
          headers: { Authorization: `Bearer ${token}` },
        }) //esta hardcodeado el id del user
        .then(() => {
          dispatch({ type: "SET_CART_COUNTER", payload: 0 });
          swal("Se vacio el carrito");
          return dispatch(getCart(user.id));
        });
    } else {
      window.localStorage.removeItem("cart");
      dispatch({ type: "ADD_CART_PRODUCT", payload: [] });
      dispatch({ type: "SET_CART_COUNTER", payload: 0 });
      swal("Se vacio el carrito");
    }
  };
  const updateCart = async (productos) => {
    const newCart = await axios.put(
      `${REACT_APP_URL}/users/${user.id}/cart/`,
      {
        products: productos,
        crear: false,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    /* console.log(newCart) */
    return newCart;
  };

  return {
    input,
    token,
    user,
    products,
    handleChange,
    handleComprar,
    handleClick,
    handleEmpty,
    checkStock,
    updateCart,
    updateTotal,
    total,
  };
};

export default useCarrito;
