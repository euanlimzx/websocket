import { io } from "https://cdn.jsdelivr.net/npm/socket.io-client@4.7.1/+esm";
const TEN_SECONDS_MS = 10 * 1000;
let webSocket = null;
let tabId = null;
let ROOM_CODE = null;

const MODE = "DEV";

async function sendMessageToContentScript(payload) {
  if (!tabId) {
    console.log("ERROR: no tabId"); //todo @Euan handle accordingly
    return;
  }
  console.log("payload", payload);
  await chrome.tabs.sendMessage(tabId, payload);
}

function connect() {
  console.log(
    MODE === "DEV"
      ? "ws://localhost:3000"
      : "wss://socketio-server-do5e.onrender.com/"
  );

  webSocket = io(
    MODE === "DEV"
      ? "ws://localhost:3000"
      : "wss://socketio-server-do5e.onrender.com/",
    {
      transports: ["websocket"],
    }
  );

  webSocket.on("connect", () => {
    chrome.action.setIcon({ path: "icons/socket-active.png" });
    webSocket.emit("join-room", ROOM_CODE);
  });

  webSocket.on("connect_error", (error) => {
    console.error("Connection error:", error);
    //todo @Euan handle error
  });

  webSocket.on("keep-alive", (message) => {
    console.log("pong");
    console.log("keep-alive!", message);
  });

  webSocket.on("keystroke", (keyEvent) => {
    console.log("keystroke received!", keyEvent);
    sendMessageToContentScript(keyEvent);
  });
}

function disconnect() {
  chrome.action.setIcon({ path: "icons/socket-inactive.png" }); // todo @euan remove
  webSocket.disconnect();
  webSocket = null;
  tabId = null;
  ROOM_CODE = null;
}

function keepAlive() {
  const keepAliveIntervalId = setInterval(
    () => {
      if (webSocket) {
        console.log("ping");
        webSocket.emit("keep-alive", "ping", ROOM_CODE);
      } else {
        clearInterval(keepAliveIntervalId);
      }
    },
    // It's important to pick an interval that's shorter than 30s, to
    // avoid that the service worker becomes inactive.
    TEN_SECONDS_MS
  );
}

// Toggle WebSocket connection on action button click
// Send a message every 10 seconds, the ServiceWorker will
// be kept alive as long as messages are being sent.
chrome.action.onClicked.addListener(async () => {
  if (webSocket) {
    disconnect();
  }
});

chrome.tabs.onRemoved.addListener((currTabId) => {
  if (currTabId == tabId) {
    disconnect();
  }
});

//todo @Euan temporarily removed this for now because its not purely triggering during refreshes, also triggers during other stuff
// chrome.tabs.onUpdated.addListener((currTabId, changeInfo) => {
//   if (currTabId == tabId) {
//     disconnect();
//   }
// });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "disconnect") {
    console.log("user triggered disconnect");
    disconnect();
    return;
  }
  //todo @Euan very hacky fix ^^
  if (tabId || ROOM_CODE) {
    sendResponse({
      message: "ERROR: Active session in another tab already exists",
    });
    return;
  }
  // need to do something if there is currently no input / room code is invalid
  if (sender.tab) {
    tabId = sender.tab.id;
    console.log(tabId);
    ROOM_CODE = request.message;
    connect();
    keepAlive();
    sendResponse({ message: `SUCCESS: Room ${request.message} Joined` });
  } else {
    sendResponse({ message: "ERROR: no tab id detected" });
  }
});

chrome.tabs.onRemoved.addListener((closedTabId) => {
  if (closedTabId == tabId) {
    disconnect();
  }
});
