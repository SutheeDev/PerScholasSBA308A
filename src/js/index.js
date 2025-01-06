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
export const fetchData = async (method, endpoint, params = {}, data = {}) => {
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

let imgUrl = "";
let imgSize = "";
let tvGenres;

// Fetch config to get image url and size to use for full image url
export const fetchConfig = async () => {
  try {
    const data = await fetchData("GET", "/configuration");
    imgUrl = data.images.secure_base_url;
    imgSize = data.images.poster_sizes[3];
  } catch (error) {
    console.log(error);
  }
};

const fetchPopularTv = async (account_id = "") => {
  try {
    // Get watchlist
    let watchListArr;
    if (account_id) {
      watchListArr = await getWatchList(account_id);
    }

    const data = await fetchData("GET", "/tv/popular", {
      language: "en-US",
      page: "1",
    });
    const results = data.results;

    results.forEach((result) => {
      const [name, fullImgUrl, show_id, formattedDate, isInWatchList] =
        generatePopularShowData(result, watchListArr);

      createCard(
        name,
        fullImgUrl,
        show_id,
        formattedDate,
        account_id,
        isInWatchList
      );
    });
  } catch (error) {
    console.log(error);
  }
};

export const getWatchList = async (account_id) => {
  try {
    const data = await fetchData("GET", `account/${account_id}/watchlist/tv`, {
      language: "en-US",
      page: "1",
      sort_by: "created_at.asc",
    });
    return data.results;
  } catch (error) {
    console.log(error);
  }
};

export const toggleWatchList = async (account_id, show_id) => {
  try {
    const addedShowArr = await getWatchList(account_id);

    const addedShow = addedShowArr.find(
      (showInWatchlist) => showInWatchlist.id === show_id
    );
    if (addedShow) {
      removeFromWatchList(account_id, show_id);
    } else {
      addToWatchList(account_id, show_id);
    }
  } catch (error) {
    console.log(error);
  }
};

const addToWatchList = async (account_id, show_id) => {
  try {
    await fetchData(
      "POST",
      `account/${account_id}/watchlist`,
      {},
      {
        media_type: "tv",
        media_id: show_id,
        watchlist: true,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const removeFromWatchList = async (account_id, show_id) => {
  try {
    await fetchData(
      "POST",
      `account/${account_id}/watchlist`,
      {},
      {
        media_type: "tv",
        media_id: show_id,
        watchlist: false,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const createSessionId = async (token) => {
  try {
    const response = await fetchData(
      "POST",
      "authentication/session/new",
      {},
      { request_token: token }
    );
    return response.session_id;
  } catch (error) {
    console.log(error);
  }
};

const getAccountId = async (sessionId) => {
  try {
    const response = await fetchData("GET", "/account", {
      api_key: apiKey,
      sesion_id: sessionId,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

let accountId;
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

  if (token) {
    // Create session_id
    const sessionId = await createSessionId(token);
    // Get account ID
    const response = await getAccountId(sessionId);
    accountId = response.id;
    await fetchConfig();
    await fetchPopularTv(accountId);
  } else {
    await fetchConfig();
    await fetchPopularTv();
  }
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
    const token = response.request_token;
    const url = `https://www.themoviedb.org/authenticate/${token}?redirect_to=http://localhost:5173//approved`;
    window.location.href = url;
  } catch (error) {
    console.log(error);
  }
};

// Search Functionality

const searchBar = document.querySelector(".searchbar");
const searchInput = document.getElementById("search");

const fetchSearchResult = async (searchValue) => {
  try {
    const response = await fetchData("GET", "/search/movie", {
      query: searchValue,
      include_adult: "false",
      language: "en-US",
      page: "1",
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

const submitSearchTerm = async (searchBar, account_id) => {
  searchBar.addEventListener("submit", async (e) => {
    e.preventDefault();
    await fetchConfig();

    let addedShowArr;
    if (account_id) {
      addedShowArr = await getWatchList(account_id);
      console.log(addedShowArr);
    }

    const searchValue = searchInput.value;
    const response = await fetchSearchResult(searchValue);
    const shows = response.results;

    clearCards();
    shows.forEach((show) => {
      const [name, fullImgUrl, show_id, formattedDate, isInWatchList] =
        generateSearchedShowData(show, addedShowArr);

      createCard(
        name,
        fullImgUrl,
        show_id,
        formattedDate,
        account_id,
        isInWatchList
      );
    });
  });
};

submitSearchTerm(searchBar, accountId);

const generatePopularShowData = (showObj, watchListArr) => {
  let isInWatchList = false;

  // Get image path and assemble the full image url
  let fullImgUrl;
  const imgPath = showObj.poster_path;
  // const fullImgUrl = `${imgUrl}${imgSize}${imgPath}`;
  if (imgPath) {
    fullImgUrl = `${imgUrl}${imgSize}${imgPath}`;
  } else {
    fullImgUrl =
      "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg";
  }

  // Get name of the showObj
  const name = showObj.original_name;

  // Get id
  const show_id = showObj.id;

  // Compare show_id with id of the shows in the watchlist
  if (watchListArr) {
    watchListArr.forEach((watchList) => {
      if (watchList.id === show_id) {
        isInWatchList = true;
      }
    });
  }

  // Get first_air_date
  const dateStr = showObj.first_air_date;
  const date = new Date(dateStr);
  const options = { month: "short", day: "numeric", year: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  return [name, fullImgUrl, show_id, formattedDate, isInWatchList];
};

const generateSearchedShowData = (showObj, watchListArr) => {
  let isInWatchList = false;

  let fullImgUrl;
  const imgPath = showObj.poster_path;
  if (imgPath) {
    fullImgUrl = `${imgUrl}${imgSize}${imgPath}`;
  } else {
    fullImgUrl =
      "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg";
  }

  const name = showObj.title;
  const show_id = showObj.id;

  if (watchListArr) {
    watchListArr.forEach((watchList) => {
      if (watchList.id === show_id) {
        isInWatchList = true;
      }
    });
  }

  // Get first_air_date
  const dateStr = showObj.release_date;
  let formattedDate;
  if (dateStr) {
    const date = new Date(dateStr);
    const options = { month: "short", day: "numeric", year: "numeric" };
    formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  } else {
    formattedDate = "";
  }

  return [name, fullImgUrl, show_id, formattedDate, isInWatchList];
};

const cardsContainer = document.querySelector(".cards");
const clearCards = () => {
  while (cardsContainer.firstChild) {
    cardsContainer.removeChild(cardsContainer.firstChild);
  }
};
