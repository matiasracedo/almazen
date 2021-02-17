import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

/* Estilos de material-ui */
const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        marginTop: theme.spacing(2),
      },
    },
  }));

const PaginationComponent = ({ productsPerPage, totalProducts, paginate }) => {
  /* Estilos de material-ui */
  const classes = useStyles();

  /* Calculo el número de páginas según el total de productos sobre los productos
  a renderizar por página. */
  const pageNumbers = Math.ceil(totalProducts / productsPerPage);
  
  /* Se invoca a la función paginate con el número de página a la que se quiere acceder
  al hacer click en dicho número */
  const handleClick = function(e) {
        paginate(e.target.textContent)
  }

  /* Renderizado componente de paginación de material-ui. "count" es el número de páginas a renderizar */
  return (
    <div className={classes.root}>
        <Pagination
            count={pageNumbers}
            onClick={handleClick}
            variant="outlined" shape="rounded" 
            hidePrevButton
            hideNextButton
            color="primary"
        />
    </div>
  );
};

export default PaginationComponent;