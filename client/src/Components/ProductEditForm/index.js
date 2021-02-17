import React, { useEffect, useState } from 'react';
import { getAllProducts, updateProduct } from '../../redux/actions/actions.js';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import swal from 'sweetalert';
import PhotoSelector from '../ProductForm/PhotoSelector/photoSelector.js'


const ProductEditForm = ({ product, history }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories);
  const img = product && product.prodImages.map((el)=>el.name) 
  const [current, setCurrent] = useState({ id: "0", name: "Select" });
  const [input, setInput] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: product && product.imageUrl,
    images: img && img ? img : null,
    showCategories: [],
    categories: [],
  });
  useEffect(() => {
    setInput({
      ...input,
      name: product && product.name,
      description: product && product.description,
      price: product && product.price,
      stock: product && product.stock,
      imageUrl: product && product.imageUrl,
      showCategories:
        product &&
        product.categories.map((item) => ({ id: item.id, name: item.name })),
      categories: product && product.categories.map((item) => item.id),
    });
  }, [product]);
  const handleSave = (e) => {
    e.preventDefault();
    /* Tal ves estaria bueno ver si no modifico nada */
    if (input.categories.length >= 1) {
      dispatch(updateProduct(product.id, input));
      dispatch(getAllProducts)
      swal('Exito!', 'El producto ha sido modificado.', 'success');
      history.goBack();
    } else {
      swal("Debes seleccionar al menos una categoría.");
    }
  };

  const addCategoryClick = (e) => {
    e.preventDefault();
    if (
      current.name !== "Select" &&
      !input.showCategories.find((category) => category.name === current.name)
    ) {
      input.showCategories.push(current);
      input.categories.push(current.id);
    } else if (current.name === "Select") {
      swal("Por favor seleccionar una categoría");
    } else {
      swal("No puedes agregar la misma categoría dos veces");
    }
    setCurrent({ id: "0", name: "Select" });
  };

  const removeCategoryClick = (e, category) => {
    e.preventDefault();
    let arr = input.showCategories.filter((cat) => cat.id !== category.id);
    let arr2 = input.categories.filter((cat) => cat !== category.id);
    setInput({
      ...input,
      showCategories: arr,
      categories: arr2,
    });
  };

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };


   /*//! ///////////////IMAGENES///////////////// */
  /* funcion para elevar el estado de un compnente hijo */
  const elevateState = (param) => {
    setInput({
      ...input,
      images: param
    })
  }
  return (
    <div className="productForm">
      <h1 className="titulo">Modificar Producto</h1>
      <form
        onSubmit={(e) => {
          handleSave(e);
        }}
      >
        <div>
          <label>Nombre</label>
          <input
            name="name"
            type="text"
            onChange={handleChange}
            value={input.name}
            placeholder="Nombre de tu Producto"
            maxLength="50"
            required
          />
        </div>
        {/* aca se renderizan las categorias seleccionadas con un boton para quitarlas del producto*/}
        <div>
          <select
            value={`${current.id} ${current.name}`}
            onChange={(e) => {
              let string = e.target.value;
              let arrId = [];
              let arrName = [];
              const value = string.split(" ");
              if (value.length > 2) {
                arrId = value[0];
                arrName = value.splice(1);
                arrName = arrName.join(" ");
                setCurrent({ id: arrId, name: arrName });
              } else setCurrent({ id: value[0], name: value[1] });
            }}
          >
            <option value={`0 Select`}>Select</option>
            {categories &&
              categories.map((category) => (
                <option value={`${category.id} ${category.name}`}>
                  {category.name}
                </option>
              ))}
            {/* aca se le hace map a las categorias que vienen por props para seleccionarlas*/}
          </select>
          <button onClick={(e) => addCategoryClick(e)}>
            Agregar Categoría
          </button>
        </div>
        {product && (
          <div className="categories">
            <p>Categorias seleccionadas</p>
            <div>
              {input.showCategories &&
                input.showCategories.map((category) => (
                  <button
                    className="cat"
                    onClick={(e) => removeCategoryClick(e, category)}
                  >
                    {category.name} <span>X</span>
                  </button>
                ))}
            </div>
          </div>
        )}
        <div>
          <label>Descripción</label>
          <textarea
            name="description"
            type="text"
            onChange={handleChange}
            value={input.description}
            placeholder="Descripción de tu producto"
            maxLength="250"
            required
          />
        </div>
        <div>
          <label>Precio</label>
          <input
            min='0'
            name="price"
            type="number"
            onChange={handleChange}
            input={input.value}
            value={input.price}
            placeholder="Precio de tu producto"
            required
          />
        </div>
        <div>
          <label>Stock</label>
          <input
            min='0'
            name="stock"
            type="number"
            onChange={handleChange}
            value={input.stock}
            placeholder="Stock de tu producto"
            required
          />
        </div>
        <div>
          <label>Imagen url</label>
          <input
            name="imageUrl"
            type="text"
            onChange={handleChange}
            value={input.imageUrl}
            placeholder="Acá pegá la URL de tu imagen"
          />
        </div>
        <div>
          <label>

          <PhotoSelector urlArray={input.images && input.images} state={elevateState} />
          </label>
        <div className="img__container__div" id="imageContainer">
          {/* aca se renderizan las fotos */}
        </div>
        </div>

        <div className="buttons">
          <button type="submit">Guardar Cambios</button>
          <Link to="/admin/products">Cancelar</Link>
        </div>
      </form>
    </div>
  );
};

export default ProductEditForm;
