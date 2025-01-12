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

function simulateKeyPress(keyPressDir, key) {
  const canvasElement = document.querySelector("body");
  if (!canvasElement) {
    console.error("Canvas element not found!");
    return;
  }
  // const keyDownEvent = new KeyboardEvent(keyPressDir, {
  //   key: keyCode, // You might want to adjust this for each key
  //   code: keyCode,
  //   bubbles: true, // Allow the event to propagate through the DOM
  //   //NOTE: Although keycode is deprecated, I removed some fields as they don't seem to be doing anything. Let's add them back only if we see value
  // });
  console.log(getKeyCode(key));
  const keyDownEvent = new KeyboardEvent(keyPressDir, {
    keyCode: getKeyCode(key),
    bubbles: true, // Allow event bubbling
  });
  console.log(keyDownEvent);
  canvasElement.dispatchEvent(keyDownEvent);
}

if (
  window.location.href.match(
    "https://files.twoplayergames.org/files/games/*"
  ) ||
  window.location.href.match("https://html5.gamedistribution.com/.*/$")
) {
  createBox();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { keyCode, keyDir } = message;
  simulateKeyPress(keyDir, keyCode);
});

function getKeyCode(keyName) {
  const keyCharToCode = {
    Backspace: 8,
    Tab: 9,
    Enter: 13,
    Shift: 16,
    Ctrl: 17,
    Alt: 18,
    "Pause/Break": 19,
    "Caps Lock": 20,
    Esc: 27,
    Space: 32,
    "Page Up": 33,
    "Page Down": 34,
    End: 35,
    Home: 36,
    ArrowLeft: 37,
    ArrowUp: 38,
    ArrowRight: 39,
    ArrowDown: 40,
    Insert: 45,
    Delete: 46,
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    a: 65,
    b: 66,
    c: 67,
    d: 68,
    e: 69,
    f: 70,
    g: 71,
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    m: 77,
    n: 78,
    o: 79,
    p: 80,
    q: 81,
    r: 82,
    s: 83,
    t: 84,
    u: 85,
    v: 86,
    w: 87,
    x: 88,
    y: 89,
    z: 90,
    Windows: 91,
    "Right Click": 93,
    "Numpad 0": 96,
    "Numpad 1": 97,
    "Numpad 2": 98,
    "Numpad 3": 99,
    "Numpad 4": 100,
    "Numpad 5": 101,
    "Numpad 6": 102,
    "Numpad 7": 103,
    "Numpad 8": 104,
    "Numpad 9": 105,
    "Numpad *": 106,
    "Numpad +": 107,
    "Numpad -": 109,
    "Numpad .": 110,
    "Numpad /": 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    "Num Lock": 144,
    "Scroll Lock": 145,
    "My Computer": 182,
    "My Calculator": 183,
    ";": 186,
    "=": 187,
    ",": 188,
    "-": 189,
    ".": 190,
    "/": 191,
    "`": 192,
    "[": 219,
    "\\": 220,
    "]": 221,
    "'": 222,
  };

  return keyCharToCode[keyName];
}
