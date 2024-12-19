import axios from "axios";
const accessToken = import.meta.env.VITE_ACCESS_TOKEN;

const apiClient = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
});

const fetchData = async (method, endpoint, params = {}) => {
  try {
    const response = await apiClient.request({
      method,
      url: endpoint,
      params,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

let imgUrl = "";
let imgSize = "";

// Fetch config to get image url and size to use for full image url
const fetchConfig = async () => {
  try {
    const data = await fetchData("GET", "/configuration");
    imgUrl = data.images.secure_base_url;
    imgSize = data.images.poster_sizes[3];
  } catch (error) {
    console.log(error);
  }
};

const fetchPopularTv = async () => {
  try {
    const data = await fetchData("GET", "/tv/popular", {
      language: "en-US",
      page: "1",
    });
    const results = data.results;

    results.forEach((result) => {
      // Get image path and assemble the full image url
      const imgPath = result.poster_path;
      const fullImgUrl = `${imgUrl}${imgSize}${imgPath}`;
      // console.log(result);

      // Gte name of the show
      const name = result.original_name;
      // Get id (need it later when fetch individual show???)
      const show_id = result.id;
      // For Genres, need to compare with genres object from 'https://api.themoviedb.org/3/genre/tv/list'
      const genre_ids = result.genre_ids; // array
      console.log(name, show_id, genre_ids);
    });
  } catch (error) {
    console.log(error);
  }
};

const initiatePage = async () => {
  await fetchConfig();
  await fetchPopularTv();
};

initiatePage();
