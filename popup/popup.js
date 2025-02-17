const twoPlayerGamesLink = document.getElementById(
  "two-player-games-website-link"
);
twoPlayerGamesLink.addEventListener("click", () => {
  chrome.tabs.update({
    url: "https://www.twoplayergames.org/",
  });
});
