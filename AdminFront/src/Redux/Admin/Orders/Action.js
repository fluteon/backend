
import api from "../../../config/api";
import {
  canceledOrderFailure,
  canceledOrderRequest,
  canceledOrderSuccess,
  confirmedOrderFailure,
  confirmedOrderRequest,
  confirmedOrderSuccess,
  deleteOrderFailure,
  deleteOrderRequest,
  deleteOrderSuccess,
  deliveredOrderFailure,
  deliveredOrderRequest,
  deliveredOrderSuccess,
  getOrdersFailure,
  getOrdersRequest,
  getOrdersSuccess,
  shipOrderFailure,
  shipOrderRequest,
  shipOrderSuccess,
    outForDeliveryOrderFailure,
  outForDeliveryOrderRequest,
  outForDeliveryOrderSuccess,
    returnedOrderRequest,
  returnedOrderSuccess,
  returnedOrderFailure,
  dashboardOverviewRequest,
  dashboardOverviewSuccess,
  dashboardOverviewFailure,
} from "./ActionCreator";



// export const getOrders = ({ page = 1, pageSize = 10 } = {}) => {
//   return async (dispatch) => {
//     dispatch(getOrdersRequest());
//     try {
//       const response = await api.get(`/api/admin/orders?page=${page}&pageSize=${pageSize}`);
//       dispatch(getOrdersSuccess(response.data));
//     } catch (error) {
//       dispatch(getOrdersFailure(error.message));
//     }
//   };
// };

export const getOrders = ({ page = 1, pageSize = 10, status = "", sort = "Newest" } = {}) => {
  return async (dispatch) => {
    dispatch(getOrdersRequest());
    try {
      const response = await api.get("/api/admin/orders", {
        params: {
          page,
          pageSize,
          status,
          sort,
        },
      });
      dispatch(getOrdersSuccess(response.data));
    } catch (error) {
      dispatch(getOrdersFailure(error.message));
    }
  };
};



export const confirmOrder = (orderId) => async (dispatch) => {
  dispatch(confirmedOrderRequest());

  try {
    const response = await api.put(
      `/api/admin/orders/${orderId}/confirmed`
    );
    const data = response.data;
    console.log("confirm_order ",data)
    dispatch(confirmedOrderSuccess(data));
  } catch (error) {
    dispatch(confirmedOrderFailure(error.message));
  }
};

export const shipOrder = (orderId) => {
  return async (dispatch) => {
    try {
      dispatch(shipOrderRequest());
      const {data} = await api.put(`/api/admin/orders/${orderId}/ship`);
      console.log(" shipped order",data)
      dispatch(shipOrderSuccess(data));
    } catch (error) {
      dispatch(shipOrderFailure(error.message));
    }
  };
};

export const deliveredOrder = (orderId) => async (dispatch) => {
  dispatch(deliveredOrderRequest());

  try {
    const response = await api.put(
      `/api/admin/orders/${orderId}/deliver`
    );
    const data = response.data;
    console.log("dilivered order ",data)
    dispatch(deliveredOrderSuccess(data));
  } catch (error) {
    dispatch(deliveredOrderFailure(error.message));
  }
};

export const cancelOrder = (orderId) => async (dispatch) => {
  dispatch(canceledOrderRequest());

  try {
    const response = await api.put(
      `/api/admin/orders/${orderId}/cancel`
    );
    const data = response.data;
    dispatch(canceledOrderSuccess(data));
  } catch (error) {
    dispatch(canceledOrderFailure(error.message));
  }
};

// Async action creator for deleting an order
export const deleteOrder = (orderId) => {
  return async(dispatch) => {
    dispatch(deleteOrderRequest());     
   try {
     const {data} = await api.delete(`/api/admin/orders/${orderId}/delete`);
     console.log("delete order ",data)
     dispatch(deleteOrderSuccess(orderId));
   } catch (error) {
    console.log("catch error ",error)
     dispatch(deleteOrderFailure(error));
   }
      
  };
};

// export const placeOrder = (order) => async (dispatch) => {
//   dispatch(placedOrderRequest());

//   try {
//     const response = await api.post(`/api/admin/orders/`, order);
//     const data = response.data;
//     dispatch(placedOrderSuccess(data));
//   } catch (error) {
//     dispatch(placedOrderFailure(error.message));
//   }
// };


export const outForDeliveryOrder = (orderId) => async (dispatch) => {
  dispatch(outForDeliveryOrderRequest());

  try {
    const response = await api.put(`/api/admin/orders/${orderId}/out-for-delivery`);
    const data = response.data;
    console.log("out-for-delivery order", data);
    dispatch(outForDeliveryOrderSuccess(data));
  } catch (error) {
    dispatch(outForDeliveryOrderFailure(error.message));
  }
};

export const returnedOrder = (payload) => async (dispatch) => {
  dispatch(returnedOrderRequest());

  try {
    const response = await api.put(
      `/api/admin/orders/${payload.orderId}/return/approve`,
      payload // send payload to backend if needed
    );
    const data = response.data;
    console.log("returned order", data);
    dispatch(returnedOrderSuccess(data));
  } catch (error) {
    dispatch(returnedOrderFailure(error.message));
  }
};

export const fetchDashboardOverview = () => async (dispatch) => {
  dispatch(dashboardOverviewRequest());

  try {
    const response = await api.get("/api/admin/orders/overview"); // No JWT needed
    const data = response.data?.data || {};
    console.log("📊 Dashboard overview data:", data);
    dispatch(dashboardOverviewSuccess(data));
  } catch (error) {
    console.error("❌ Dashboard fetch error:", error.message);
    dispatch(dashboardOverviewFailure(error.message));
  }
};
