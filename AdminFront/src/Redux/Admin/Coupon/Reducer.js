// reducers/couponReducer.js

import {
  CREATE_COUPON_REQUEST,
  CREATE_COUPON_SUCCESS,
  CREATE_COUPON_FAIL,
  GET_ALL_COUPON_REQUEST, GET_ALL_COUPON_SUCCESS, GET_ALL_COUPON_FAIL,
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

    default:
      return state;
  }
};
