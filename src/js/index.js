import createCard from "./createCard";
import axios from "axios";
const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
const apiKey = import.meta.env.VITE_API_KEY;

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
    // This doesn't work
    // const guest_id = await createGuestSession()
    //   .then((response) => {
    //     return response;
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

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

      // Get first_air_date
      const dateStr = result.first_air_date;
      const date = new Date(dateStr);
      const options = { month: "short", day: "numeric", year: "numeric" };
      const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
        date
      );

      // Get genre array of each show (Don't need it here!)
      // const genre_ids = result.genre_ids; // array
      // let genreArr = [];
      // genre_ids.forEach((id) => {
      //   tvGenres.forEach((tvGenre) => {
      //     if (tvGenre.id === id) {
      //       genreArr.push(tvGenre.name);
      //     }
      //   });
      // });

      createCard(name, fullImgUrl, show_id, formattedDate);
    });
  } catch (error) {
    console.log(error);
  }
};

// const fetchGenreList = async () => {
//   try {
//     const response = await fetchData("GET", "/genre/tv/list");
//     tvGenres = response.genres;
//   } catch (error) {
//     console.log(error);
//   }
// };

const createGuestSession = async () => {
  try {
    const response = await fetchData(
      "GET",
      "/authentication/guest_session/new"
    );
    const userId = response.guest_session_id;
    return userId;
  } catch (error) {
    console.log(error);
  }
};

export const addToWatchList = async (id) => {
  try {
    const response = await fetchData("POST", `account/${id}/watchlist`);
    console.log("added to watchlist!");
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const initiatePage = async () => {
  // Get the current URL
  const currentURL = window.location.href;

  // Turn the current url to object
  const urlObject = new URL(currentURL);

  // get search string
  const searchStr = urlObject.search;

  // Turn searchStr into a URLSearchParams object
  // This will provide some method we need to access the request_token
  // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
  const urlSearchParams = new URLSearchParams(searchStr);

  // Get the token
  const token = urlSearchParams.get("request_token");
  console.log(token);

  await fetchConfig();
  // await fetchGenreList();
  await fetchPopularTv();
  // await ceateGuestSession();
  // await authenticateUser();
};

initiatePage();

// Step to get account_id
// 1. Request a token
//    GET authentication/token/new
// 2. Forward the user to:
//    https://www.themoviedb.org/authenticate/{REQUEST_TOKEN}
// 3. Create a session_id
//    POST authentication/session/new
//    Need validated request_token and API_KEY here
//    Save the session_id
// 4. Get account ID
//    GET /account
//    Need sesion_id and API_KEY here
//    Save the account_id and use it when adding the watchList

export const authenticateUser = async () => {
  try {
    const response = await fetchData("GET", "authentication/token/new", {
      api_key: apiKey,
    });
    console.log(response.request_token);
    const token = response.request_token;
    const url = `https://www.themoviedb.org/authenticate/${token}?redirect_to=http://localhost:5173//approved`;
    window.location.href = url;
  } catch (error) {
    console.log(error);
  }
};
