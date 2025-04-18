const initPage = async () => {
  localStorage.removeItem("chapters");
  localStorage.removeItem("fragments");
};

window.initPage = initPage;
