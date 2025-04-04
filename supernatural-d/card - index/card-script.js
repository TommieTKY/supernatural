const header = document.getElementById("header");

function getNavigation() {
  const navContainer = document.createElement("div");
  navContainer.classList.add("nav-container");

  // Left: Title
  const title = document.createElement("h1");
  title.id = "case-title";
  title.textContent = "CASE FILES";

  // Right: Links
  const navLinks = document.createElement("div");
  navLinks.id = "nav-links";

  const homeLink = document.createElement("a");
  homeLink.href = "index.html";
  homeLink.textContent = "HOME";

  const aboutLink = document.createElement("a");
  aboutLink.href = "#";
  aboutLink.textContent = "ABOUT";

  navLinks.appendChild(homeLink);
  navLinks.appendChild(aboutLink);

  navContainer.appendChild(title);
  navContainer.appendChild(navLinks);
  header.appendChild(navContainer);
}

getNavigation();
