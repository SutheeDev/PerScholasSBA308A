import fetchData from "./setupAxios";
import { getWatchList } from "./watchList";
import { createCard, clearCards } from "./createCard";
import { fetchConfig, generateSearchedShowData } from ".";

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

export default submitSearchTerm;
