import React, { useEffect } from "react";
import "./Product.scss";
import axios from "axios";
import swal from "sweetalert";
import PhotoSlide from "../PhotoSlide";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getReviews, getProductById } from "../../redux/actions/actions.js";
import Review from "../Review/ReviewCard";
import { PanelGroup, Rate } from "rsuite";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config()
const Product = () => {
  const {REACT_APP_URL} = process.env
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();
  
  const product = useSelector((state) => state.product);
  const reviews = useSelector((state) => state.reviews);
  useEffect(() => {
    dispatch(getProductById(params.productId));
    dispatch(getReviews(params.productId));
  }, [dispatch]);
  
  
  if (product[0]) {
    var {
      name: productName,
      price: productPrice,
      description: productDescription,
      imageUrl: productImageUrl,
      id: productId,
      stock: productStock,
      prodImages: prodImages,
      reviews: prodRating
    } = product[0];
  }
 let productRating =
   prodRating &&
    prodRating.length > 1 ?
   prodRating.map((e) => parseInt(e.rating)).reduce((acc, current) => acc + current) /
     prodRating.length : prodRating && prodRating.length > 0 && prodRating[0].rating;
 let number= prodRating && prodRating.length;
 var productImages = prodImages && prodImages.map((e)=>e.name)//devuevle el link de la imagen

  /* Agregamos el producto al carrito y actualizamos el contador */
  const AddToCart = async () => {
    try {
      if (productStock >= 1) {
        const token = window.localStorage.getItem("token");
        const user = jwt.decode(token);
        if (token) {
          const {
            data: { contador },
          } = await axios.post(
            `${REACT_APP_URL}/users/${user.id}/cart`,
            {
              productId,
              quantity: 1,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          dispatch({
            type: "SET_CART_COUNTER",
            payload: parseInt(contador),
          });
          swal("Producto agregado al carrito! :) ");
        } else {
          let storedProducts = window.localStorage.getItem("cart");
          let array_cart = JSON.parse(storedProducts) || [];

          var match = false;
          array_cart.forEach((item) => {
            if (item.id === product[0].id) {
              match = true;
              item.orderLine = {
                productId: item.id,
                price: item.price,
                quantity: item["orderLine"]["quantity"] + 1,
              };
            }
          });
          if (!match) {
            product[0].orderLine = {
              productId: product[0].id,
              price: product[0].price,
              quantity: 1,
            };
            array_cart.push(product[0]);
            window.localStorage.setItem("cart", JSON.stringify(array_cart));
            dispatch({ type: "ADD_CART_PRODUCT", payload: array_cart });
            dispatch({
              type: "SET_CART_COUNTER",
              payload: array_cart.length,
            });
          } else {
            window.localStorage.setItem("cart", JSON.stringify(array_cart));
            dispatch({ type: "ADD_CART_PRODUCT", payload: array_cart });
          }
          swal("Producto agregado al carrito! :) ");
        }
      } else {
        swal("Nos quedamos sin stock de este producto, se repondra pronto!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* const imageShowed = () => {
    //evalua si existen los paramatros para enviar a photoslide
    if (productImageUrl && productImages) {
      return Array(productImageUrl).concat(productImages);
    }
    if (!productImageUrl) {
      return productImages;
    }
    if (!productImages) {
      return Array(productImageUrl);
    }
  }; */

  const imageShowed = () => {
		//evalua si existen los paramatros para enviar a photoslide
		if (!productImages) {
			if (!productImageUrl) {
				return Array(
					'https://images-ext-2.discordapp.net/external/5jO7pc5KH1Avm3Bqa93QP2ED6bKINCZElzNeGRxeDMA/https/grupoact.com.ar/wp-content/uploads/2020/04/placeholder.png?width=400&height=267'
				);
			}
			return Array(productImageUrl);
		}
		if (productImageUrl && productImages) {
			return Array(productImageUrl).concat(productImages);
		} else if (!productImageUrl && productImages.length < 1) {
			return Array(
				'https://images-ext-2.discordapp.net/external/5jO7pc5KH1Avm3Bqa93QP2ED6bKINCZElzNeGRxeDMA/https/grupoact.com.ar/wp-content/uploads/2020/04/placeholder.png?width=400&height=267'
			);
		}

		if (!productImageUrl) {
			return productImages;
		}
	};

  /* renderizado del producto */
  return (
    <>
      <div>
        <div className="productCard" id={productId}>
          <div className="productPhoto">
            <PhotoSlide
              links={imageShowed()}
              name={productName}
              id={productId}
            />
          </div>
          <div className="productDescription">
            <button className="btn__exit" onClick={() => history.goBack()}>
              X
            </button>
            {productName && <h2>{productName}</h2>}
            {productPrice && <h1>${productPrice}</h1>}
            {productDescription && <p>{productDescription}</p>}
            {prodRating && prodRating.length > 0 && <Rate value={productRating} allowHalf readOnly />}
            {productRating ? ` ${productRating}/5 (${number} reseñas)` : <span className="no-review">No hay reseñas de este producto</span>}
            {productStock > 0 ? (
              <p>Hay {productStock} unidades disponibles</p>
            ) : null}
            {productStock > 0 ? (
              <button onClick={AddToCart}>Agregar al Carrito</button>
            ) : (
              <button style={{ color: "red", border: "none" }}>
                SIN STOCK
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="reviews-container">
        {/* createdAt, description, rating, user */}
        <PanelGroup >
          {reviews &&
            reviews.map((item) => {
              return (
                  <Review review={item} />
              )
            })}
        </PanelGroup>
      </div>
    </>
  );
};
export default Product;
