import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import swal from "sweetalert";
import { editCategory } from "../../redux/actions/actions.js";
import { Link } from "react-router-dom";

const CategoryEditForm = ({ categoria, history }) => {
  const { id } = categoria;
  /* REDUX */
  const dispatch = useDispatch();

  /* states */
  const [input, setInput] = useState({
    name: "",
    description: "",
  });
  useEffect(() => {
    setInput({
      name: categoria && categoria.name,
      description: categoria && categoria.description,
    });
  }, [categoria]);
  /* Handlers */
  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.name || !input.description) {
      return swal(
        "Debes ingresar nombre y descripción para agregar una categoría."
      );
    } else {
      dispatch(editCategory(input, id));
      swal("Exito!", "Tu categoría ha sido cambiada exitosamente!", "success");
      e.target.reset();
      history.goBack();
    }
  };
  return (
    <div className="catForm-ctn">
      <h1 className="titulo">Modificar Categoria</h1>

      <div className="categoryForm">
        <form onSubmit={(e) => handleSubmit(e)}>
          <div>
            <input
              name="name"
              type="text"
              value={input.name}
              onChange={handleChange}
            />
          </div>
          <br />
          <textarea
            name="description"
            type="text"
            value={input.description}
            onChange={handleChange}
          />
          <br />
          <div className="buttons">
            <button type="submit">Guardar</button>
            <Link to="/admin/categories">Cancelar</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CategoryEditForm;
