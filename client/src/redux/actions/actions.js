import axios from "axios";
import * as A from "../constants/constantes";
import dotenv from "dotenv";
dotenv.config();
const {REACT_APP_URL} = process.env

let token = window.localStorage.getItem("token");


export const getProduct = (name) => {
  return function (dispatch) {
    axios.get(`${REACT_APP_URL}/search?name=${name}`).then((res) => {
      if (Array.isArray(res.data.result)) {
        dispatch({ type: A.GET_PRODUCT, payload: res.data.result });
      } else {
        return dispatch({ type: A.GET_PRODUCT, payload: [] });
      }
    });
  };
};
export const getAllProducts = () => {
  return function (dispatch) {
    axios
      .get(`${REACT_APP_URL}/products`)
      .then((res) => dispatch({ type: A.GET_ALL_PRODUCTS, payload: res.data }));
  };
};
export const getCategories = () => {
  return function (dispatch) {
    axios
      .get(`${REACT_APP_URL}/category/`)
      .then((res) => dispatch({ type: A.GET_CATEGORIES, payload: res.data }));
  };
};
export const addCategory = (name, description) => {
  return async (dispatch) => {
    token = await Promise.resolve(window.localStorage.getItem("token"));
    await axios
      .post(`${REACT_APP_URL}/products/category`, {
        name,
        description,
      },{
        headers:{Authorization:`Bearer ${token}`}
      })
      .then((res) =>
        dispatch({ type: A.ADD_CATEGORY, payload: res.data.createdCategory })
      );
  };
};

export const getByCategory = (name) => {
  return function (dispatch) {
    axios.get(`${REACT_APP_URL}/products/category/${name}`).then((res) => {
      if (Array.isArray(res.data)) {
        return dispatch({ type: A.GET_BY_CATEGORY, payload: res.data });
      } else {
        return dispatch({ type: A.GET_BY_CATEGORY, payload: [] });
      }
    });
  };
};
export const deleteProduct = (id) => {
  return async (dispatch) => {
    token = await Promise.resolve(window.localStorage.getItem("token"));
   await axios
      .delete(`${REACT_APP_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => dispatch({ type: A.DEL_PRODUCT, payload: { id } }));
  };
};

export const getProductById = (id) => {
  return function (dispatch) {
    axios.get(`${REACT_APP_URL}/products/${id}`).then((res) => {
      return dispatch({ type: A.GET_PRODUCT_BY_ID, payload: res.data });
    });
  };
};
export const deleteCategory = (id) => {
  return async (dispatch) => {
    token = await Promise.resolve(window.localStorage.getItem("token"));
   await axios
      .delete(`${REACT_APP_URL}/products/category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => dispatch({ type: A.DEL_CATEGORY, payload: id }));
  };
};
export const getCategoryById = (id) => {
  return function (dispatch) {
    axios
      .get(`${REACT_APP_URL}/category/${id}`)
      .then((res) => dispatch({ type: A.GET_CAT_BY_ID, payload: res.data }));
  };
};
export const editCategory = (payload, id) => {
  return function (dispatch) {
    axios
      .put(`${REACT_APP_URL}/products/category/${id}`, payload)
      .then((res) =>
        dispatch({ type: A.EDIT_CATEGORY, payload: { payload: res.data } })
      );
  };
};

export const updateProduct = (id, payload) => {
  return async (dispatch) => {
    token = await Promise.resolve(window.localStorage.getItem("token"));
    await axios
      .put(`${REACT_APP_URL}/products/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        return dispatch({
          type: A.UPDATE_PRODUCT,
          payload: res.data.productUpdated,
        });
      });
  };
};

export const getAllOrders = () => {
  return async (dispatch) => {
     token = await Promise.resolve(window.localStorage.getItem("token"));
   await axios
      .get(`${REACT_APP_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data)
      .then((resdata) => dispatch({ type: A.GET_ORDERS, payload: resdata }));
  };
};

export const getAllUsers = () => {
  return async (dispatch) =>{
     token = await Promise.resolve(window.localStorage.getItem("token"));
    await axios
      .get(`${REACT_APP_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data)
      .then((resdata) => dispatch({ type: A.GET_USERS, payload: resdata }));
  };
};

export const getCart = (userId) => {
  return async (dispatch) => {
    token= await Promise.resolve(window.localStorage.getItem("token"))
    await axios.get(`${REACT_APP_URL}/users/${userId}/cart`, { headers:{Authorization: `Bearer ${token}`}})
    .then((res) => {
      return dispatch({ type: A.GET_CART, payload: res.data });
    });
  };
};

export const getOrderById = (id) => {
  return async(dispatch) => {
    token = await Promise.resolve(window.localStorage.getItem("token"));
    await axios
      .get(`${REACT_APP_URL}/orders/${id}`, { headers:{Authorization: `Bearer ${token}`}})
      .then((res) => dispatch({ type: A.GET_ORDER_BY_ID, payload: res.data }));
  };
};

export const removeUser = (id) => {
  return async (dispatch) => {
    token = await Promise.resolve(window.localStorage.getItem("token"));
    await axios
      .delete(`${REACT_APP_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) =>
        dispatch({ type: A.DEL_USER, payload: { data: res.data, id } })
      );
  };
};

export const getReviews = (id) => {
  return function (dispatch) {
    axios
      .get(`${REACT_APP_URL}/products/${id}/review`)
      .then((res) => dispatch({ type: A.GET_REVIEWS, payload: res.data }));
  };
}  

export const editOrder = (status, id) => {
  return async (dispatch) =>{
    token = await Promise.resolve(window.localStorage.getItem("token"));
    await axios
      .put(`${REACT_APP_URL}/orders/${id}`, status, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => dispatch({ type: A.EDIT_ORDER, payload: res.data }));
  };
};

export const addDataUser = (user) => {
  return { type: A.ADD_DATA_USER, payload: user };
}

export const getRecipes = (name) => {
  const {
    REACT_APP_RECIPES_APP_KEY,
    REACT_APP_RECIPES_APP_ID,
  } = process.env;
  return function (dispatch) {
    axios
      .get(`https://api.edamam.com/search?q=${name}&app_id=${REACT_APP_RECIPES_APP_ID}&app_key=${REACT_APP_RECIPES_APP_KEY}`
      ).then((res) => {
        dispatch({ type: A.GET_RECIPES, payload: res.data });
      }
    );
  };
};

