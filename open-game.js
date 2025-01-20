function getGameFrameUrl() {
  const bodyText = document.querySelector("body").innerHTML;

  if (bodyText.indexOf("gameframe") != -1) {
    // game URLs can be games that are local to twoplayer games, or games that are external
    const gameFrameUrl = new RegExp(
      "https://files.twoplayergames.org/files/games/.*?/index.html|https:\\/\\/html5.gamedistribution.com\\/.*\\/"
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
    multiplayerButton.style.cssText = `
    -webkit-box-align: center;
    -moz-box-align: center;
    -webkit-box-pack: center;
    -moz-box-pack: center;
    -webkit-align-items: center;
    align-items: center;
    -webkit-animation: scale-easeOutElastic-reversed .6s;
    -moz-animation: scale-easeOutElastic-reversed .6s;
    animation: scale-easeOutElastic-reversed .6s;
    background-color: #8e44e6;
    border-radius: 25px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    color: #fff;
    cursor: pointer;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: flex;
    font-size: 1.5em;
    font-weight: 500;
    height: 50px;
    -webkit-justify-content: center;
    justify-content: center;
    letter-spacing: 1px;
    min-width: 130px;
    padding: 5px 15px;
    text-decoration: none;
    -webkit-transition: -webkit-transform .15s ease;
    transition: -webkit-transform .15s ease;
    -moz-transition: transform .15s ease,-moz-transform .15s ease;
    transition: transform .15s ease;
    transition: transform .15s ease,-webkit-transform .15s ease,-moz-transform .15s ease;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    `;
    multiplayerButton.style.margin = "auto";

    // change the child elements
    const buttonTitle = multiplayerButton.querySelector(".title");
    if (buttonTitle) {
      buttonTitle.innerText = "🌎 Multi-play";
    }

    const buttonIcon = multiplayerButton.querySelector(".icon");
    if (buttonIcon) {
      multiplayerButton.removeChild(buttonIcon);
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

  console.log(gameFrameUrl);

  addPlayButton(gameFrameUrl);
}

main();
