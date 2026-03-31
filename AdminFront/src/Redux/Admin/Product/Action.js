import {
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
} from "./ActionType";
import api, { API_BASE_URL } from "../../../config/api";

export const updateProduct = (formData) => async (dispatch) => {
  console.log("🚀 REDUX THUNK: updateProduct action dispatched!");
  dispatch({ type: UPDATE_PRODUCT_REQUEST });

  try {
    const productId = formData.get("productId");
    console.log(`📡 Sending api.put to /api/admin/products/${productId}...`);

    const response = await api.put(
      `${API_BASE_URL}/api/admin/products/${productId}`,
      formData
    );
    
    console.log("✅ api.put returned response:", response.data);

    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: response.data,
    });

    return response.data;
  } catch (error) {
    console.error("❌ api.put threw error:", error);
    dispatch({
      type: UPDATE_PRODUCT_FAILURE,
      payload: error.response?.data?.error || error.message || "Update failed",
    });
    throw error; // Re-throw so component catch block works
  }
};
