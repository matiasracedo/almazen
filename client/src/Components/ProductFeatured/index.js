import React from "react";
import { useSelector } from "react-redux";
import ProductCard from "../ProductCard";
import "./ProductsFeatured.scss";
import { Carousel } from "rsuite";
const ProductsFeatured = () => {
  const productsFeatured = useSelector((state) => state.products);

  const productRev = productsFeatured?.filter(
    (produ) =>  produ.stock > 0
  ).reverse();

  /* let id = 1; */
  return (
    <div className="product">
      <h1 className="product__title">Productos Destacados</h1>
      <div className="product__subtitle">
        <p>Llevate el tuyo</p>
      </div>
      <div className="product__container">
        <Carousel autoplay className="custom-slider">
          {productsFeatured &&
            productRev.map((produc, i) => {
              if (i < 4) {
                return <ProductCard produc={produc} />;
              } else return null;
            })}
        </Carousel>
        <Carousel autoplay className="custom-slider">
          {productsFeatured &&
            productRev.map((produc, i) => {
              if (i > 4 && i <= 8) {
                return <ProductCard produc={produc} />;
              } else return null;
            })}
        </Carousel>
        <Carousel autoplay className="custom-slider">
          {productsFeatured &&
            productRev.map((produc, i) => {
              if (i > 8 && i <= 12) {
                return <ProductCard produc={produc} />;
              } else return null;
            })}
        </Carousel>
        <Carousel autoplay className="custom-slider">
          {productsFeatured &&
            productRev.map((produc, i) => {
              if (i > 12 && i <= 16) {
                return <ProductCard produc={produc} />;
              } else return null;
            })}
        </Carousel>
      </div>
    </div>
  );
};

export default ProductsFeatured;
