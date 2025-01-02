const cardsContainer = document.querySelector(".cards");

const createCard = (name, imgUrl, id, date) => {
  // Create elements
  const card = document.createElement("div");
  const cardFrame = document.createElement("div");
  const cardContent = document.createElement("div");
  const cardTextContent = document.createElement("div");
  const cardImgContainer = document.createElement("div");
  const cardImg = document.createElement("img");
  const wishlist = document.createElement("div");
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

  // Add attribute
  cardImg.setAttribute("src", imgUrl);

  //   Add content
  title.innerText = name;
  airDate.innerText = date;

  // Assemble
  cardTextContent.appendChild(title);
  cardTextContent.appendChild(airDate);
  cardImgContainer.appendChild(cardImg);
  cardImgContainer.appendChild(wishlist);
  cardContent.appendChild(cardImgContainer);
  cardContent.appendChild(cardTextContent);
  card.appendChild(cardContent);
  card.appendChild(cardFrame);

  cardsContainer.appendChild(card);
};

export default createCard;
