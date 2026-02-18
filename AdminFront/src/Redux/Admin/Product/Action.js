import {
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
} from "./ActionType";
import api, { API_BASE_URL } from "../../../config/api";

export const updateProduct = (formData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });

    const productId = formData.get("productId");

    const { data } = await api.put(
      `${API_BASE_URL}/api/admin/products/${productId}`,
      formData, // must be FormData
      {
        headers: {
          "Content-Type": "multipart/form-data", // optional but safe
        },
      }
    );

    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAILURE,
      payload:
        error.response?.data?.message || error.message,
    });
  }
};
