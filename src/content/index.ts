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
  removeIframe();

  if (message.type == "take_screenshot") {
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
          console.log("called");
          console.log("fullscreen images called", response);
          if (response && response.response) {
            chrome.runtime.sendMessage({
              type: "upload_document",
              dataUrl: response.response,
            });
          }
        }
      );

      return;
    }

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

    if (message.subtype === "single_section") {
      chrome.storage.local.set({ section: "single_section" });
    } else if (message.subtype === "multiple_section") {
      chrome.storage.local.set({ section: "multiple_section" });
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

  return true;
});

const removeIframe = () => {
  const iframe = document.getElementById("flagbox-iframe");
  if (iframe) {
    iframe.remove();
  }
};

window.addEventListener("message", (event) => {
  if (event.data.type === "start_recording") {
    startRecording();
  } else if (event.data.type === "stop_recording") {
    stopRecording();
  }
});

let mediaRecorder: any = null;
let recordedChunks: Blob[] = [];

const startRecording = async () => {
  console.log("Start recording");
  const stream = await captureScreen();
  if (stream) {
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
  }
};

const stopRecording = () => {
  console.log("Stop recording");
  if (mediaRecorder) {
    console.log("Stop recording 1");
    mediaRecorder.stop();
  }
};

function handleDataAvailable(event: BlobEvent): void {
  console.log("Data available", event);
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
    downloadRecording();
  }
}

function downloadRecording(): void {
  console.log("Download recording");
  const blob = new Blob(recordedChunks, {
    type: "video/webm",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "screen-recording.webm";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // Clean up
}

const captureScreen = async (): Promise<MediaStream | undefined> => {
  const displayMediaOptions: any = {
    video: {
      displaySurface: "browser",
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100,
    },
    preferCurrentTab: true,
    selfBrowserSurface: "exclude",
    systemAudio: "include",
    surfaceSwitching: "include",
    monitorTypeSurfaces: "include",
  };

  return new Promise((resolve, reject) => {
    console.log("Capturing screen");

    navigator.mediaDevices
      .getDisplayMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        console.log("Capturing stream", stream);
        if (stream) {
          resolve(stream);
        } else {
          reject(new Error("Could not capture stream"));
        }
      })
      .catch((error) => {
        console.error("Error capturing screen", error);
        reject(error);
      });
  });
};
