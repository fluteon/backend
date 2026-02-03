import api, { API_BASE_URL } from '../../config/api';
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_FAILURE,
  LOGOUT
} from './ActionTypes';

// Register action creators
const registerRequest = () => ({ type: REGISTER_REQUEST });
const registerSuccess = (user) => ({ type: REGISTER_SUCCESS, payload:user });
const registerFailure = error => ({ type: REGISTER_FAILURE, payload: error });

export const register = userData => async dispatch => {
  dispatch(registerRequest());
  try {
    const response=await api.post(`/auth/signup`, userData);
    const user = response.data;
    if(user.jwt) sessionStorage.setItem("jwt",user.jwt)
    console.log("registerr :",user)
    dispatch(registerSuccess(user));
  } catch (error) {
    dispatch(registerFailure(error.message));
  }
};

// Login action creators
const loginRequest = () => ({ type: LOGIN_REQUEST });
const loginSuccess = user => ({ type: LOGIN_SUCCESS, payload: user });
const loginFailure = error => ({ type: LOGIN_FAILURE, payload: error });

export const login = userData => async dispatch => {
  dispatch(loginRequest());
  try {
    console.log('📡 Sending login request to:', `${API_BASE_URL}/auth/signin`);
    console.log('📦 Request data:', userData);
    
    const response = await api.post(`/auth/signin`, userData);
    const user = response.data;
    
    console.log('✅ Login response:', user);
    
    if(user.jwt) {
      sessionStorage.setItem("jwt", user.jwt);
      console.log('💾 JWT saved to sessionStorage');
    } else {
      console.warn('⚠️ No JWT in response');
    }
    
    dispatch(loginSuccess(user));
    return user;
  } catch (error) {
    console.error('❌ Login API error:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
    dispatch(loginFailure(errorMessage));
    throw error; // Re-throw so AdminLogin can catch it
  }
};



//  get user from token
export const getUser = (token) => {
  return async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST });
    try {
      const response = await api.get(`/api/users/profile`);
      const user = response.data;
      dispatch({ type: GET_USER_SUCCESS, payload: user });
      console.log("req User ",user)
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: GET_USER_FAILURE, payload: errorMessage });
    }
  };
};

// export const allUser = () => {
//   return async (dispatch) => {
//     dispatch({ type: GET_ALL_USERS_REQUEST }); // optional but good for loading state

//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/users`);
//       const users = response.data;

//       console.log("all users..", users);

//       dispatch({ type: GET_ALL_USERS_SUCCESS, payload: users }); // ✅ CORRECTED
//     } catch (err) {
//       const errorMessage = err.message;
//       dispatch({ type: GET_ALL_USERS_FAILURE, payload: errorMessage });
//     }
//   };
// };

export const allUser = (page = 1, limit = 10) => {
  return async (dispatch) => {
    dispatch({ type: GET_ALL_USERS_REQUEST });

    try {
      const response = await api.get(`/api/users?page=${page}&limit=${limit}`);

      const { users, totalPages, currentPage } = response.data;

      console.log("📊 All users fetched:", { users: users.length, totalPages, currentPage, page });

      dispatch({
        type: GET_ALL_USERS_SUCCESS,
        payload: { users, totalPages, currentPage },
      });
    } catch (err) {
      console.error("❌ Error fetching all users:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || err.message;
      dispatch({ type: GET_ALL_USERS_FAILURE, payload: errorMessage });
    }
  };
};

export const logout = (token) => {
    return async (dispatch) => {
      dispatch({ type: LOGOUT });
      sessionStorage.clear();
      localStorage.clear();
    };
  };
