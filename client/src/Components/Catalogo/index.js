import React, { useState } from "react";
import ProductCard from "../ProductCard";
import Category from "../Category";
import "./Catalogo.scss";
import { useSelector } from "react-redux";
import PaginationComponent from "../Pagination";

const Catalogo = () => {
  const products = useSelector((state) => state.products);
  const [currentProduct, setCurrentProduct] = useState(1);
  const productsPerPage = 12; /* Número de poductos a renderizar por página (paginación) */

  // Se usan para obtener los productos que se renderizan en cada página.
  const indexOfLastProduct = currentProduct * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Función que se utiliza para cambiar de página
  const paginate = (pageNumber) => setCurrentProduct(pageNumber);

  document.title = "AlmaZen - Catalogo";
  return (
    <>
      <div className="catalogo">
        <h1 className="catalogo__titulo">Catálogo</h1>
        <div className="catalogo__category">
          <div onClick={() => setCurrentProduct(1)}>
            <Category />
          </div>
          <div className="catalogo__container">
            {products.length > 0 ? (
              currentProducts.map((produ) => {
                return (
                  <ProductCard
                    key={produ.id}
                    produc={produ}
                  />
                );
              })
            ) : (
              <h1 className="catalogo__subtitle">
                No se encontraron productos
              </h1>
            )}
          </div>
        </div>
        <div className="catalogo__pagination">
          <PaginationComponent
            productsPerPage={productsPerPage}
            totalProducts={products.length}
            paginate={paginate}
          />
        </div>
      </div>
    </>
  );
};

export default Catalogo;
