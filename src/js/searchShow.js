// import { fetchData, fetchConfig } from ".";
// import createCard from "./createCard";

// const searchBar = document.querySelector(".searchbar");
// const searchInput = document.getElementById("search");

// const fetchSearchResult = async (searchValue) => {
//   try {
//     const response = await fetchData("GET", "/search/movie", {
//       query: searchValue,
//       include_adult: "false",
//       language: "en-US",
//       page: "1",
//     });
//     return response;
//   } catch (error) {
//     console.log(error);
//   }
// };

// searchBar.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   await fetchConfig();

//   const searchValue = searchInput.value;
//   const response = await fetchSearchResult(searchValue);
//   const shows = response.results;
//   //   console.log(shows);
//   console.log(imgUrl, imgSize);

//   shows.forEach((result) => {
//     let isInWatchList = false;
//     // Get image path and assemble the full image url
//     const imgPath = result.poster_path;
//     const fullImgUrl = `${imgUrl}${imgSize}${imgPath}`;
//     // console.log(fullImgUrl);

//     // Gte name of the show
//     const name = result.title;

//     // Get id (need it later when fetch individual show???)
//     const show_id = result.id;

//     // Compare show_id with id of the shows in the watchlist
//     // if (addedShowArr) {
//     //   addedShowArr.forEach((addedShow) => {
//     //     if (addedShow.id === show_id) {
//     //       isInWatchList = true;
//     //     }
//     //   });
//     // }

//     // Get first_air_date
//     const dateStr = result.release_date;
//     let formattedDate;
//     if (dateStr) {
//       const date = new Date(dateStr);
//       const options = { month: "short", day: "numeric", year: "numeric" };
//       formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
//     } else {
//       formattedDate = "";
//     }

//     createCard(name, fullImgUrl, show_id, formattedDate);
//   });
// });
