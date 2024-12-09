function simulateKeyPress(key) {
  const canvasElement = document.querySelector("body");

  if (!canvasElement) {
    console.error("Canvas element not found!");
    return;
  }

  // Create a new keyboard event for the key down
  const keyDownEvent = new KeyboardEvent("keydown", {
    // key: key, // The key to simulate (passed as argument)
    // code: key, // The code for the key (same as the key name for simplicity)
    keyCode: 38, // You might want to adjust this for each key
    bubbles: true, // Allow the event to propagate through the DOM
    // cancelable: true, // Allow the event to be canceled
    // which: 38, // Same as keyCode for compatibility
    //NOTE: I commented out some fields as they don't seem to be doing anything. Let's add them back only if we see value
  });
  canvasElement.dispatchEvent(keyDownEvent);

  //TODO @EUAN in an ideal scenario we would have a different ping for key up AND key down (i.e. for different motions)
  const keyUpEvent = new KeyboardEvent("keyup", {
    keyCode: 38, // Same keyCode as keyDown
    bubbles: true, // Allow the event to propagate
  });
  setTimeout(() => {
    canvasElement.dispatchEvent(keyUpEvent);
  }, 100); // Adjust delay to match desired timing
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received", message);
  simulateKeyPress("ArrowUp");
});
