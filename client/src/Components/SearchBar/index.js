import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import './SearchBar.scss';
import { getProduct, getRecipes } from '../../redux/actions/actions.js';
import { useHistory } from 'react-router-dom';

const SearchBar = () => {
  const [state, setState] = useState('');
  const [option, setOption] = useState('Productos')
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    const path = '/products';
    if (state) {
      if (option === 'Productos') {
        dispatch(getProduct(state));
        history.push(path);
        
      } else {
        dispatch(getRecipes(state))
        history.push('/recipes');
      }
      setState('');
    }
  };
  const handleInputChange = (e) => {
    setState(e.target.value);
  };
  const handleSelectChange = (e) => {
    setOption(e.target.value);
  }

  return (
    <div className="search">
      <form onSubmit={(e) => handleSubmit(e)}>
      <select onChange={handleSelectChange}>
        <option value="Productos">Productos</option>
        <option value="Recetas">Recetas</option>
      </select>
        <input
          type="text"
          name="search"
          placeholder="Busqueda"
          maxLength="30"
          value={state}
          onChange={(e) => handleInputChange(e)}
        />
        <button type="submit">
          <svg
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="22"
          >
            <path
              d="M14.5 14.5l-4-4m-4 2a6 6 0 110-12 6 6 0 010 12z"
              stroke="currentColor"
            ></path>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
