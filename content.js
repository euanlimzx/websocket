const BOX_NAME = "arbitrary-box";
const createBox = () => {
  const box = document.createElement("div");

  // Apply styles to position the box in the top-right corner
  box.id = BOX_NAME;
  box.style.position = "fixed";
  box.style.top = "10px";
  box.style.right = "10px";
  box.style.padding = "10px";
  box.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  box.style.color = "white";
  box.style.fontSize = "16px";
  box.style.borderRadius = "8px";
  box.style.zIndex = "1000"; // Ensure the box stays above other elements
  box.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.3)";
  box.style.maxWidth = "250px";
  box.style.wordWrap = "break-word";
  box.style.whiteSpace = "normal";

  // Set initial text
  box.textContent = "Hello, I'm your box!";
  document.body.appendChild(box);
};

function changeBoxText(newText) {
  const box = document.querySelector(`#${BOX_NAME}`);
  box.textContent = newText;
}

function removeBox() {
  const box = document.getElementById(BOX_NAME);
  if (box) {
    box.remove(); // Remove the box from the DOM
  } else {
    console.error('Box with id "topRightBox" not found');
  }
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received", message);
  if (message == "init") {
    console.log("fuck");
    createBox();
  } else if (message == "destruct") {
    removeBox();
  } else {
    const keyCode = message.message;
    console.log("running this");
    simulateKeyPress("keydown", keyCode);
    setTimeout(() => {
      simulateKeyPress("keyup", keyCode);
    }, 100);
  }
});
