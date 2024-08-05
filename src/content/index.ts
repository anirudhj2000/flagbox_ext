// Add a message listener
// document.addEventListener("mousedown", startDrawing);
// document.addEventListener("mouseup", stopDrawing);

let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;
let show = false;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Content Script Message Listener", message);
  if (message.type === "take_screenshot") {
    const iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("buttoncomponent.html");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "100vw";
    iframe.style.height = "100vh";
    iframe.style.border = "none";
    iframe.style.border = "1px dashed #fa7d7d";
    iframe.style.zIndex = "9999999";
    iframe.style.backgroundColor = "transparent";
    iframe.style.cursor = "crosshair";
    iframe.style.overflow = "hidden";
    iframe.scrolling = "no";
    iframe.id = "flagbox-iframe";

    console.log("iframe", iframe);

    document.body.appendChild(iframe);

    if (message === "remove_iframe") {
      document.body.removeChild(iframe);
    }
  } else if (message.type === "remove_iframe") {
    document.getElementById("flagbox-iframe")?.remove();
  }
});
