// Add a message listener
// document.addEventListener("mousedown", startDrawing);
// document.addEventListener("mouseup", stopDrawing);

let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;
let show = false;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(
    "Content Script Message Listener",
    message,
    message.type == "remove_iframe"
  );
  if (message.type === "take_screenshot") {
    const iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("screenshotcomponent.html");
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
  }

  if (message.type === "record_video") {
    const iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("videocomponent.html");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "100vw";
    iframe.style.height = "100vh";
    iframe.style.border = "none";
    iframe.style.border = "1px dashed #fa7d7d";
    iframe.style.zIndex = "9999999";
    iframe.style.backgroundColor = "transparent";
    iframe.id = "flagbox-iframe";

    document.body.appendChild(iframe);
  } else if (message.type === "remove_iframe") {
    const root = document.getRootNode();
    const iframe = document.getElementById("flagbox-iframe");
    console.log("root", root);
    console.log("remove_iframe", iframe);
    if (iframe) {
      iframe.remove();
    }
  }

  return true;
});

// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   console.log("Content Script Message Listener Alt", message);
//   if (message.type === "remove_iframe") {
//     const iframe = document.getElementById("flagbox-iframe");
//     console.log("remove_iframe", iframe);
//     if (iframe) {
//       iframe.remove();
//     }
//   }
// });

window.addEventListener("message", function (event) {
  if (event.data.type === "REMOVE_IFRAME") {
    console.log("REMOVE_IFRAME WINDOW EVENT", event);
  }
});
