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

const initialState = {
  categories: [],
  categoryHierarchy: {},
  categoriesByLevel: [],
  childCategories: [],
  loading: false,
  error: null,
  success: null,
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    // Get all categories
    case GET_ALL_CATEGORIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_ALL_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: action.payload,
        error: null,
      };
    case GET_ALL_CATEGORIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get category hierarchy
    case GET_CATEGORY_HIERARCHY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_CATEGORY_HIERARCHY_SUCCESS:
      return {
        ...state,
        loading: false,
        categoryHierarchy: action.payload,
        error: null,
      };
    case GET_CATEGORY_HIERARCHY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get categories by level
    case GET_CATEGORIES_BY_LEVEL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_CATEGORIES_BY_LEVEL_SUCCESS:
      return {
        ...state,
        loading: false,
        categoriesByLevel: action.payload,
        error: null,
      };
    case GET_CATEGORIES_BY_LEVEL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get child categories
    case GET_CHILD_CATEGORIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_CHILD_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        childCategories: action.payload,
        error: null,
      };
    case GET_CHILD_CATEGORIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Create category
    case CREATE_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: null,
      };
    case CREATE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        success: "Category created successfully",
        error: null,
      };
    case CREATE_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: null,
      };

    // Update category
    case UPDATE_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: null,
      };
    case UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        success: "Category updated successfully",
        error: null,
      };
    case UPDATE_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: null,
      };

    // Delete category
    case DELETE_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: null,
      };
    case DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload.message,
        categories: state.categories.filter(
          (cat) => cat._id !== action.payload.categoryId
        ),
        error: null,
      };
    case DELETE_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: null,
      };

    default:
      return state;
  }
};

export default categoryReducer;
