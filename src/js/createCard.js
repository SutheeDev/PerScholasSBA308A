import { toggleWatchList, authenticateUser } from ".";

const cardsContainer = document.querySelector(".cards");

const createCard = (name, imgUrl, show_id, date, account_id, isInWatchList) => {
  // Create elements
  const card = document.createElement("div");
  const cardFrame = document.createElement("div");
  const cardContent = document.createElement("div");
  const cardTextContent = document.createElement("div");
  const cardImgContainer = document.createElement("div");
  const cardImg = document.createElement("img");
  const wishlist = document.createElement("div");
  const heartIcon = document.createElement("i");
  const title = document.createElement("h6");
  const airDate = document.createElement("p");

  // Add classes
  card.classList.add("card");
  cardFrame.classList.add("cardFrame");
  cardContent.classList.add("card-content");
  cardTextContent.classList.add("card-text-content");
  cardImg.classList.add("cardImg");
  cardImgContainer.classList.add("card-img-container");
  wishlist.classList.add("wishlist");
  title.classList.add("title");
  airDate.classList.add("airDate");

  // If the show is in the watchlist, use solid heart icon
  if (isInWatchList) {
    heartIcon.classList.add("fa-solid", "fa-heart");
  } else {
    heartIcon.classList.add("fa-regular", "fa-heart");
  }

  // Add attribute
  cardImg.setAttribute("src", imgUrl);

  //   Add content
  title.innerText = name;
  airDate.innerText = date;

  // Assemble
  wishlist.appendChild(heartIcon);
  cardTextContent.appendChild(title);
  cardTextContent.appendChild(airDate);
  cardImgContainer.appendChild(cardImg);
  cardImgContainer.appendChild(wishlist);
  cardContent.appendChild(cardImgContainer);
  cardContent.appendChild(cardTextContent);
  card.appendChild(cardContent);
  card.appendChild(cardFrame);

  cardsContainer.appendChild(card);

  wishlist.addEventListener("click", async () => {
    // If there is no account_id, navigate the user to authenticate page
    if (account_id) {
      await toggleWatchList(account_id, show_id);
      if (heartIcon.classList.contains("fa-regular")) {
        heartIcon.classList.remove("fa-regular");
        heartIcon.classList.add("fa-solid");
      } else {
        heartIcon.classList.remove("fa-solid");
        heartIcon.classList.add("fa-regular");
      }
    } else {
      await authenticateUser();
    }
  });
};

export default createCard;
