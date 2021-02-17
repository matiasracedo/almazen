import React from 'react';
import Profile from '../Profile';
import ListOrderUser from '../Profile/ListOrderUser';
import './userDashboard.scss';

const UserDashboard = () => {
	return (
		<div className="userDashboard">
			<div className="userDashboard__left">
				<Profile />
			</div>
			<div className="userDashboard__right">
				<ListOrderUser />
			</div>
		</div>
	);
};
export default UserDashboard;
