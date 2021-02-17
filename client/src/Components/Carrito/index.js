import React, { useEffect, useRef } from "react";
import { useDispatch} from "react-redux";
import { getCart } from "../../redux/actions/actions";
import { Link } from "react-router-dom";
import "./Carrito.scss";
import useCarrito from "./useCarrito.js";

const Carrito = () => {
  const dispatch = useDispatch();
  const didMountRef = useRef(0);
  const productsRef = useRef(null);
  const {
    input,
    token,
    checkStock,
    user,
    products,
    handleChange,
    handleComprar,
    handleClick,
    handleEmpty,
    updateCart,
    updateTotal,
    total
  } = useCarrito();
  var mainTotal = 0;
  useEffect(() => {
    if (token) {
      dispatch(getCart(user.id));
    }
    return () => {
      if (Object.keys(didMountRef.current).length > 0) {
        const { productos, updatedProduct } = checkStock(
          didMountRef.current,
          productsRef.current
          );
          if (token) {
            if (updatedProduct.length > 0) {
              updateCart(productos);
            dispatch({ type: "ADD_CART_PRODUCT", payload: updatedProduct });
          }
        } else {
          window.localStorage.setItem("cart", JSON.stringify(updatedProduct));
        }
      }
    };
  }, []);
  useEffect(() => {
    didMountRef.current = input;
    productsRef.current = products;
    if(Object.keys(input).length !== 0) updateTotal(input)
  }, [input, products]);

  /* Renderizado de la tabla */
  return (
    <>
    <div className="table__container">
      
      {products && products.length >= 1 ? (
        <>
          <table className="tableCart">
            <tr className="tabla__producto">
              <th>Foto</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Eliminar</th>
            </tr>
            {products &&
              products.map((product) => {
                mainTotal += product.price * product.orderLine.quantity
                return (
                  <tr className="tableCart__producto">
                    <td>
                      <img
                        src={
                          product.imageUrl || (product.prodImages ? product.prodImages[0].name : null) ||
                          "https://images-ext-2.discordapp.net/external/5jO7pc5KH1Avm3Bqa93QP2ED6bKINCZElzNeGRxeDMA/https/grupoact.com.ar/wp-content/uploads/2020/04/placeholder.png?width=400&height=267"
                        }
                        className="tableCart__imagen"
                        alt=""
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{`$ ${product.price}`}</td>
                    <td>
                      <input
                        name={product.name}
                        min='1'
                        slot={product.stock}
                        max={product.stock +1}
                        type="number"
                        placeholder={product.price}
                        id={product.id}
                        value={
                          input[product.id] === ""
                            ? ""
                            : false ||
                              input[product.id] ||
                              product.orderLine.quantity
                        }
                        onChange={handleChange}
                      ></input>
                    </td>
                    <td>{`$ ${
                      product.price *
                      (input[product.id] === ""
                        ? ""
                        : false ||
                          input[product.id] ||
                          product.orderLine.quantity)
                    }`}</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleClick(product.id)}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                );
              })
              }
              <tr className="tabla__producto">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className="total-td-title">Total</td>
                <td className='total-td-final'>{`$ ${total || mainTotal}`}</td>
                </tr>
          </table>
          <div className="buttons-container">
            <Link to="/products">
              <button className="raise">Seguir comprando</button>
            </Link>
            <button className="raise" onClick={handleEmpty}>
              Vaciar carrito
            </button>
            <button
              className="raise"
              onClick={() => handleComprar(productsRef.current)}
            >
              Finalizar compra
            </button>
          </div>
        </>
      ) : (
        <h1 className="titulo">Su carrito esta vacio</h1>
      )}

   
    </div>
    <div className='total-msg'>
    
     </div>
     </>
  );
};

export default Carrito;
