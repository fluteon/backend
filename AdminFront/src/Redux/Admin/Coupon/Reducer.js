// reducers/couponReducer.js

import { accordionActionsClasses } from "@mui/material";
import {
  CREATE_COUPON_REQUEST,
  CREATE_COUPON_SUCCESS,
  CREATE_COUPON_FAIL,
  GET_ALL_COUPON_REQUEST, GET_ALL_COUPON_SUCCESS, GET_ALL_COUPON_FAIL,
  DELETE_REQUEST,
  DELETE_SUCCESS,
  DELETE_FAIL,
  UPDATE_COUPON_REQUEST,
  UPDATE_COUPON_SUCCESS,
  UPDATE_COUPON_FAIL,
} from "./ActionType";

const initialState = {
  loading: false,
  success: false,
  coupon: null,
  coupons: [],
  message: "",
  error: null,
};

export const createdCouponReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_COUPON_REQUEST:
      return { ...state, loading: true };

    case CREATE_COUPON_SUCCESS:
      return {
        loading: false,
        success: true,
        coupon: action.payload.coupon,
        message: action.payload.message,
        error: null,
      };

    case CREATE_COUPON_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };
          case GET_ALL_COUPON_REQUEST:
      return { ...state, loading: true };
case GET_ALL_COUPON_SUCCESS:
  return {
    ...state,
    loading: false,
    coupons: action.payload,
    error: null,
  };

    case GET_ALL_COUPON_FAIL:
      return { loading: false, coupons: [], error: action.payload };
    case DELETE_REQUEST:
      return{...state,loading:true}
    case DELETE_SUCCESS :
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload.message,
        coupons: state.coupons.filter(
          (coupon) => coupon._id !== action.payload.deletedCoupon._id
        ),
      };
      case DELETE_FAIL:
        return{loading:false,success:false,error:action.payload}
      
        case UPDATE_COUPON_REQUEST :
          return {...state,loading:true}
        case UPDATE_COUPON_SUCCESS:
  return {
    ...state,
    loading: false,
    success: true,
    message: action.payload.message,
    coupons: state.coupons.map((coupon) =>
      coupon._id === action.payload.updatedCoupon._id
        ? action.payload.updatedCoupon
        : coupon
    ),
  };
case UPDATE_COUPON_FAIL :
  return {loading:false, success:false, error:action.payload}
    default:
      return state;
  }
};
