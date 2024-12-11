import { io } from "https://cdn.jsdelivr.net/npm/socket.io-client@4.7.1/+esm";
const TEN_SECONDS_MS = 10 * 1000;
const ROOM_CODE = "TEST";
let webSocket = null;

// Toggle WebSocket connection on action button click
// Send a message every 10 seconds, the ServiceWorker will
// be kept alive as long as messages are being sent.
chrome.action.onClicked.addListener(async () => {
  if (webSocket) {
    chrome.action.setIcon({ path: "icons/socket-inactive.png" }); // todo @euan remove
    webSocket.disconnect();
    webSocket = null;
  } else {
    connect();
    keepAlive();
  }
});

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
  sendMessageToContentScript("init");
  webSocket = io("ws://localhost:3000", {
    transports: ["websocket"],
  });

  webSocket.on("connect", () => {
    chrome.action.setIcon({ path: "icons/socket-active.png" });
    webSocket.emit("join-room", ROOM_CODE);
  });

  webSocket.on("connect_error", (error) => {
    console.error("Connection error:", error);
  });

  webSocket.on("keep-alive", (message) => {
    console.log("pong");
    console.log("keep-alive!", message);
  });

  webSocket.on("keystroke", (keyCode) => {
    console.log("keystroke received!", keyCode);
    sendMessageToContentScript(keyCode);
  });

  // webSocket.onclose = () => {
  //   chrome.action.setIcon({ path: "icons/socket-inactive.png" });
  //   console.log("websocket connection closed");
  //   webSocket = null;
  // };
}

// function disconnect() {
//   sendMessageToContentScript("destruct");
//   if (webSocket) {
//     webSocket.close();
//   }
// }

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
