import api from "../../../config/api";
import {CREATE_COUPON_REQUEST,CREATE_COUPON_SUCCESS,CREATE_COUPON_FAIL, GET_ALL_COUPON_REQUEST, GET_ALL_COUPON_SUCCESS, GET_ALL_COUPON_FAIL, DELETE_REQUEST, DELETE_SUCCESS, DELETE_FAIL, UPDATE_COUPON_REQUEST, UPDATE_COUPON_SUCCESS, UPDATE_COUPON_FAIL,
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

export const deleteCoupon = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_REQUEST });

    const { data } = await api.delete(`/api/coupons/delete/${id}`);

    dispatch({
      type: DELETE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DELETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const updateCoupon = (couponData, id) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_COUPON_REQUEST }); // Or a new type like UPDATE_COUPON_REQUEST

    const { data } = await api.put(`/api/coupons/update/${id}`, couponData);

    dispatch({
      type: UPDATE_COUPON_SUCCESS, // Or a new type like UPDATE_COUPON_SUCCESS
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_COUPON_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};



