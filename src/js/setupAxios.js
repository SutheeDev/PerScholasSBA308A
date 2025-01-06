import axios from "axios";
const accessToken = import.meta.env.VITE_ACCESS_TOKEN;

// Setup Axios
const apiClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
});

// Function to fetch API
const fetchData = async (method, endpoint, params = {}, data = {}) => {
  try {
    const response = await apiClient.request({
      method,
      url: endpoint,
      params,
      data,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default fetchData;
