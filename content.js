const BOX_NAME = "arbitrary-box";
// Function to update the content of the box
function updateBoxContent(content) {
  // Clear any existing content in the box and set the new content
  const box = document.getElementById(BOX_NAME);
  box.innerHTML = "";
  box.innerHTML = content;
}
function createBox() {
  // Create the outer container for the box
  const box = document.createElement("div");
  box.id = BOX_NAME;
  box.style.width = "300px";
  box.style.height = "200px";

  box.style.backgroundColor = "white";
  box.style.border = "1px solid black";
  box.style.display = "flex";
  box.style.borderRadius = "1rem";
  box.style.flexDirection = "column";
  box.style.alignItems = "center";
  box.style.justifyContent = "center";
  box.style.padding = "20px";

  box.style.position = "fixed";
  box.style.top = "10px";
  box.style.right = "10px";
  box.style.zIndex = 9999;

  // Create the text input field
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Enter room code";
  input.style.width = "80%";
  input.style.padding = "8px";
  input.style.marginBottom = "10px";

  // Create the submit button
  const submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  submitButton.style.padding = "8px 16px";
  submitButton.style.cursor = "pointer";

  // Add the input and submit button to the box
  box.appendChild(input);
  box.appendChild(submitButton);

  // Append the box to the body
  document.body.appendChild(box);

  // Event listener for the submit button
  submitButton.addEventListener("click", function () {
    const room = input.value;
    joinRoom(room);
  });
}

function disconnect() {
  removeBox();
  createBox();
  sendMsgToBackground({ message: "disconnect" });
}

async function joinRoom(room) {
  const response = await sendMsgToBackground({ message: room });
  console.log(response);
  //todo @Euan: handle error if cannot join room, or service worker already handle existing session
  const content = `
    <h2 style='color: black; font-family: Helvetica, sans-serif;'>Joined Room ${room}!</h2>
    <button id="disconnectBtn" style="margin-top: 10px; padding: 8px; font-family: Helvetica, sans-serif;">Disconnect</button>
  `;
  updateBoxContent(content);
  // Add an event listener to the Disconnect button
  //todo @Euan: this is a very hacky fix, eventually we want to fix the UI of this entire thing
  document
    .getElementById("disconnectBtn")
    .addEventListener("click", disconnect);
}

function removeBox() {
  const box = document.getElementById(BOX_NAME);
  if (box) {
    box.remove(); // Remove the box from the DOM
  } else {
    console.error("Box element not found");
  }
}

async function sendMsgToBackground(obj) {
  const response = await chrome.runtime.sendMessage(obj);
  return response;
}

function simulateKeyPress(keyPressDir, keyCode) {
  const canvasElement = document.querySelector("body");
  if (!canvasElement) {
    console.error("Canvas element not found!");
    return;
  }
  const keyDownEvent = new KeyboardEvent(keyPressDir, {
    keyCode: keyCode, // You might want to adjust this for each key
    bubbles: true, // Allow the event to propagate through the DOM
    //NOTE: Although keycode is deprecated, I removed some fields as they don't seem to be doing anything. Let's add them back only if we see value
  });
  canvasElement.dispatchEvent(keyDownEvent);
}

if (
  window.location.href.match("https://files.twoplayergames.org/files/games/*")
) {
  createBox();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { keyCode, keyDir } = message;
  console.log(keyCode, keyDir);
  simulateKeyPress(keyDir, keyCode);
});
