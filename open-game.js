function getGameFrameUrl() {
  const bodyText = document.querySelector("body").innerHTML;

  if (bodyText.indexOf("gameframe") != -1) {
    const gameFrameUrl = new RegExp(
      "https://files.twoplayergames.org/files/games/.*?/index.html"
    );

    return bodyText.match(gameFrameUrl);
  }

  return null;
}

function addPlayButton(gameFrameUrl) {
  const playButtonContainer = document.querySelector(".game-play");

  if (playButtonContainer) {
    // add styles
    playButtonContainer.style.display = "flex";
    playButtonContainer.style.flexDirection = "column";
    playButtonContainer.style.gap = "1rem";

    console.log(playButtonContainer.style);

    const multiplayerButton = playButtonContainer
      .querySelector("#button-play")
      .cloneNode(true);
    multiplayerButton.id = "multiplayer-button";
    multiplayerButton.classList.remove("play-button-disabled");
    multiplayerButton.style.backgroundColor = "#8e44e6";
    multiplayerButton.style.margin = "auto";

    // change the child elements
    const buttonTitle = multiplayerButton.querySelector(".title");
    if (buttonTitle) {
      buttonTitle.innerText = "🌎 Multi-play";
    }

    const buttonIcon = multiplayerButton.querySelector(".icon");
    if (buttonIcon) {
      multiplayerButton.removeChild(buttonIcon);
      // TODO @Shawn: add an icon
      // buttonIcon.style.backgroundImage = "url(./icons/multiplayer.svg)";
    }

    playButtonContainer.appendChild(multiplayerButton);

    multiplayerButton.addEventListener("click", () => {
      window.open(gameFrameUrl, "_blank");
    });
  }
}

function main() {
  const gameFrameUrl = getGameFrameUrl();

  if (!gameFrameUrl) {
    return;
  }

  addPlayButton(gameFrameUrl);
}

main();
