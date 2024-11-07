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

  if (message.type == "take_screenshot_ext") {
    if (message.subtype === "fullscreen") {
      chrome.runtime.sendMessage(
        {
          type: "take_screenshot",
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          subtype: "fullscreen",
        },
        async function (response) {
          console.log("fullscreen images called", response);
          if (response && response.response) {
            const iframe = document.createElement("iframe");
            iframe.style.position = "fixed";
            iframe.style.right = "0";
            iframe.style.bottom = "0";
            iframe.style.width = "100vw";
            iframe.style.height = "100vh";
            iframe.style.border = "none";
            iframe.style.overflow = "hidden";
            iframe.style.backgroundColor = "transparent";

            iframe.src = chrome.runtime.getURL("screenshotcomponent.html");
            iframe.id = "flagbox-iframe";
            document.body.appendChild(iframe);

            chrome.storage.local.set({
              section: "fullscreen",
              dataUrl: response.response,
            });
          }
        }
      );
    }

    if (message.subtype == "single_section") {
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

      document.body.appendChild(iframe);
      chrome.storage.local.set({ section: "single_section" });
    }
  }

  if (message.type == "record_video") {
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

    console.log("iframe", iframe);
    document.body.appendChild(iframe);

    chrome.storage.local.set({ section: "video_section" });
  }

  if (message.type === "remove_iframe") {
    const root = document.getRootNode();
    const iframe = document.getElementById("flagbox-iframe");
    console.log("root", root);
    console.log("remove_iframe", iframe);
    if (iframe) {
      iframe.remove();
    }
  }

  if (message.type == "messageToIframe") {
    const iframe = document.getElementById("flagbox-iframe");
    console.log("messageToIframe 1", message, iframe);
    if (iframe) {
      console.log("messageToIframe 2", message);
      (iframe as HTMLIFrameElement).contentWindow?.postMessage(
        {
          blob: message.blob,
          recordedChunks: message.recordedChunks,
          url: message.url,
          type: message.type,
        },
        "*"
      );
    }
  }

  return true;
});

const removeIframe = () => {
  const iframe = document.getElementById("flagbox-iframe");
  if (iframe) {
    iframe.remove();
  }
};
