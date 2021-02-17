import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import swal from 'sweetalert';
import { Rate, Modal, Button, ButtonToolbar } from 'rsuite';
import { useHistory } from 'react-router-dom';
import './reviews.scss';
import dotenv from 'dotenv';
dotenv.config()

const ReviewForm = ({ id, name, img, btn }) => {
	const {REACT_APP_URL} = process.env
	const history = useHistory();
	const [show, setShow] = useState(false);
	const reviews = useSelector((state) => state.reviews);
	const user = useSelector((state) => state.dataUser);
	let token = window.localStorage.getItem('token');

	const [input, setInput] = useState({
		rating: 0,
		description: '',
	});

	const handleChangeInput = (e) => {
		setInput({
			...input,
			[e.target.name]: e.target.value,
		});
	};
	const handleChange = (e) => {
		setInput({
			...input,
			rating: e,
		});
	};

	const close = (e) => {
		setShow(false);
	};
	const toggleDrawer = (e) => {
		setShow(true);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		let reviewExists = false;
		let reviewId;
		//Si el formulario esta vacio, tiramos error.
		if (!input.rating || !input.description) {
			return swal(
				'Debes ingresar puntaje y descripción para agregar una reseña.'
			);
		} else {
			//Si hay un match, la ya existe una reseña para este producto.
			reviews &&
				reviews.forEach((review) => {
					if (review.productId === id && review.userId === user.id) {
						reviewExists = true;
						reviewId = review.id;
					}
				});
			//Si no hubo match, creamos la nueva reseña.
			if (!reviewExists) {
				try {
					axios
						.post(
							`${REACT_APP_URL}/products/${id}/review`,
							{
								rating: input.rating,
								description: input.description,
							},
							{
								headers: { Authorization: `Bearer ${token}` },
							}
						)
						.then((res) => res.data)
						.then((resdata) => {
							if (resdata) {
								history.push('/me');
								return swal('Exito!', 'Se ha publicado tu reseña!', 'success');
							} else
								return swal(
									'Verifica los datos ingresados e intenta nuevamente'
								);
						});
					setInput(''); // reseteamos el estado.
				} catch (error) {
					return swal(error);
				}
			} else {
				//Si hubo match, editamos la reseña.
				try {
					axios
						.put(
							`${REACT_APP_URL}/products/${id}/review/${reviewId}`,
							{
								rating: input.rating,
								description: input.description,
							},
							{
								headers: { Authorization: `Bearer ${token}` },
							}
						)
						.then((res) => res.data)
						.then((resdata) => {
							if (resdata) {
								setShow(false);
								history.go(0);
								return swal('Exito!', 'Se ha editado tu reseña!', 'success');
							} else
								return swal(
									'Verifica los datos ingresados e intenta nuevamente'
								);
						});
					setInput(''); // reseteamos el estado.
				} catch (error) {
					return swal(error);
				}
				setInput(''); // reseteamos el estado.
			}
		}
	
	};

	return (
		<div>
			<ButtonToolbar>
				<Button className="btn-review btnEditar" onClick={toggleDrawer}>
					{btn}
				</Button>
			</ButtonToolbar>
			<Modal show={show} onHide={close}>
				<Modal.Header>
					<Modal.Title>{name}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form className="reviewForm" onSubmit={(e) => handleSubmit(e)}>
						<img width="150" height="150" src={img} alt="imagenProduct" />
						<div>
							<label>PUNTUACIÓN</label>
							<Rate
								size="sm"
								defaultValue="0"
								allowHalf
								name="rating"
								onChange={handleChange}
								value={input.rating}
							/>
						</div>
						<div>
							<label>RESEÑA</label>
							<textarea
								name="description"
								type="text"
								placeholder="Escribe tu reseña aqui"
								input={input.description}
								maxLength="100"
								onChange={handleChangeInput}
								autoFocus
							/>
						</div>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<Button type="submit" onClick={handleSubmit} appearance="primary">
						Guardar cambios
					</Button>
					<Button onClick={close} appearance="subtle">
						Cancelar
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default ReviewForm;
