import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Rate, Panel } from 'rsuite';
import ReviewForm from '../ReviewForm';
import axios from 'axios';
import swal from 'sweetalert';
import './Review.scss';
import dotenv from 'dotenv';
dotenv.config()
const Review = ({review}) => {
    const {REACT_APP_URL} = process.env
    const {createdAt, description, rating, user, id} = review;
    const dataUser = useSelector((state) => state.dataUser);
    const userId = dataUser && dataUser.id;
    const history = useHistory();
    let token = window.localStorage.getItem('token');

    const handleClick = () => {

        swal({
            title: "¿Estas seguro que deseas borrar esta reseña?",
            text: "Este reseña se borrará de forma permanente.",
            icon: "warning",
            buttons: ["No, cancelar.", "Sí, borrar!"],
            dangerMode: true,
          }).then(function (isConfirm) {
            if (isConfirm) {
                try {
                    axios
                        .delete(
                            `${REACT_APP_URL}/products/${review.product.id}/review/${id}`,
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            }
                        )
                        .then((res) => {
                                history.go(0);
                                return swal('Exito!', 'Tu reseña fue eliminada de forma exitosa.' , 'success');
                        })
                } catch (error) {
                    return swal(error);
                }
            } else {
              swal("Cancelado", "Tu reseña está a salvo :)", "error");
            }
          });
    }

    return (
        <Panel shaded bordered bodyFill className="reviewCard">
            <Panel>
            {userId === user.id ? 
            <div className="reviewCard__buttons">
            <ReviewForm
                      id={review.product.id}
                      name={review.product.name}
                      img={review.product.imageUrl}
                      btn={"Editar"}
                    />
            <button className="btnEliminar" onClick={handleClick}>Eliminar</button></div> :
             null}
            <h4>{user.name}</h4>    
            <Rate size="sm" value={rating} allowHalf readOnly />
            <p className="review-description">{description}</p>
            
            </Panel>
            <span className="fecha">{createdAt.slice(0, 10)
										.split('-')
										.reverse()
										.join('-')}</span>
        </Panel>
    )
}

export default Review;