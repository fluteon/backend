import axios from 'axios';
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
import api, { API_BASE_URL } from '../../config/api';

// Register action creators
const registerRequest = () => ({ type: REGISTER_REQUEST });
const registerSuccess = (user) => ({ type: REGISTER_SUCCESS, payload:user });
const registerFailure = error => ({ type: REGISTER_FAILURE, payload: error });

export const register = userData => async dispatch => {
  dispatch(registerRequest());
  try {
    const response=await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    const user = response.data;
    if(user.jwt) localStorage.setItem("jwt",user.jwt)
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
    const response = await axios.post(`${API_BASE_URL}/auth/signin`, userData);
    const user = response.data;
    if(user.jwt) localStorage.setItem("jwt",user.jwt)
    console.log("login ",user)
    dispatch(loginSuccess(user));
  } catch (error) {
    const errorMessage =
  error.response?.data?.message || "Login failed. Please try again.";
dispatch(loginFailure(errorMessage));
  }
};



//  get user from token
export const getUser = (token) => {
  return async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST });
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/profile`,{
        headers:{
          "Authorization":`Bearer ${token}`
        }
      });
      const user = response.data;
      dispatch({ type: GET_USER_SUCCESS, payload: user });
      console.log("req User ",user)
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: GET_USER_FAILURE, payload: errorMessage });
    }
  };
};

export const allUser = () => {
  return async (dispatch) => {
    dispatch({ type: GET_ALL_USERS_REQUEST }); // optional but good for loading state

    try {
      const response = await axios.get(`${API_BASE_URL}/api/users`);
      const users = response.data;

      console.log("all users..", users);

      dispatch({ type: GET_ALL_USERS_SUCCESS, payload: users }); // ✅ CORRECTED
    } catch (err) {
      const errorMessage = err.message;
      dispatch({ type: GET_ALL_USERS_FAILURE, payload: errorMessage });
    }
  };
};


export const logout = (token) => {
    return async (dispatch) => {
      dispatch({ type: LOGOUT });
      localStorage.clear();
    };
  };
