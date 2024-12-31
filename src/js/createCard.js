const cardsContainer = document.querySelector(".cards");

const createCard = (name, imgUrl, id) => {
  // Create elements
  const card = document.createElement("div");
  const cardFrame = document.createElement("div");
  const cardImgContainer = document.createElement("div");
  const cardImg = document.createElement("img");
  const wishlist = document.createElement("div");
  const title = document.createElement("h6");
  const releasedDate = document.createElement("p");

  // Add classes
  card.classList.add("card");
  cardFrame.classList.add("cardFrame");
  cardImg.classList.add("cardImg");
  cardImgContainer.classList.add("card-img-container");
  wishlist.classList.add("wishlist");

  // Add attribute
  cardImg.setAttribute("src", imgUrl);

  // Assemble
  cardImgContainer.appendChild(cardImg);
  card.appendChild(cardImgContainer);
  card.appendChild(cardFrame);

  cardsContainer.appendChild(card);

  console.log("create card here");
};

export default createCard;
