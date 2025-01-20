// CONSTS
const TOGGLE_BUTTON_ID = "toggle-btn";
const BOX_ID = "box-id";
// ----

// MAIN THREAD
if (
  window.location.href.match(
    "https://files.twoplayergames.org/files/games/*"
  ) ||
  window.location.href.match("https://html5.gamedistribution.com/.*/$")
) {
  header = "Enter room code from duogames.org!";
  createBox(header, "join-room");
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.status && message.status == "ERROR") {
    removeBox();
    header = `Error`;
    createBox(header, "error", message.message);
    return;
  }
  const { keyCode, keyDir } = message;
  simulateKeyPress(keyDir, keyCode);
});

async function sendMsgToBackground(obj) {
  const response = await chrome.runtime.sendMessage(obj);
  return response;
}

// ---------

// KEY PRESS

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
    key: key,
    code: key,
    keyCode: getKeyCode(key),
    bubbles: true, // Allow event bubbling
  });
  console.log(keyDownEvent);
  canvasElement.dispatchEvent(keyDownEvent);
}

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
    " ": 32,
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

// --------

// UI

// Function to update the content of the box
function createBox(headerText, buttonFn, errorMsg = "") {
  // Create a container for the entire page (to ensure no default styles interfere)
  document.body.style.margin = 0;
  document.body.style.padding = 0;
  document.body.style.fontFamily = "Arial, sans-serif";

  // Create the toggle button (it will appear above the white box)
  const toggleButton = document.createElement("button");
  toggleButton.style.position = "fixed";
  toggleButton.style.top = "10px";
  toggleButton.style.right = "10px";
  toggleButton.style.backgroundColor = "white"; // White background for the button
  toggleButton.style.color = "black"; // Black color for the icon
  toggleButton.style.border = "2px solid black"; // Black border for the button
  toggleButton.style.padding = "0"; // Remove padding to make it a perfect circle
  toggleButton.style.width = "40px"; // Fixed size for the circle
  toggleButton.style.height = "40px"; // Fixed size for the circle
  toggleButton.style.borderRadius = "50%"; // Make the button circular
  toggleButton.style.cursor = "pointer";
  toggleButton.style.zIndex = "1000"; // Ensure the button stays above the box
  toggleButton.style.fontSize = "24px"; // Font size for the arrow
  toggleButton.style.display = "flex"; // Use flexbox to center the arrow
  toggleButton.style.alignItems = "center"; // Vertically center the arrow
  toggleButton.style.justifyContent = "center"; // Horizontally center the arrow
  toggleButton.innerText = "▲"; // Initial icon (down arrow)

  // Append the button to the body of the document
  toggleButton.id = TOGGLE_BUTTON_ID;
  document.body.appendChild(toggleButton);

  // Create the white box (it will be open by default)
  const whiteBox = document.createElement("div");
  whiteBox.style.position = "fixed";
  whiteBox.style.top = "30px"; // Position the white box below the toggle button
  whiteBox.style.right = "20px";
  whiteBox.style.width = "300px";
  whiteBox.style.backgroundColor = "white";
  whiteBox.style.borderRadius = "10px";
  whiteBox.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
  whiteBox.style.padding = "15px";
  whiteBox.style.display = "flex"; // The white box is open by default
  whiteBox.style.flexDirection = "column";
  whiteBox.style.boxSizing = "border-box";

  // Set text color in the white box to black
  whiteBox.style.color = "black";

  // Create the header section inside the white box
  const header = document.createElement("div");
  header.id = "header";
  header.innerText = headerText;
  header.style.fontWeight = "bold";
  header.style.fontSize = "18px";
  header.style.marginBottom = "10px";

  if (buttonFn == "join-room") {
    // Create the body section inside the white box
    const body = document.createElement("div");
    body.id = "body";
    body.style.marginBottom = "10px";

    const inputElement = document.createElement("input");
    inputElement.type = "text"; // Set the input type
    inputElement.style.width = "90%"; // Full width to match the card width
    inputElement.style.padding = "10px"; // Padding for the input field
    inputElement.style.borderRadius = "5px"; // Rounded borders
    inputElement.style.border = "1px solid #ccc"; // Light gray border
    inputElement.style.fontSize = "14px"; // Font size for the input text

    // Append the input element to the body div
    body.appendChild(inputElement);

    // Create the action section inside the white box
    const action = document.createElement("div");
    action.id = "action";
    const actionButton = document.createElement("button");
    actionButton.style.backgroundColor = "black"; // Black background
    actionButton.style.color = "white"; // White text
    actionButton.style.border = "none"; // No border
    actionButton.style.fontWeight = "bold";
    actionButton.style.padding = "10px"; // Padding for the button
    actionButton.style.borderRadius = "5rem"; // Rounded borders
    actionButton.style.width = "100%"; // Make the button take the full width of the card
    actionButton.style.cursor = "pointer"; // Make the button clickable
    actionButton.style.fontSize = "14px"; // Font size for the button
    actionButton.innerText = "Join Room"; // Button text
    actionButton.addEventListener("click", function () {
      const room = inputElement.value;
      joinRoom(room);
    });
    // Append the button to the action div
    action.appendChild(actionButton);

    // Append the header, body, and action sections to the white box
    whiteBox.appendChild(header);
    whiteBox.appendChild(body);
    whiteBox.appendChild(action);
  } else if (buttonFn == "leave-room") {
    // Create the body section inside the white box
    const body = document.createElement("div");
    body.id = "body";
    body.innerText = "Previous sessions, if any, will be disconnected.";
    body.style.fontSize = "14px";
    body.style.marginBottom = "10px";

    // Create the action section inside the white box
    const action = document.createElement("div");
    action.id = "action";
    const actionButton = document.createElement("button");
    actionButton.style.backgroundColor = "black"; // Black background
    actionButton.style.color = "white"; // White text
    actionButton.style.border = "none"; // No border
    actionButton.style.fontWeight = "bold";
    actionButton.style.padding = "10px"; // Padding for the button
    actionButton.style.borderRadius = "5rem"; // Rounded borders
    actionButton.style.width = "100%"; // Make the button take the full width of the card
    actionButton.style.cursor = "pointer"; // Make the button clickable
    actionButton.style.fontSize = "14px"; // Font size for the button
    actionButton.innerText = "Disconnect"; // Button text
    actionButton.addEventListener("click", function () {
      disconnect();
    });
    // Append the button to the action div
    action.appendChild(actionButton);

    // Append the header, body, and action sections to the white box
    whiteBox.appendChild(header);
    whiteBox.appendChild(body);
    whiteBox.appendChild(action);
  } else {
    const body = document.createElement("div");
    body.id = "body";
    body.innerText = `${errorMsg} \n\n Contact duogames@gmail.com for further assistance!`;
    body.style.fontSize = "14px";
    body.style.marginBottom = "10px";
    whiteBox.appendChild(header);
    whiteBox.appendChild(body);
  }
  // Append the white box to the body of the document
  whiteBox.id = BOX_ID;
  document.body.appendChild(whiteBox);

  // Function to toggle the visibility of the white box and the icon
  toggleButton.addEventListener("click", () => {
    if (whiteBox.style.display === "none") {
      whiteBox.style.display = "flex"; // Show the box
      toggleButton.innerText = "▲"; // Down arrow when box is open
    } else {
      whiteBox.style.display = "none"; // Hide the box
      toggleButton.innerText = "▼"; // Up arrow when box is closed
    }
  });
}
function updateBoxContent(content) {
  // Clear any existing content in the box and set the new content
  const box = document.getElementById(BOX_NAME);
  box.innerHTML = "";
  box.innerHTML = content;
}

function removeBox() {
  const box = document.getElementById(BOX_ID);
  if (box) {
    box.remove(); // Remove the box from the DOM
  } else {
    console.error("Box element not found");
  }
}

// -----

// UI FUNCTIONS

function disconnect() {
  removeBox();
  header = "Enter room code from duogames.org!";
  createBox(header, "join-room");
  sendMsgToBackground({ message: "disconnect" });
}

async function joinRoom(room) {
  if (room.trim().length == 0) {
    return;
  }
  const response = await sendMsgToBackground({ message: room });
  removeBox();
  if (response.status && response.status == "ERROR") {
    header = `Error`;
    createBox(header, "error", response.message);
  } else {
    header = `Joined room ${room}!`;
    createBox(header, "leave-room");
  }
}

// -----
