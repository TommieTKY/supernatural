const assetsPath = "./public/assets/";
const imagesPath = assetsPath + "images/";
const audiosPath = assetsPath + "audios/";

const initMenu = () => {
  const menuButtonElem = document.getElementById("menu-button");
  const menuDropdownElem = document.getElementById("menu-dropdown");

  const toggleMenuHandler = () => {
    menuDropdownElem.style.visibility =
      menuDropdownElem.style.visibility === "visible" ? "hidden" : "visible";
  };

  menuButtonElem.addEventListener("click", toggleMenuHandler);
};

const pageReady = async () => {
  initMenu();
  const data = await fetch("data.json").then((res) => res.json());
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  const type =
    params.type === "chapter" || params.type === "fragment"
      ? params.type
      : "chapter";

  const description = params.description ?? data[`${type}s`][0].description;

  const card = data[`${type}s`].find(
    (card) => card.description === description
  );

  const cardImageElem = document.getElementById("card-image");
  cardImageElem.src = imagesPath + card.image;
  cardImageElem.alt = card.description;

  const cardAudioElem = document.getElementById("card-audio");
  cardAudioElem.src = audiosPath + card.audio;

  const audioControlsElem = document.getElementById("audio-controls");
};

window.onload = pageReady;
