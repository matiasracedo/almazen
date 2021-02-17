import React from 'react';
import { useSelector } from 'react-redux'
import RecipeTable from '../RecipeTable';
import './recipeSearch.scss';


const Recipes = () => {
  const recipes = useSelector(state => state.recipes);
  
  return (
      <div className='recipes'>
          <RecipeTable title={recipes.q} data={recipes.hits}/>
      </div>
  );
};

export default Recipes;

