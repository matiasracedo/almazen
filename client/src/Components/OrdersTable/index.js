import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders } from '../../redux/actions/actions.js';
import OrderEditForm from '../OrderEditForm';
import './OrdersTable.scss';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';

//Estilos de material-ui.
const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}));

const OrdersTable = () => {
	const dispatch = useDispatch();
	const orders = useSelector((state) => state.orders);
	const classes = useStyles();
	const [state, setState] = useState('all');

	// Se obtienen todas las órdenes al renderizar el componente.
	useEffect(() => {
		dispatch(getAllOrders());
	}, [state, dispatch]);

	// Usamos un estado local para filtrar órdenes según su status.
	const handleChange = (event) => {
		setState(event.target.value);
	};

	return (
		<div className="listContainer">
			<h1 className="titulo">Listado De Órdenes</h1>
			<div className="filtro">
				<label className="titulo">Filtrar por estado</label>
				<FormControl className={classes.formControl}>
					<NativeSelect
						value={state}
						onChange={handleChange}
						name="status"
						className={classes.selectEmpty}
					>
						<option value="all">Todos</option>
						<option value="creada">Creada</option>
						<option value="procesando">Procesando</option>
						<option value="cancelada">Cancelada</option>
						<option value="completa">Completada</option>
					</NativeSelect>
				</FormControl>
			</div>
			<table className="tabla">
				<tbody>
					<tr>
						<th>ID orden</th>
						<th>Usuario</th>
						<th>E-mail</th>
						<th>Estado</th>
						<th>Estado de pago</th>
						<th>Detalles</th>
					</tr>

					{orders[0] &&
						orders.map(
							(order) =>
								/* No se muestran las órdenes de status "carrito". Si el estado local state es igual a 
              "all", se muestran todas las órdenes. Si es otro, se renderizan solamente las órdenes
              con ese estado. */
								order.status !== 'carrito' &&
								(order.status === state || state === 'all') && (
									<tr className="tabla__producto">
										<td>{order.id}</td>
										<td>{order.user.name}</td>
										<td>{order.user.email}</td>
										<td>
											<OrderEditForm order={order}>
												
											</OrderEditForm>
										</td>
										<td>{order.payment_status}</td>
										<td>
											{/* Ícono Lupa. Al hacer click, se despacha la acción para cargar en el estado "Order" de redux esa orden
                  específica, lo que hace que se renderice el componente OrderDetails en el Dashboard. Y se muestran los
                  detalles de esa orden en OrderDetails. */}
											<Link to={`/admin/orders/${order.id}`}>
												<svg
													viewBox="0 0 16 16"
													fill="#fffff"
													xmlns="http://www.w3.org/2000/svg"
													width="20"
													height="20"
												>
													<path
														fill="currentColor"
														d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"
													/>
													<path
														fill="currentColor"
														d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"
													/>
												</svg>
											</Link>
										</td>
									</tr>
								)
						)}
				</tbody>
			</table>
		</div>
	);
};

export default OrdersTable;
