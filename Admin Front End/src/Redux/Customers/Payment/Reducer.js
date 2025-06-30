import { CREATE_PAYMENT_FAILURE, CREATE_PAYMENT_REQUEST, CREATE_PAYMENT_SUCCESS, UPDATE_PAYMENT_FAILURE, UPDATE_PAYMENT_REQUEST, UPDATE_PAYMENT_SUCCESS,    GET_PAYMENT_HISTORY_REQUEST,
    GET_PAYMENT_HISTORY_SUCCESS,
    GET_PAYMENT_HISTORY_FAILURE, } from "./ActionType";

//  const initialState = {};

const initialState = {
  loading: false,
  history: [],
  error: "",
};
  
 // Payment reducer to handle creating a payment
 export const paymentReducer = (state = initialState, action) => {
   switch (action.type) {
     case CREATE_PAYMENT_REQUEST:
       return {
         loading: true,
       };
     case CREATE_PAYMENT_SUCCESS:
       return {
         loading: false,
         success: true,
         paymentResult: action.payload,
       };
     case CREATE_PAYMENT_FAILURE:
       return {
         loading: false,
         error: action.payload,
       };
       case UPDATE_PAYMENT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        payment: action.payload,
        error: "",
      };
    case UPDATE_PAYMENT_FAILURE:
      return {
        ...state,
        loading: false,
        payment: {},
        error: action.payload,
      };
          case GET_PAYMENT_HISTORY_REQUEST:
      return { ...state, loading: true };
    case GET_PAYMENT_HISTORY_SUCCESS:
      return { loading: false, history: action.payload, error: "" };
    case GET_PAYMENT_HISTORY_FAILURE:
      return { loading: false, history: [], error: action.payload };
     default:
       return state;
   }
 };