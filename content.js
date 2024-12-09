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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received", message);
  simulateKeyPress("keydown", 38);
  setTimeout(() => {
    simulateKeyPress("keyup", 38);
  }, 100);
  //TODO @Euan in an ideal world this would be two separate message calls
});
