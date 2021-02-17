import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table } from 'rsuite';
import dotenv from 'dotenv'
const { Column, HeaderCell, Cell } = Table;
dotenv.config()

const ListOrderUser = () => {
  const {REACT_APP_URL} = process.env
	const [orders, setOrders] = useState([]);
	const dataUser = useSelector((state) => state.dataUser);
	const userId = dataUser && dataUser.id;

	useEffect(() => {
		const token = window.localStorage.getItem('token');
		if (userId) {
			axios
				.get(`${REACT_APP_URL}/users/${userId}/orders`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((res) => setOrders(res.data));
		}
	}, [userId]);

	return (
    <div className="tableUser">
      <h1 className="tableUser__title">Mis Ordenes</h1>
      <Table
        virtualized
        height={400}
        data={orders}
        bordered="true"
        align="center"
      >
        <Column flexGrow={100} align="center">
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column flexGrow={150}>
          <HeaderCell>Fecha</HeaderCell>
          <Cell>
            {(rowData) => {
              return (
                <span>
                  {rowData.updatedAt
                    .slice(0, 10)
                    .split("-")
                    .reverse()
                    .join("-")}
                </span>
              );
            }}
          </Cell>
        </Column>

        <Column flexGrow={150}>
          <HeaderCell>Hora</HeaderCell>
          <Cell>
            {(rowData) => {
              return (
                <span>
                  {rowData.updatedAt
                    .slice(11, 16)
                    .split("-")
                    .reverse()
                    .join("-")}
                </span>
              );
            }}
          </Cell>
        </Column>

        <Column flexGrow={150}>
          <HeaderCell>Estado</HeaderCell>
          <Cell dataKey="status" />
        </Column>
        <Column flexGrow={150}>
          <HeaderCell>Estado de pago</HeaderCell>
          <Cell dataKey="payment_status" />
        </Column>

        <Column fixed="right">
          <HeaderCell>Detalles</HeaderCell>
          <Cell dataKey="street">
            {(rowData) => {
              return (
                <Link to={`/me/orders/${rowData.id}`}>
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
              );
            }}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default ListOrderUser;
