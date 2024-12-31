import createCard from "./createCard";
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
let tvGenres;

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

      // Get genre array of each show
      const genre_ids = result.genre_ids; // array
      let genreArr = [];
      genre_ids.forEach((id) => {
        tvGenres.forEach((tvGenre) => {
          if (tvGenre.id === id) {
            genreArr.push(tvGenre.name);
          }
        });
      });

      createCard(name, fullImgUrl, show_id);
    });
  } catch (error) {
    console.log(error);
  }
};

const fetchGenreList = async () => {
  try {
    const response = await fetchData("GET", "/genre/tv/list");
    tvGenres = response.genres;
  } catch (error) {
    console.log(error);
  }
};

const initiatePage = async () => {
  await fetchConfig();
  await fetchGenreList();
  await fetchPopularTv();
};

initiatePage();
