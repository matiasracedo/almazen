import React, { useEffect, useState } from 'react';
import processFile from './utils/processFile';
import addImgDom from './utils/addImgDom.js';
import './photoSelector.scss';

/* recibe un array de links de fotos o precesa las selecionadas */
const PhotoSelector = (props) => {
	const [statePhotos, setStatePhotos] = useState({
		images: props.urlArray ? props.urlArray : [],
	});

	useEffect(() => {
		/* Cada vez que cambia el state.categories, elimino todos los hijos de un elemento(las fotos)
         y los vuelvo a rendeirzar */
		let imageContainer = document.getElementById('imageContainer'); //busca el elemento en el dom
		while (imageContainer.firstChild) {
			//siempre que imageContainer contenga un elemento lo borra
			imageContainer.removeChild(imageContainer.firstChild);
		}
		let img = statePhotos.images;
		props.state(img); //elevo el estado local al padre en la funcion pasada por props
		//crea una imagen por cada link del state llamando a addImgDom y le paso parametros + funcion para el boton de borrar
		img &&
			img.map((dataUrl, id) => {
				addImgDom(dataUrl, id, delPhoto);
			});
	}, [statePhotos.images]);

	//!ESTA FUNCION ELIMINA LA IMAGEN DEL DOM pasandosela al boton click de la imagen
	function delPhoto(element) {
		let arr = statePhotos.images.filter((e, id) => id != element.id);
		setStatePhotos({
			...statePhotos,
			images: arr,
		});
	}
	/* CUANDO ELIJO LA IMAGEN SE LA PASO A processFile,(en carpeta utils)
 SI ME DEVUELVE LA IMAGEN CON EXITO LA AGREGO AL STATE */
	const handleFileSelected = (e) => {
		processFile(e.target).then((result) => {
			setStatePhotos({
				...statePhotos,
				images: statePhotos.images.concat([result]),
			});
		});
	};

	return (
		<div>
			<label className="label-image">
				<input
					name="images"
					className="image__selector"
					accept="image/*"
					type="file"
					onChange={handleFileSelected}
				/>
				Agregar img...
			</label>
		</div>
	);
};
export default PhotoSelector;

