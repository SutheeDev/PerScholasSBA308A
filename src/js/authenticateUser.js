import fetchData from "./setupAxios";

const apiKey = import.meta.env.VITE_API_KEY;

const authenticateUser = async () => {
  try {
    const response = await fetchData("GET", "authentication/token/new", {
      api_key: apiKey,
    });
    const token = response.request_token;
    const url = `https://www.themoviedb.org/authenticate/${token}?redirect_to=http://localhost:5173//approved`;
    window.location.href = url;
  } catch (error) {
    console.log(error);
  }
};

export default authenticateUser;
