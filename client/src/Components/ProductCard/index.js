import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.scss';
import axios from 'axios';
import swal from 'sweetalert';
import PhotoSlide from '../PhotoSlide';
import { useDispatch } from 'react-redux';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

const ProductCard = ({ produc }) => {
	const {REACT_APP_URL} = process.env
	const { name, price, imageUrl, id, stock, prodImages } = produc;
	const images = prodImages && prodImages.map((e) => e.name); //devuevle el link de la imagen
	const dispatch = useDispatch();

	/* Agregamos un producto al carrito y actualizamos el contador. */
	const AddToCart = async () => {
		try {
			if (stock >= 1) {
				const token = window.localStorage.getItem('token');
				const user = jwt.decode(token);
				if (token) {
					const {
						data: { contador },
					} = await axios.post(
						`${REACT_APP_URL}/users/${user.id}/cart`,
						{
							productId: id,
							quantity: 1,
						},
						{ headers: { Authorization: `Bearer ${token}` } }
					);
					dispatch({
						type: 'SET_CART_COUNTER',
						payload: parseInt(contador),
					});
					swal('Producto agregado al carrito! :) ');
				} else {
					let storedProducts = window.localStorage.getItem('cart');
					let array_cart = JSON.parse(storedProducts) || [];

					var match = false;
					array_cart.forEach((item) => {
						if (item.id === produc.id) {
							match = true;
							item.orderLine = {
								productId: item.id,
								price: item.price,
								quantity: item['orderLine']['quantity'] + 1,
							};
						}
					});
					if (!match) {
						produc.orderLine = {
							productId: produc.id,
							price: produc.price,
							quantity: 1,
						};
						array_cart.push(produc);
						window.localStorage.setItem('cart', JSON.stringify(array_cart));
						dispatch({ type: 'ADD_CART_PRODUCT', payload: array_cart });
						dispatch({
							type: 'SET_CART_COUNTER',
							payload: array_cart.length,
						});
					} else {
						window.localStorage.setItem('cart', JSON.stringify(array_cart));
						dispatch({ type: 'ADD_CART_PRODUCT', payload: array_cart });
					}
					swal('Producto agregado al carrito! :) ');
				}
			} else {
				swal('Nos quedamos sin stock de este producto, se repondra pronto!');
			}
		} catch (err) {
			console.log(err);
		}
	};

	const imageShowed = () => {
		//evalua si existen los paramatros para enviar a photoslide
		if (!images) {
			if (!imageUrl) {
				return Array(
					'https://images-ext-2.discordapp.net/external/5jO7pc5KH1Avm3Bqa93QP2ED6bKINCZElzNeGRxeDMA/https/grupoact.com.ar/wp-content/uploads/2020/04/placeholder.png?width=400&height=267'
				);
			}
			return Array(imageUrl);
		}
		if (imageUrl && images) {
			return Array(imageUrl).concat(images);
		} else if (!imageUrl && images.length < 1) {
			return Array(
				'https://images-ext-2.discordapp.net/external/5jO7pc5KH1Avm3Bqa93QP2ED6bKINCZElzNeGRxeDMA/https/grupoact.com.ar/wp-content/uploads/2020/04/placeholder.png?width=400&height=267'
			);
		}

		if (!imageUrl) {
			return images;
		}
	};

	/* Renderizado del producto. */
	return (
		<div className="card" id={id}>
			<PhotoSlide links={imageShowed()} name={name} id={id} />
			{/* renederiza el slide y le pasa las props. */}

			<p className="card__title">
				{name} <span>${price}</span>
			</p>
			<div className="card__link">
				<Link
					className="card__button card__button-comprar"
					to={`/product/${id}`}
				>
					Ver detalles
				</Link>

				{stock === 0 ? (
					<>
						{' '}
						<p className="card__stock">SIN STOCK</p>{' '}
					</>
				) : (
					<div className="card__button card__button-ver" onClick={AddToCart}>
						{/* aca se estaba usando el metodo Link, esto no es una ruta */}
						{/* <svg
            viewBox="0 0 15 15"
            fill=" #aedaa6"
            xmlns="http://www.w3.org/2000/svg"
            width="34"
            height="34"
          >
            <path
              d="M.5.5l.6 2m0 0l2.4 8h11v-6a2 2 0 00-2-2H1.1zM8.5 4v5M6 6.5h5m1.5 8a1 1 0 110-2 1 1 0 010 2zm-8-1a1 1 0 112 0 1 1 0 01-2 0z"
              stroke="currentColor"
            ></path>
          </svg> */}
						<svg
							viewBox="0 0 15 15"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							width="34"
							height="34"
						>
							<path
								d="M.5.5l.6 2m0 0l2.4 8h11v-6a2 2 0 00-2-2H1.1zM8.5 4v5M6 6.5h5m1.5 8a1 1 0 110-2 1 1 0 010 2zm-8-1a1 1 0 112 0 1 1 0 01-2 0z"
								stroke="currentColor"
							></path>
						</svg>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProductCard;
