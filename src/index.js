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

const fetchConfig = async () => {
  try {
    const data = await fetchData("GET", "/configuration");
    imgUrl = data.images.secure_base_url;
    imgSize = data.images.poster_sizes[3];
  } catch (error) {
    console.log(error);
  }
};

// const fetchConfig = fetchData("GET", "/configuration")
//   .then((data) => {
//     // console.log(data.images);
//     const imgUrl = data.images.secure_base_url;
//     const sizes = data.images.poster_sizes;
//     const imgSize = sizes[3];
//   })
//   .catch((error) => console.log(error));

const fetchPopularTv = async () => {
  try {
    const data = await fetchData("GET", "/tv/popular", {
      language: "en-US",
      page: "1",
    });
    const results = data.results;

    results.forEach((result) => {
      const imgPath = result.poster_path;
      const fullImgUrl = `${imgUrl}${imgSize}${imgPath}`;
      console.log(fullImgUrl);
    });
  } catch (error) {
    console.log(error);
  }
};

// const fetchPopularTv = fetchData("GET", "/tv/popular", {
//   language: "en-US",
//   page: "1",
// })
//   .then((data) => {
//     const results = data.results;
//     results.forEach((result) => {
//       const imgPath = result.poster_path;
//     });
//   })
//   .catch((error) => console.log(error));
