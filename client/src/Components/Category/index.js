import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import './Category.scss';
import {
	getCategories,
	getByCategory,
	getAllProducts,
} from '../../redux/actions/actions';

export default function Category() {
	const categories = useSelector((state) => state.categories);
	const [selectedIndex, setSelectedIndex] = React.useState(0);
	const dispatch = useDispatch();

	const handleClick = (e, index) => {
		//setOpen(!open);
		e.preventDefault();
		dispatch(getByCategory(e.target.textContent));
		setSelectedIndex(index);
	};
	// const compareFunction = (a, b) => {
	// 	if (a.name > b.name) {
	// 		return 1;
	// 	}
	// 	if (a.name < b.name) {
	// 		return -1;
	// 	}
	// 	return 0;
	// };
	useEffect(() => {
		dispatch(getCategories());
	}, [dispatch]);

	return (
		<div className="absolute">
			<List
				component="nav"
				aria-labelledby="nested-list-subheader"
				subheader={
					<ListSubheader component="div" id="nested-list-subheader">
						Categorías{' '}
					</ListSubheader>
				}
				className="category"
			>
				<ListItem
					className="ListItem"
					selected={selectedIndex === 0}
					onClick={() => {
						setSelectedIndex(0);
						return dispatch(getAllProducts());
					}}
					button
				>
					<ListItemText
						primary="todas"
						value="todas"
						key={categories && categories.length + 1}
					/>
				</ListItem>
				{categories &&
					categories.map(({ name, id }) => (
						<ListItem
							className="ListItem"
							selected={selectedIndex === id}
							key={id}
							onClick={(e) => handleClick(e, id)}
							button
						>
							<ListItemText primary={name} value={name} />
						</ListItem>
					))}
			</List>
		</div>
	);
}
