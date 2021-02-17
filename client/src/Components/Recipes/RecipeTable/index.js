import React from 'react';
import './recipeTable.scss';

const RecipeTable = ({ data, title }) => {
  console.log(data)
  return (
    <div className="recipeTable">
      {data ? <h1 className="recipeTable__title">{`Recetas con "${title}"`}</h1> : null}
      <div className="recipeTable__container">
        {data?.map(e => {
          return (
            <div className="recipeTable__card">
              <h2>{e.recipe.label}</h2>
              <div className="recipeTable__body">
                <div className="recipeTable__ingredients">
                  <h4>Ingredientes:</h4>
                  <ul>
                  {e.recipe.ingredientLines.map(i => <li>{i}</li>)}
                  </ul>
                  <a href={e.recipe.url} rel="noopener noreferrer" target="_blank">Link a la receta</a>
                </div>
                <img src={e.recipe.image} alt={e.recipe.label} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default RecipeTable;
