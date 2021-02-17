import "./index.scss";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../redux/actions/actions.js";
import swal from "sweetalert";
import PhotoSelector from "./PhotoSelector/photoSelector";
import axios from "axios";
import ExcelUpload from "../ExcelUpload/ExcelUpload.js";
import dotenv from 'dotenv';
dotenv.config()

const ProductForm = () => {
  const {REACT_APP_URL} = process.env
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories);
  const [input, setInput] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    images: [],
    showCategories: [],
    categories: [],
  });
  const [current, setCurrent] = useState({ id: "0", name: "Select" });

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (input.categories.length >= 1) {
      const token = window.localStorage.getItem("token");
      axios
        .post(`${REACT_APP_URL}/products`, input, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (!res.data["msg"]) {
            return swal("Exito!", "Producto creado!", "success");
          } else {
            swal("Ups! Puede que algo haya salido mal...");
          }
        })
        .catch((err) => console.log(err));
      setInput({
        name: "",
        description: "",
        price: "",
        stock: "",
        imageUrl: "",
        images: [],
        showCategories: [],
        categories: [],
      });
      document.getElementById("form").reset();
      // Eliminando todos los hijos de un elemento
      let imageContainer = document.getElementById("imageContainer"); //busca el elemento en el dom
      while (imageContainer.firstChild) {
        //siempre que imageContainer contenga un elemento lo borra
        imageContainer.removeChild(imageContainer.firstChild);
      }
    } else {
      swal("Debes seleccionar al menos una categoría.");
    }
  };
  const handleClick = (e) => {
    e.preventDefault();
    if (categories.length === 0)
      return swal({
        title: "¿Y si agregamos una categoría primero?",
        buttons: ["Bueno, si tu lo dices!", null],
        dangerMode: true,
      });
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

  /*//! ///////////////IMAGENES///////////////// */
  /* funcion para elevar el estado de un compnente hijo */
  const elevateState = (param) => {
    setInput({
      ...input,
      images: param,
    });
  };

  return (
    <div className="productForm">
      <h1 className="titulo">Agregar Producto</h1>

      <div name="div_input_excel" className="EditButtons">
        <ExcelUpload />
      </div>

      <form
        id="form"
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
            input={input.value}
            placeholder="Nombre de tu Producto"
            maxLength="50"
            required
          />
        </div>
        {/* aca se renderizan las categorias seleccionadas con un boton para quitarlas del producto*/}
        <div>
          <select
            value={`${current.id} ${current.name}`}
            onClick={handleClick}
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
                <option
                  key={category.id}
                  value={`${category.id} ${category.name}`}
                >
                  {category.name}
                </option>
              ))}
            {/* aca se le hace map a las categorias que vienen por props para seleccionarlas*/}
          </select>
          <button onClick={(e) => addCategoryClick(e)}>
            Agregar Categoría
          </button>
        </div>
        {input.showCategories.length > 0 && (
          <div className="categories">
            <p>Categorias seleccionadas</p>
            <div>
              {input.showCategories &&
                input.showCategories.map((category) => (
                  <button
                    key={category.id}
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
            input={input.value}
            placeholder="Descripción de tu producto"
            maxLength="250"
            required
          />
        </div>
        <div>
          <div className="div-grid">
            <label>Precio</label>
            <input
              min="1"
              name="price"
              type="number"
              onChange={handleChange}
              input={input.value}
              placeholder="Precio del producto"
              required
            />

            <label>Stock</label>
            <input
              min="0"
              name="stock"
              type="number"
              onChange={handleChange}
              input={input.value}
              placeholder="Stock del producto"
              required
            />
          </div>{" "}
        </div>
        <div>
          <label>Imagen url</label>
          <input
            className="btn-image"
            name="imageUrl"
            type="text"
            onChange={handleChange}
            input={input.value}
            placeholder="Acá pegá la URL de tu imagen"
          />
        </div>

        <div>
          <label>
            <PhotoSelector urlArray={input.images} state={elevateState} />
          </label>
          <div className="img__container__div" id="imageContainer">
            {/* aca se renderizan las fotos */}
          </div>
        </div>
        <div>
          <button type="submit">Añadir Producto</button>
        </div>
      </form>
    </div>
  );
};
export default ProductForm;
