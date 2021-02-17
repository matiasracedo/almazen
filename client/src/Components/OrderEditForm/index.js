import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editOrder, getAllOrders } from '../../redux/actions/actions.js';
import swal from 'sweetalert';
import './OrderEditForm.scss';

const OrderEditForm = (props) => {
	const { id, status } = props.order;
	/* REDUX */
	const dispatch = useDispatch();
	/* States */
	const [estado, setEstado] = useState(status);
	/* Handlers */
	const handleChange = (e) => {
		setEstado(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!estado) {
			return swal('Debes ingresar un estado de orden.');
		} else if (estado === status) {
			return swal('Debes seleccionar un estado diferente');
		} else {
			dispatch(editOrder({ status: estado }, id));
			dispatch(getAllOrders());
			swal(
				'Exito!',
				'El estado de la orden ha sido editado exitosamente!',
				'success'
			);
			e.target.reset();
		}
	};
	return (
		<form onSubmit={(e) => handleSubmit(e)}>
			{props.children}
			<div>
				<select value={estado} onChange={handleChange}>
					<option value="creada">Creada</option>
					<option value="procesando">Procesando</option>
					<option value="cancelada">Cancelada</option>
					<option value="completa">Completada</option>
				</select>
			</div>
			<button type="submit">Guardar</button>
		</form>
	);
};
export default OrderEditForm;

