const cardsContainer = document.querySelector(".feature-cards");

const createCard = (name, imgUrl, id) => {
  // Create elements
  const card = document.createElement("div");
  const cardFrame = document.createElement("div");
  const cardImg = document.createElement("img");
  const wishlist = document.createElement("div");

  // Add classes
  card.classList.add("card");
  cardFrame.classList.add("cardFrame");
  cardImg.classList.add("cardImg");
  wishlist.classList.add("wishlist");

  // Add attribute
  cardImg.setAttribute("url", imgUrl);

  // Assemble
  card.appendChild(cardImg);
  card.appendChild(cardFrame);

  cardsContainer.appendChild(card);

  console.log("create card here");
};

export default createCard;
