import React from 'react';
import './Slide.scss';

const PhotoSlide = (images) => {
	//recibe un array de links
	var slideIndex = 1;
	function forward(n) {
		//onClick de las flechitas
		showPhotos((slideIndex += n)); //llama a funcion y le suma 1 al index existente y le suma 1
	} // el index lo define despues el getElementsByClassName

	function showPhotos(n) {
		var card = document.getElementById(images.id); //busca la card con id recibido por props que tiene la foto dentro del container
		var img = card.getElementsByClassName('product_Img_Slide'); //busca la imagen dentro del container
		var i;
		if (n > img.length) {
			slideIndex = 1;
		}
		if (n < 1) {
			slideIndex = img.length;
		}

		for (i = 0; i < img.length; i++) {
			img[i].style.display = 'none';
		}

		img[slideIndex - 1].style.display = 'block';
	}
	return (
		<div className="contenedor-all">
			{images.links && images.links.length >= 1 ? images.links.map((e, i) => {
				/* no cambiar la className de las img */
				return (
					<img
						key={i}
						id={'img' + i}
						className="product_Img_Slide"
						src={images.links[i]}
						alt={images.name}
					/>
				);
			}) : (
				<img
						className="product_Img_Slide"
				  src="https://images-ext-2.discordapp.net/external/5jO7pc5KH1Avm3Bqa93QP2ED6bKINCZElzNeGRxeDMA/https/grupoact.com.ar/wp-content/uploads/2020/04/placeholder.png?width=400&height=267"
				  alt="placeholder"
				/>
			  )}

			{images.links && images.links.length > 1 ? (
				<div className="btn-container">
					<button
						className="slide-button"
						onClick={() => {
							forward(1);
						}}
					>
						{'<'}
					</button>

					<button
						className="slide-button"
						onClick={() => {
							forward(-1);
						}}
					>
						{'>'}
					</button>
				</div>
			) : null}
		</div>
	);
};

export default PhotoSlide;

/* dettales: el style se le aplica en css donde se renderiza el componente,
por props recibe un array con links de fotos y el nobre de prcucto para el alt */

