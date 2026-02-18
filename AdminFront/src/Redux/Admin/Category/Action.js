import {
  GET_ALL_CATEGORIES_REQUEST,
  GET_ALL_CATEGORIES_SUCCESS,
  GET_ALL_CATEGORIES_FAILURE,
  GET_CATEGORY_HIERARCHY_REQUEST,
  GET_CATEGORY_HIERARCHY_SUCCESS,
  GET_CATEGORY_HIERARCHY_FAILURE,
  GET_CATEGORIES_BY_LEVEL_REQUEST,
  GET_CATEGORIES_BY_LEVEL_SUCCESS,
  GET_CATEGORIES_BY_LEVEL_FAILURE,
  GET_CHILD_CATEGORIES_REQUEST,
  GET_CHILD_CATEGORIES_SUCCESS,
  GET_CHILD_CATEGORIES_FAILURE,
  CREATE_CATEGORY_REQUEST,
  CREATE_CATEGORY_SUCCESS,
  CREATE_CATEGORY_FAILURE,
  UPDATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAILURE,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAILURE,
} from "./ActionType";
import api from "../../../config/api";

// Get all categories
export const getAllCategories = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_CATEGORIES_REQUEST });

    console.log("📥 Fetching all categories from:", api.defaults.baseURL);
    const { data } = await api.get(`/api/admin/categories`);
    console.log("✅ Fetched", data.length, "categories");

    dispatch({
      type: GET_ALL_CATEGORIES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    console.error("Response:", error.response?.data);
    dispatch({
      type: GET_ALL_CATEGORIES_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};

// Get category hierarchy
export const getCategoryHierarchy = () => async (dispatch) => {
  try {
    dispatch({ type: GET_CATEGORY_HIERARCHY_REQUEST });

    const { data } = await api.get(`/api/admin/categories/hierarchy`);

    dispatch({
      type: GET_CATEGORY_HIERARCHY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_CATEGORY_HIERARCHY_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};

// Get categories by level
export const getCategoriesByLevel = (level) => async (dispatch) => {
  try {
    dispatch({ type: GET_CATEGORIES_BY_LEVEL_REQUEST });

    const { data } = await api.get(`/api/admin/categories/level/${level}`);

    dispatch({
      type: GET_CATEGORIES_BY_LEVEL_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_CATEGORIES_BY_LEVEL_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};

// Get child categories
export const getChildCategories = (parentId) => async (dispatch) => {
  try {
    dispatch({ type: GET_CHILD_CATEGORIES_REQUEST });

    const { data } = await api.get(`/api/admin/categories/children/${parentId}`);

    dispatch({
      type: GET_CHILD_CATEGORIES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_CHILD_CATEGORIES_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};

// Create category
export const createCategory = (categoryData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_CATEGORY_REQUEST });

    const { data } = await api.post(
      `/api/admin/categories`,
      categoryData
    );

    dispatch({
      type: CREATE_CATEGORY_SUCCESS,
      payload: data,
    });

    // Refresh all categories
    dispatch(getAllCategories());
  } catch (error) {
    dispatch({
      type: CREATE_CATEGORY_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};

// Update category
export const updateCategory = (categoryId, categoryData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_CATEGORY_REQUEST });

    const { data } = await api.put(
      `/api/admin/categories/${categoryId}`,
      categoryData
    );

    dispatch({
      type: UPDATE_CATEGORY_SUCCESS,
      payload: data,
    });

    // Refresh all categories
    dispatch(getAllCategories());
  } catch (error) {
    dispatch({
      type: UPDATE_CATEGORY_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};

// Delete category
export const deleteCategory = (categoryId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_CATEGORY_REQUEST });

    const { data } = await api.delete(
      `/api/admin/categories/${categoryId}`
    );

    dispatch({
      type: DELETE_CATEGORY_SUCCESS,
      payload: { categoryId, message: data.message },
    });

    // Refresh all categories
    dispatch(getAllCategories());
  } catch (error) {
    dispatch({
      type: DELETE_CATEGORY_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};
