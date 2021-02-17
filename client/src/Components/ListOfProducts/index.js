import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProducts,
  deleteProduct,
  getProductById,
} from "../../redux/actions/actions.js";
import { Link } from "react-router-dom";
import "./ListOfProducts.scss";

const ListOfProducts = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const handlerClick = (e) => {
    e.preventDefault();
    dispatch(deleteProduct(e.target.value));
  };

  return (
    <div className="listContainer">
      <h1 className="titulo">Listado De Productos</h1>
      <table className="tabla">
        <tbody>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Editar</th>
          </tr>

          {products[0] &&
            products.map((product, i) => (
              <tr key={i} className="tabla__producto">
                <td className="tabla__name">
                  <span>{product.name}</span>{" "}
                  <button
                    value={product.id}
                    onClick={(e) => {
                      handlerClick(e);
                    }}
                  >
                    X
                  </button>
                </td>
                <td>${product.price}</td>
                <td>{product.stock}</td>

                <td>
                  <Link
                    to={`/admin/editProduct/${product.id}`}
                    onClick={() => dispatch(getProductById(product.id))}
                  >
                    <svg
                      viewBox="0 0 15 15"
                      fill="#fffff"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                    >
                      <path
                        d="M.5 9.5l-.354-.354L0 9.293V9.5h.5zm9-9l.354-.354a.5.5 0 00-.708 0L9.5.5zm5 5l.354.354a.5.5 0 000-.708L14.5 5.5zm-9 9v.5h.207l.147-.146L5.5 14.5zm-5 0H0a.5.5 0 00.5.5v-.5zm.354-4.646l9-9-.708-.708-9 9 .708.708zm8.292-9l5 5 .708-.708-5-5-.708.708zm5 4.292l-9 9 .708.708 9-9-.708-.708zM5.5 14h-5v1h5v-1zm-4.5.5v-5H0v5h1zM6.146 3.854l5 5 .708-.708-5-5-.708.708zM8 15h7v-1H8v1z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListOfProducts;
