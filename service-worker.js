import { io } from "https://cdn.jsdelivr.net/npm/socket.io-client@4.7.1/+esm";
const TEN_SECONDS_MS = 10 * 1000;
let webSocket = null;
let tabId = null;
let ROOM_CODE = null;

const DEV = false;
const LOCAL = false;

async function sendMessageToContentScript(payload) {
  if (!tabId) {
    DEV && console.log("ERROR: no tabId"); //todo @Euan handle accordingly
    return;
  }
  DEV && console.log("payload", payload);
  await chrome.tabs.sendMessage(tabId, payload);
}

function connect() {
  webSocket = io(
    LOCAL ? "ws://localhost:3000" : "wss://socketio-server-do5e.onrender.com/",
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
    sendMessageToContentScript({
      status: "ERROR",
      message: "Unable to connect to server",
    });
    disconnect();
    return;
  });

  webSocket.on("keep-alive", (message) => {
    DEV && console.log("pong");
    DEV && console.log("keep-alive!", message);
  });

  webSocket.on("keystroke", (keyEvent) => {
    DEV && console.log("keystroke received!", keyEvent);
    sendMessageToContentScript(keyEvent);
  });

  webSocket.on("room-status", (payload) => {
    DEV && console.log(payload);
    if (payload.userDisconnected) {
      sendMessageToContentScript({
        status: "ERROR",
        message:
          "Other party has disconnected. Please refresh & join a new room!",
      });
      disconnect();
    }
  });
}

function disconnect() {
  chrome.action.setIcon({ path: "icons/socket-inactive.png" }); // todo @euan remove
  DEV && console.log(webSocket);
  if (webSocket) {
    webSocket.disconnect();
  }
  webSocket = null;
  tabId = null;
  ROOM_CODE = null;
}

function keepAlive() {
  const keepAliveIntervalId = setInterval(
    () => {
      if (webSocket) {
        DEV && console.log("ping");
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
chrome.tabs.onUpdated.addListener((currTabId, changeInfo) => {
  if (currTabId == tabId && changeInfo.status == "complete") {
    disconnect();
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "disconnect") {
    DEV && console.log("user triggered disconnect");
    disconnect();
    return;
  }

  if (tabId || ROOM_CODE) {
    DEV && console.log("Overriding existing sessions");
    disconnect();
  }

  if (sender.tab) {
    tabId = sender.tab.id;
    ROOM_CODE = request.message;
    connect();
    keepAlive();
    sendResponse({
      status: "SUCCESS",
      message: `SUCCESS: Room ${request.message} Joined`,
    });
  } else {
    sendResponse({
      status: "ERROR",
      message: "Please close & re-open this tab and try again!",
    });
  }
});

chrome.tabs.onRemoved.addListener((closedTabId) => {
  if (closedTabId == tabId) {
    disconnect();
  }
});
