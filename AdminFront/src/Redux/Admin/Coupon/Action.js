import api from "../../../config/api";
import {CREATE_COUPON_REQUEST,CREATE_COUPON_SUCCESS,CREATE_COUPON_FAIL, GET_ALL_COUPON_REQUEST, GET_ALL_COUPON_SUCCESS, GET_ALL_COUPON_FAIL,
} from "./ActionType";

export const createdCoupon = (couponData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_COUPON_REQUEST });

    const { data } = await api.post("/api/coupons/create", couponData);

    dispatch({
      type: CREATE_COUPON_SUCCESS,
      payload: data, // ✅ this should be actual data
    });
  } catch (err) {
    dispatch({
      type: CREATE_COUPON_FAIL,
      payload:
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export const getAllCoupons = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_COUPON_REQUEST });

    const { data } = await api.get("/api/coupons/all_coupon");

    // 🛠 Fix here: if your data looks like { coupons: [...] }
    dispatch({
      type: GET_ALL_COUPON_SUCCESS,
      payload: data.coupons || [], // ensure it's an array
    });
  } catch (err) {
    dispatch({
      type: GET_ALL_COUPON_FAIL,
      payload:
        err.response?.data?.message || err.message,
    });
  }
};


