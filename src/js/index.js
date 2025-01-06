import { createCard, clearCards } from "./createCard";
import { getWatchList } from "./watchList";
import fetchData from "./setupAxios";
import submitSearchTerm from "./searchShow";

const apiKey = import.meta.env.VITE_API_KEY;

let imgUrl = "";
let imgSize = "";
export let accountId;

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

export const generateSearchedShowData = (showObj, watchListArr) => {
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

// Search Function
const searchBar = document.querySelector(".searchbar");
submitSearchTerm(searchBar, accountId);
