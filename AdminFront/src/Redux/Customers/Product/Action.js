import axios from "axios";

import {
  FIND_PRODUCTS_BY_CATEGORY_REQUEST,
  FIND_PRODUCTS_BY_CATEGORY_SUCCESS,
  FIND_PRODUCTS_BY_CATEGORY_FAILURE,
  FIND_PRODUCT_BY_ID_REQUEST,
  FIND_PRODUCT_BY_ID_SUCCESS,
  FIND_PRODUCT_BY_ID_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
  FETCH_HOMEPAGE_CATEGORY_PRODUCTS_REQUEST,
  FETCH_HOMEPAGE_CATEGORY_PRODUCTS_SUCCESS,
  FETCH_HOMEPAGE_CATEGORY_PRODUCTS_FAILURE,
  SEARCH_PRODUCTS_REQUEST,
  SEARCH_PRODUCTS_SUCCESS,
  SEARCH_PRODUCTS_FAILURE,
} from "./ActionType";
import api, { API_BASE_URL } from "../../../config/api";

export const findProducts = (reqData) => async (dispatch) => {
  try {
    dispatch({ type: FIND_PRODUCTS_BY_CATEGORY_REQUEST });

    // Build filtered query only with values
    const params = new URLSearchParams();

    if (reqData.colors?.length > 0) params.append("color", reqData.colors);
    if (reqData.sizes?.length > 0) params.append("size", reqData.sizes);
    if (reqData.minPrice) params.append("minPrice", reqData.minPrice);
    if (reqData.maxPrice) params.append("maxPrice", reqData.maxPrice);
    if (reqData.minDiscount) params.append("minDiscount", reqData.minDiscount);
    if (reqData.category) params.append("category", reqData.category);
    if (reqData.stock) params.append("stock", reqData.stock);
    if (reqData.sort) params.append("sort", reqData.sort);
    if (reqData.pageNumber) params.append("pageNumber", reqData.pageNumber);
    if (reqData.pageSize) params.append("pageSize", reqData.pageSize);

    console.log("🔗 Filtered Query String:", params.toString());

    const { data } = await api.get(`/api/products?${params.toString()}`);

    console.log("📦 API Response Data:", data);
    dispatch({ type: FIND_PRODUCTS_BY_CATEGORY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FIND_PRODUCTS_BY_CATEGORY_FAILURE,
      payload:
        error.response?.data?.message || error.message,
    });
  }
};


export const findProductById = (reqData) => async (dispatch) => {
  try {
    dispatch({ type: FIND_PRODUCT_BY_ID_REQUEST });

    const { data } = await api.get(`/api/products/id/${reqData.productId}`);

    console.log("products by  id : ", data);
    dispatch({
      type: FIND_PRODUCT_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FIND_PRODUCT_BY_ID_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// export const createProduct = (product) => async (dispatch) => {
//   try {
//     dispatch({ type: CREATE_PRODUCT_REQUEST });

//     const { data } = await api.post(
//       `${API_BASE_URL}/api/admin/products/`,
//       product.data
//     );

//     dispatch({
//       type: CREATE_PRODUCT_SUCCESS,
//       payload: data,
//     });

//     console.log("created product ", data);
//   } catch (error) {
//     dispatch({
//       type: CREATE_PRODUCT_FAILURE,
//       payload:
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message,
//     });
//   }
// };


export const createProduct = (product) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_PRODUCT_REQUEST });

    const { data } = await api.post(
      `${API_BASE_URL}/api/admin/products/`,
      product.data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${product.jwt}`,
        },
      }
    );

    dispatch({
      type: CREATE_PRODUCT_SUCCESS,
      payload: data,
    });

    console.log("created product ", data);
  } catch (error) {
    console.error("Create product error:", error.response?.data || error.message);
    dispatch({
      type: CREATE_PRODUCT_FAILURE,
      payload:
        error.response && (error.response.data.message || error.response.data.error)
          ? error.response.data.message || error.response.data.error
          : error.message,
    });
  }
};



export const updateProduct = (product) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });

    const { data } = await api.put(
      `${API_BASE_URL}/api/admin/products/${product.productId}`,
      product
    );
console.log("update product ",data)
    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteProduct = (productId) => async (dispatch) => {
  console.log("delete product action",productId)
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });

    let {data}=await api.delete(`/api/admin/products/${productId}`);

    console.log("delete product ",data)

    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: productId,
    });

    console.log("product delte ",data)
  } catch (error) {
    console.log("catch error ",error)
    dispatch({
      type: DELETE_PRODUCT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};


export const fetchHomepageCategoryProducts = (reqData) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_HOMEPAGE_CATEGORY_PRODUCTS_REQUEST });

    const params = new URLSearchParams();
    console.log("category second ...",params)
    if (reqData.category) params.append("category", reqData.category);
    if (reqData.pageNumber) params.append("pageNumber", reqData.pageNumber);
    if (reqData.pageSize) params.append("pageSize", reqData.pageSize);
    console.log("category second ...",params)
    const { data } = await api.get(`/api/products?${params.toString()}`);

    dispatch({ type: FETCH_HOMEPAGE_CATEGORY_PRODUCTS_SUCCESS, payload: data });
    return data; // ✅ Return so you can use in Homepage.js
  } catch (error) {
    dispatch({
      type: FETCH_HOMEPAGE_CATEGORY_PRODUCTS_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// export const searchProducts = (query) => async (dispatch) => {
//   try {
//     dispatch({ type: SEARCH_PRODUCTS_REQUEST });

//     const res = await api.get(`/api/products/search?query=${query}`);
//     console.log("Search results:", res.data); // ✅ Log here

//     dispatch({ type: SEARCH_PRODUCTS_SUCCESS, payload: res.data });
//     return res.data; // 👈 return for use in component
//   } catch (error) {
//     dispatch({ type: SEARCH_PRODUCTS_FAILURE, payload: error.message });
//     throw error; // 👈 to catch in component
//   }
// };

export const searchProducts = (query) => async (dispatch) => {
  try {
    dispatch({ type: SEARCH_PRODUCTS_REQUEST });

    const { data } = await api.get(`/api/products/search?query=${query}`);

    dispatch({ type: SEARCH_PRODUCTS_SUCCESS, payload: data });

    return data; // ⬅️ return to use in component
  } catch (error) {
    dispatch({ type: SEARCH_PRODUCTS_FAILURE, payload: error.message });
    throw error;
  }
};