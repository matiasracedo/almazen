import React, { useEffect, Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserLogin } from './Components/User/Login';
import { UserRegister } from './Components/User/Register';
import PageNotFound from './PageNotFound';
import axios from 'axios';
import { getAllProducts, addDataUser } from './redux/actions/actions';
import jwt from 'jsonwebtoken';
import AboutUs from './Components/AboutUs';
import dotenv from 'dotenv'


const Recipes = lazy(() => import('./Components/Recipes/RecipeSearch'));
const OrderDetailsUser = lazy(() =>
	import('./Components/User/Profile/OrdersDetailsUser')
);
const Product = lazy(() => import('./Components/Product'));
const Navbar = lazy(() => import('./Components/Navbar'));
const Catalogo = lazy(() => import('./Components/Catalogo'));
const Dashboard = lazy(() => import('./Components/Dashboard'));
const Footer = lazy(() => import('./Components/Footer'));
const Wrapper = lazy(() => import('./Components/Wrapper'));
const Carrito = lazy(() => import('./Components/Carrito'));
const CheckoutForm = lazy(() =>
	import('./Components/Checkout/checkoutForm.js')
);
const EmailConfirm = lazy(()=> import('./Components/Checkout/CheckoutEmail'))
const UserDashboard = lazy(() => import('./Components/User/UserDashboard'));
const Contacto = lazy(() => import('./Components/Contacto'));

dotenv.config()

function App() {
	const dispatch = useDispatch();
	const user = useSelector(state => state.dataUser);
	const {REACT_APP_URL} = process.env
	useEffect(() => {
		dispatch(getAllProducts()); // Traer todos los productos y mostrar Destacados
		const token = window.localStorage.getItem('token');
		/*  
        Si tenemos un token guardado significa que hay un usuario. 
        Lo "logeamos" y nos fijamos si tiene items en el carrito.
    */
		if (token) {
			const user = jwt.decode(token);
			dispatch(addDataUser(user));
			axios
				.get(`${REACT_APP_URL}/users/${user.id}/cart`, {
					headers: { Authorization: `Bearer ${token}`}
				})
				.then((res) => {
					dispatch({ type: 'SET_CART_COUNTER', payload: res.data.count || 0 });
				});
			/* 
            Si no hay token quiere decir que es un "guest", igualmente debemos chequear si tiene 
            productos en el carrito desde localStorage. 
        */
		} else {
			let storedProducts = window.localStorage.getItem('cart');
			if (!storedProducts) {
				storedProducts = [];
			} else {
				storedProducts = JSON.parse(storedProducts);
			}
			dispatch({ type: 'ADD_CART_PRODUCT', payload: storedProducts });
			dispatch({
				type: 'SET_CART_COUNTER',
				payload: storedProducts.length || 0,
			});
		}
		return () => {
			axios.get(`${REACT_APP_URL}/auth/logout`, { headers:{Authorization: `Bearer ${token}`}});
                dispatch({ type: "ADD_DATA_USER", payload: null });
                dispatch({type: 'SET_CART_COUNTER', payload: 0})
                dispatch({type: "ADD_CART_PRODUCT", payload: []})
		}
	}, [dispatch]);

	/* Renderizado y rutas */
	return (
		<Switch>
			<div className="contenedor">
				<Suspense
					fallback={
						<div>
							<img alt=''src="https://media.pictofolio.com/media/f54df0aa-d07c-4c35-85fc-cb43c918ccf9/fc8d26ce-86f4-4814-949e-2b83258ecb02_1920x800.gif" />
							<h1>Cargando...</h1>
						</div>
					}
				>
					<Route path="/" component={Navbar} />
					<main className="container2">
						<section className=" container-main">
							<div className="wave"></div>
							<Route exact path="/products" component={Catalogo} />
							<Route exact path="/product/:productId" component={Product} />
							<Route exact path="/" component={Wrapper} />
							<Route exact path="/carrito" component={Carrito} />
							{user ? <Route exact path="/order/checkout/:orderId" component={CheckoutForm} /> : <Route exact path="/order/checkout/:orderId" component={PageNotFound} />}
							<Route exact path="/login" component={UserLogin} />
							<Route exact path="/register" component={UserRegister} />
							{user && user.isAdmin ? <Route path="/admin" component={Dashboard} /> : <Route path="/admin" component={PageNotFound} />}
							{user ? <Route exact path="/me" component={UserDashboard} /> : <Route exact path="/me" component={PageNotFound} />}
							{user ? <Route path="/me/orders/:id" component={OrderDetailsUser} /> : <Route path="/me/orders/:id" component={PageNotFound} />}
							{user ? <Route exact path="/confirmOrder/:orderId" component={EmailConfirm} /> : <Route  exact path="/confirmOrder/:id" component={PageNotFound} />}
							<Route exact path="/contacto" component={Contacto} />
							<Route path="/recipes" component={Recipes} />
							<Route exact path='/developers' component={AboutUs}/>
						</section>
						<Footer />
					</main>
				</Suspense>
			</div>
		</Switch>
	);
}

export default App;
