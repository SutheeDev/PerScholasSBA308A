import { addToWatchList, authenticateUser } from ".";

const cardsContainer = document.querySelector(".cards");

const createCard = (name, imgUrl, show_id, date, account_id) => {
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
  heartIcon.classList.add("fa-regular", "fa-heart");
  title.classList.add("title");
  airDate.classList.add("airDate");

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

  // const wishlist = document.querySelector(".wishlist");
  wishlist.addEventListener("click", async () => {
    // Need some functionality to check if the user already approve the token here
    // If already approved, no need to authenticate again
    if (account_id) {
      // console.log(account_id);
      await addToWatchList(account_id, show_id);
    } else {
      await authenticateUser();
    }
  });
};

export default createCard;
