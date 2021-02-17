import React, {lazy} from 'react';
import Typical from 'react-typical';
import './wrapper.scss';
const ProductsFeatured = lazy(()=> import('../ProductFeatured'));

const Wrapper = () => {
	document.title = 'AlmaZen';
	return (
		<>
      <div className="wrapper">
        <h1 className="wrapper__subtitulo">
          <Typical
            steps={[
							"Hola! 👋🏽 ",
              1000,
              "Bienvenidos a Nuestra Tienda  ",
              3000,
              "📣 Tenemos gran variedad de productos saludables ",
              3000,
            ]}
            loop={Infinity}
            wrapper="p"
          />
        </h1>
      </div>							
      <ProductsFeatured />
		</>
  );
};
export default Wrapper;
