import {
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
} from "./ActionType";
import api, { API_BASE_URL } from "../../../config/api";

export const updateProduct = (formData) => async (dispatch) => {
  dispatch({ type: UPDATE_PRODUCT_REQUEST });

  try {
    const productId = formData.get("productId");

    const { data } = await api.put(
      `${API_BASE_URL}/api/admin/products/${productId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data,
    });

    return data;
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAILURE,
      payload: error.response?.data?.error || error.message || "Update failed",
    });
    throw error; // Re-throw so component catch block works
  }
};
