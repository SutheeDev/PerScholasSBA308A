import fetchData from "./setupAxios";

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
