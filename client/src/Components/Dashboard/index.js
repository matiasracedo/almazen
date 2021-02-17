import React from 'react';
import ProductForm from '../ProductForm';
import { useSelector } from 'react-redux';
import './Dashboard.scss';
import ListOfProducts from '../ListOfProducts';
import CategoryForm from '../CategoryForm';
import OrdersTable from '../OrdersTable';
import ListOfUsers from '../ListOfUsers';
import OrderDetails from '../OrderDetails';
import { Link } from 'react-router-dom';
import { Route } from 'react-router-dom';
import ProductEditForm from '../ProductEditForm';
import CategoryEditForm from '../CategoryEditForm';
const Dashboard = (props) => {
	document.title = 'AlmaZen - Panel de Admin';

	/* Para saber si renderizar OrdersTable o OrderDetails */

	let location = props.location.pathname;
	const products = useSelector((state) => state.products);
	const categories = useSelector((state) => state.categories);
	const onFilter = (id, array) => {
		let catOrProduct = array.find((item) => item.id === parseInt(id));
		if (catOrProduct) {
			return catOrProduct;
		} else {
			return null;
		}
	};
	
	return (
		<div>
			{/* <h1 className="dashboard__title">Panel de Admin</h1> */}
			<div className="dashboard">
				<div className="dashboard__left">
					<Link to="/admin/addProduct">
						<section
							className={
								location === '/admin/addProduct' ? 'active active1' : null
							}
						>
							<p>Crear Producto</p>
							<img
								className="dashboard__img "
								alt="addProduct"
								src={`https://images-ext-2.discordapp.net/external/7G5f8ee8iFbaxM_4ALRhKRy9yVLJPTVvdp9eOsq1sCg/https/cdn.onlinewebfonts.com/svg/img_64192.png?width=293&height=300`}
							/>
						</section>
					</Link>
					<Link to="/admin/products">
						<div className={location === '/admin/products' ? 'active' : null}>
							<p>Listado de Productos</p>
							<img
								className="dashboard__img"
								alt="listOfProducts"
								src={`https://icongr.am/fontawesome/folder-open.svg?size=128&color=currentColor`}
							/>
						</div>
					</Link>
					<Link to="/admin/categories">
						<div className={location === '/admin/categories' ? 'active' : null}>
							<p>Categorias</p>
							<img
								className="dashboard__img"
								alt="addCategory"
								src={`https://images-ext-2.discordapp.net/external/BbgRHyOrThIlX5SAJFUzT6B_rBeiwR7Mk1JBiWlnlyE/https/cdn1.iconfinder.com/data/icons/inficons-set-2/512/648927-star-ratings-512.png?width=300&height=300`}
							/>
						</div>
					</Link>
					<Link to="/admin/orders">
						<div className={location === '/admin/orders' ? 'active' : null}>
							<p>Listado de Órdenes</p>
							<img
								className="dashboard__img dashboard__img-list"
								alt="ordersTable"
								src={`https://images-ext-2.discordapp.net/external/upmC4261ELWFdnVFRB_X8E9-Y3V2ExYXGIMmlGhU_Ww/https/cdn0.iconfinder.com/data/icons/medical-set/100/ordonance-512.png?width=300&height=300`}
							/>
						</div>
					</Link>
					<Link to="/admin/users">
						<div
							className={location === '/admin/users' ? 'active active2' : null}
						>
							<p>Listado de Usarios</p>
							<img
								className="dashboard__img dashboard__img-list"
								alt="listOfUsers"
								src={`https://images-ext-2.discordapp.net/external/upmC4261ELWFdnVFRB_X8E9-Y3V2ExYXGIMmlGhU_Ww/https/cdn0.iconfinder.com/data/icons/medical-set/100/ordonance-512.png?width=300&height=300`}
							/>
						</div>
					</Link>
				</div>
				<section className="dashboard__right">
					{location === '/admin/categories' && <CategoryForm />}
					{location === '/admin/products' && <ListOfProducts />}
					{location === '/admin/addProduct' && <ProductForm />}
					{location === '/admin/orders' && <OrdersTable />}
					{location === '/admin/users' && <ListOfUsers />}
					<Route path="/admin/orders/:id" children={<OrderDetails />} />
					<Route
						exact
						path="/admin/editCategory/:id"
						render={({ match, history }) => (
							<CategoryEditForm
								categoria={onFilter(match.params.id, categories)}
								history={history}
							/>
						)}
					/>
					<Route
						exact
						path="/admin/editProduct/:id"
						render={({ match, history }) => (
							<ProductEditForm
								product={onFilter(match.params.id, products)}
								history={history}
							/>
						)}
					/>
				</section>
			</div>
		</div>
	);
};

export default Dashboard;
