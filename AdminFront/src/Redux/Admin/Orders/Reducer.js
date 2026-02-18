import {
  CANCELED_ORDER_FAILURE,
  CANCELED_ORDER_REQUEST,
  CANCELED_ORDER_SUCCESS,
  CONFIRMED_ORDER_FAILURE,
  CONFIRMED_ORDER_REQUEST,
  CONFIRMED_ORDER_SUCCESS,
  DELETE_ORDER_FAILURE,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELIVERED_ORDER_FAILURE,
  DELIVERED_ORDER_REQUEST,
  DELIVERED_ORDER_SUCCESS,
  GET_ORDERS_FAILURE,
  GET_ORDERS_REQUEST,
  GET_ORDERS_SUCCESS,
  OUT_FOR_DELIVERY_ORDER_FAILURE,
  OUT_FOR_DELIVERY_ORDER_REQUEST,
  OUT_FOR_DELIVERY_ORDER_SUCCESS,
  PLACED_ORDER_FAILURE,
  PLACED_ORDER_REQUEST,
  PLACED_ORDER_SUCCESS,
  SHIP_ORDER_FAILURE,
  SHIP_ORDER_REQUEST,
  SHIP_ORDER_SUCCESS,
    RETURNED_ORDER_REQUEST,
  RETURNED_ORDER_SUCCESS,
  RETURNED_ORDER_FAILURE,
    DASHBOARD_OVERVIEW_REQUEST,
  DASHBOARD_OVERVIEW_SUCCESS,
  DASHBOARD_OVERVIEW_FAILURE,
} from "./ActionType";

const initialState = {
  loading: false,
  orders: [],
  overview: {},
  currentPage: 1,
  totalPages: 1,
  error: "",
};

const adminOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ORDERS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    // case GET_ORDERS_SUCCESS:
    //   return {
    //     loading: false,
    //     orders: action.payload,
    //     error: "",
    //   };
    case GET_ORDERS_SUCCESS:
  return {
    ...state,
    loading: false,
    orders: action.payload.content, // 🟢 the paginated orders array
    totalPages: action.payload.totalPages, // 🟢 total pages returned from backend
    currentPage: action.payload.currentPage, // 🟢 current page
    error: "",
  };

    case GET_ORDERS_FAILURE:
      return {
        loading: false,
        orders: [],
        error: action.payload,
      };
    case CONFIRMED_ORDER_REQUEST:
    case PLACED_ORDER_REQUEST:
    case DELIVERED_ORDER_REQUEST:
    case CANCELED_ORDER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case CONFIRMED_ORDER_SUCCESS:
      return {
        ...state,
        confirmed: action.payload,
        isLoading: false,
      };
    case PLACED_ORDER_SUCCESS:
      return {
        ...state,
        placed: action.payload,
        isLoading: false,
      };
    case DELIVERED_ORDER_SUCCESS:
      return {
        ...state,
        delivered: action.payload,
        isLoading: false,
      };
    case CANCELED_ORDER_SUCCESS:
      return {
        ...state,
        canceled: action.payload,
        isLoading: false,
      };

    case CONFIRMED_ORDER_FAILURE:
    case PLACED_ORDER_FAILURE:
    case DELIVERED_ORDER_FAILURE:
    case CANCELED_ORDER_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case DELETE_ORDER_REQUEST:
      return { ...state, loading: true };
    case DELETE_ORDER_SUCCESS:
      return { ...state, loading: false, orders:state.orders.filter((order)=>order._id!==action.payload) };
    case DELETE_ORDER_FAILURE:
      return { ...state, loading: false, error: action.payload };

      case SHIP_ORDER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case SHIP_ORDER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        shipped:action.payload
      };
    case SHIP_ORDER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
      case OUT_FOR_DELIVERY_ORDER_REQUEST:
  return { ...state, loading: true };

case OUT_FOR_DELIVERY_ORDER_SUCCESS:
  return {
    ...state,
    loading: false,
    orders: state.orders.map((order) =>
      order._id === action.payload._id ? action.payload : order
    ),
  };

case OUT_FOR_DELIVERY_ORDER_FAILURE:
  return { ...state, loading: false, error: action.payload };
      case RETURNED_ORDER_REQUEST:
      return { ...state, loading: true };

    case RETURNED_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        ),
      };

    case RETURNED_ORDER_FAILURE:
      return { ...state, loading: false, error: action.payload };
          case DASHBOARD_OVERVIEW_REQUEST:
      return { ...state, loading: true, error: null };

    case DASHBOARD_OVERVIEW_SUCCESS:
      return { ...state, loading: false, overview: action.payload };

    case DASHBOARD_OVERVIEW_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default adminOrderReducer;
