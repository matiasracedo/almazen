import * as A from "../constants/constantes.js";

const initialState = {
  products: [],
  product: [],
  categories: [],
  category: [],
  orders: [],
  users: [],
  order: null,
  cartCounter: 0,
  reviews: null,
  dataUser: null,
  cartProducts: null,
  cartOrder: {},
  recipes: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    /* futuro productReducer */
    case A.GET_PRODUCT: //Labura con la ruta /search?name=
      return {
        ...state,
        products: action.payload,
      };
    case A.GET_ALL_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };
    case A.DEL_PRODUCT: {
      return {
        ...state,
        products: state.products.filter(
          (product) => product.id !== parseInt(action.payload.id)
        ),
      };
    }
    case A.GET_PRODUCT_BY_ID:
      return {
        ...state,
        product: [action.payload],
      };
    case A.UPDATE_PRODUCT:
      return state;
    /* futuro categoryReducer */
    case A.GET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    case A.ADD_CATEGORY:
      return {
        ...state,
        categories: state.categories.concat(action.payload),
      };
    case A.GET_BY_CATEGORY:
      return {
        ...state,
        products: action.payload,
      };

    case A.DEL_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(
          (category) => category.id !== parseInt(action.payload)
        ),
      };
    case A.GET_CAT_BY_ID:
      return {
        ...state,
        category: [action.payload],
      };
    case A.EDIT_CATEGORY:
      return {
        ...state,
        category: [action.payload],
      };
    /* futuro userReducer */
    case A.GET_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case A.GET_CART:
      if (action.payload.order) {
        return {
          ...state,
          cartOrder: {
            id: action.payload.order.id,
            status: action.payload.order.status,
          },
          cartProducts: [...action.payload.order.products ],
          cartCounter: action.payload.count /* action.payload.order.products.orderLine */
        };
      }
    case A.DEL_USER:
      return {
        ...state,
        users: state.users.filter(
          (user) => user.id !== parseInt(action.payload.id)
        ),
      };
    case A.GET_ORDERS:
      return {
        ...state,
        orders: action.payload,
      };
    case A.GET_ORDER_BY_ID:
      return {
        ...state,
        order: action.payload,
      };
    case A.EDIT_ORDER:
      return {
        ...state,
        order: action.payload,
      };
    case A.SET_CART_COUNTER:
      return {
        ...state,
        cartCounter: action.payload,
      };
    case A.GET_REVIEWS:
      return {
        ...state,
        reviews: action.payload,
      };
    case A.ADD_DATA_USER:
      return {
        ...state,
        dataUser: action.payload,
      };
    case A.ADD_CART_PRODUCT:
      return {
        ...state,
        cartProducts: action.payload,
      };
    case A.GET_RECIPES:
      return {
        ...state,
        recipes: action.payload
      }

    default:
      return state;
  }
};
export default reducer;
