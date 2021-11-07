
import axios from "axios";
import EnvData from "../../../config/EnvData";
import { fetchDashBoardLoading, fetchDashBoardSuccess } from "./actionCreators";
import dataHttpServices from '../../../services/devices';


export const fetchDashBoardData = () => async (dispatch) => {
  dispatch(fetchDashBoardLoading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let token;
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON);
    userId = user.data.id;
    token = user.data.id;
  }
  try {
    const response = await axios.get(
      `${EnvData.REACT_APP_API_URL}dashboard_data/${userId}/${dataHttpServices.endpointDateRange}/${dataHttpServices.endpointDataTimeInterval}`, {
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    );
    dispatch(fetchDashBoardSuccess(response.data.authenticatedData));
    dispatch(fetchDashBoardLoading(false))
  } catch (error) {
    dispatch(fetchDashBoardLoading(error));
  }
};