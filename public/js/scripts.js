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
  document.body.style.visibility = "hidden";
  initMenu();

  if (typeof window.initPage === "function") {
    await window.initPage();
  }

  document.body.style.visibility = "visible";
};

window.onload = pageReady;
