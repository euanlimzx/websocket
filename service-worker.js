import { io } from "https://cdn.jsdelivr.net/npm/socket.io-client@4.7.1/+esm";
const TEN_SECONDS_MS = 10 * 1000;
let webSocket = null;
let tabId = null;
let ROOM_CODE = null;

function sendMessageToContentScript(message) {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, async (tabs) => {
    if (tabs[0]) {
      await chrome.tabs.sendMessage(tabs[0].id, {
        message: message,
      });
    }
  });
}

function connect() {
  webSocket = io("ws://localhost:3000", {
    transports: ["websocket"],
  });

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

  webSocket.on("keystroke", (keyCode) => {
    console.log("keystroke received!", keyCode);
    sendMessageToContentScript(keyCode);
  });
}

function keepAlive() {
  const keepAliveIntervalId = setInterval(
    () => {
      if (webSocket) {
        console.log("ping");
        sendMessageToContentScript("help");
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
    chrome.action.setIcon({ path: "icons/socket-inactive.png" }); // todo @euan remove
    webSocket.disconnect();
    webSocket = null;
    tabId = null;
    ROOM_CODE = null;
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (tabId || ROOM_CODE) {
    sendResponse({
      message: "ERROR: Active session in another tab already exists",
    });
    return;
  }
  if (sender.tab) {
    tabId = sender.tab.id;
    ROOM_CODE = request.message;
    connect();
    keepAlive();
    sendResponse({ message: `SUCCESS: Room ${request.message} Joined` });
  } else {
    sendResponse({ message: "ERROR: no tab id detected" });
  }
});
