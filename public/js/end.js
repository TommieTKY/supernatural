const initPage = async () => {
  localStorage.removeItem("chapters");
  localStorage.removeItem("fragments");
  localStorage.removeItem("chapters-correct");

  Object.keys(localStorage)
    .filter((x) => x.startsWith("chapter-"))
    .forEach((x) => localStorage.removeItem(x));
};

window.initPage = initPage;
