import React, { useEffect, useState } from 'react';
import './CategoryForm.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
	addCategory,
	getCategories,
	deleteCategory,
} from '../../redux/actions/actions.js';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';

const CategoryForm = () => {
	/* REDUX */
	const dispatch = useDispatch();
	const categories = useSelector((state) => state.categories);
	/* states */
	const [input, setInput] = useState({
		name: '',
		description: '',
	});
	/* Montado del componente. Me traigo todas las categorias existentes. */
	useEffect(() => {
		dispatch(getCategories());
	}, [dispatch]);
	/* Handlers */
	const hanldeClick = (e) => {
		e.preventDefault();
		dispatch(deleteCategory(e.target.value));
	};
	const handleChange = (e) => {
		setInput({
			...input,
			[e.target.name]: e.target.value,
		});
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		let categoryExists = false;
		//Si el formulario esta vacio, tiramos error.
		if (!input.name || !input.description) {
			return swal(
				'Debes ingresar nombre y descripción para agregar una categoría.'
			);
		} else {
			//Si hay un match, la categoria ya existe.
			categories.forEach((item) => {
				if (item.name === input.name) {
					categoryExists = true;
				}
			});
			//Si no hubo match, creamo la nueva categoria.
			if (!categoryExists) {
				dispatch(addCategory(input.name, input.description));
				swal('Exito!', `Categoría ${input.name} añadida!`, 'success');
				setInput(''); // reseteamos el estado.
				e.target.reset(); // con esto libero los campos de input del form
			} else {
				//Si hubo match no dejamos que se cree la categoria.
				swal(`La categoría ${input.name} ya existe.`);
				setInput(''); // reseteamos el estado.
				e.target.reset(); // con esto libero los campos de input del form
			}
		}
	};

	return (
		<>
			<div className="catForm-ctn">
				<h1 className="titulo">Agregar Categorias</h1>
				<div className="categoryForm">
					<form onSubmit={(e) => handleSubmit(e)}>
						<div>
							<label>NOMBRE</label>
							<input
								name="name"
								type="text"
								placeholder="Nombre de la categoría"
								input={input.name}
								maxLength="15"
								onChange={handleChange}
							/>
						</div>
						<div>
							<label>DESCRIPCIÓN</label>
							<textarea
								name="description"
								type="text"
								placeholder="Descripción"
								input={input.description}
								maxLength="100"
								onChange={handleChange}
							/>
						</div>

						<button className="button--category" type="submit">
							Guardar
						</button>
					</form>
				</div>
				<div className="listContainer">
					<table className="tabla">
						<thead>
							<tr>
								<th className="categoria"> Categoria </th>

								<th> Descripción </th>
								<th> Editar</th>
							</tr>
						</thead>
						<tbody>
							{categories &&
								categories.map((item, i) => {
									return (
										<tr key={i} className="tabla__producto">
											<td className="tabla__nameCategory">
												<span>{item.name}</span>{' '}
												<button value={item.id} onClick={(e) => hanldeClick(e)}>
													x
												</button>
											</td>
											<td>{item.description}</td>
											<td>
												{' '}
												<Link to={`/admin/editCategory/${item.id}`}>
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
									);
								})}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};
export default CategoryForm;
