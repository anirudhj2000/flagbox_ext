// content script (content.ts)

import { parse } from "postcss";

let mediaRecorder: any = null;
let recordedChunks: Blob[] = [];
// API URL
// const API_URL = "http://ec2-54-224-16-183.compute-1.amazonaws.com:7001/api";
const API_URL = "http://localhost:5001/api";
// const API_URL = "https://flagbox-be.onrender.com/api";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Taking screenshot message recieved", message, sender);
  if (
    message.type === "take_screenshot" &&
    message.x != undefined &&
    message.y != undefined &&
    message.width &&
    message.height
  ) {
    console.log("Taking screenshot1");
    if (sender.tab?.windowId) {
      console.log("Taking screenshot2");
      chrome.tabs.captureVisibleTab(
        sender.tab?.windowId,
        { format: "png" },
        async (dataUrl) => {
          console.log("dataUrl background", dataUrl);
          sendResponse({ response: dataUrl });
        }
      );
    }
  } else if (message.command == "start_recording") {
    console.log("startRecording");

    chrome.runtime.getContexts({}).then((existingContexts) => {
      let recording = false;

      const offscreenDocument = existingContexts.find(
        (c) => c.contextType === "OFFSCREEN_DOCUMENT"
      );

      console.log("offscreenDocument", offscreenDocument);

      if (!offscreenDocument) {
        chrome.offscreen
          .createDocument({
            url: "offscreen.html",
            reasons: ["USER_MEDIA" as chrome.offscreen.Reason],
            justification: "Screen recording in the background",
          })
          .then((document) => {
            chrome.tabCapture.getMediaStreamId(
              {
                targetTabId: sender.tab?.id,
              },
              (streamId) => {
                if (streamId) {
                  console.log("Stream ID:", streamId);
                  // Use the stream ID to start recording
                  chrome.runtime.sendMessage({
                    command: "startRecording",
                    tabId: sender.tab?.id,
                    streamId: streamId,
                  });
                }
              }
            );
          });
      }
    });
  } else if (message.command == "stop_recording") {
    console.log("stopRecording");
    chrome.runtime.sendMessage({ command: "stopRecording" });
  } else if (message.type == "upload_document" && message.dataUrl) {
    if (message.includeFullScreen) {
      createFlag(
        message.title,
        message.description,
        message.projectId,
        message.dataUrl,
        sender,
        message.fullScreenData
      );
    } else {
      createFlag(
        message.title,
        message.description,
        message.projectId,
        message.dataUrl,
        sender
      );
    }
  } else if (message.type == "loginpopup") {
    chrome.tabs.create({
      url: "https://www.flagbox.app/login",
    });
  } else if (message.type == "login" && message.email && message.password) {
    const { email, password } = message;
    sendResponse(login(email, password));
  } else if (message.type == "remove_iframe") {
    if (sender?.tab?.id)
      chrome.tabs.sendMessage(sender?.tab?.id, { type: "remove_iframe" });
  } else if (message.command == "saveRecording") {
    console.log("saveRecording", message);
    // chrome.runtime.sendMessage({
    //   ...message,
    //   type: "saveRecording",
    // });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "messageToIframe",
          blob: message.blob,
          recordedChunks: message.recordedChunks,
          url: message.url,
        });
      }
    });
  }

  return true;
});

function handleDataAvailable(event: BlobEvent): void {
  console.log("Data available", event);
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
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

function saveRecording(blobData: Blob | MediaSource) {
  let url = URL.createObjectURL(blobData);
  let a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = "recording1.webm";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}

function blobToFile(theBlob: any, fileName: string) {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

function dataURLtoFile(dataurl: string, filename: string) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)?.[1] || "",
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

function getSystemData() {
  "use strict";

  var module = {
    options: [],
    header: [
      navigator.platform,
      navigator.userAgent,
      navigator.appVersion,
      navigator.vendor,
    ],
    dataos: [
      { name: "Windows Phone", value: "Windows Phone", version: "OS" },
      { name: "Windows", value: "Win", version: "NT" },
      { name: "iPhone", value: "iPhone", version: "OS" },
      { name: "iPad", value: "iPad", version: "OS" },
      { name: "Kindle", value: "Silk", version: "Silk" },
      { name: "Android", value: "Android", version: "Android" },
      { name: "PlayBook", value: "PlayBook", version: "OS" },
      { name: "BlackBerry", value: "BlackBerry", version: "/" },
      { name: "Macintosh", value: "Mac", version: "OS X" },
      { name: "Linux", value: "Linux", version: "rv" },
      { name: "Palm", value: "Palm", version: "PalmOS" },
    ],
    databrowser: [
      { name: "Chrome", value: "Chrome", version: "Chrome" },
      { name: "Firefox", value: "Firefox", version: "Firefox" },
      { name: "Safari", value: "Safari", version: "Version" },
      { name: "Internet Explorer", value: "MSIE", version: "MSIE" },
      { name: "Opera", value: "Opera", version: "Opera" },
      { name: "BlackBerry", value: "CLDC", version: "CLDC" },
      { name: "Mozilla", value: "Mozilla", version: "Mozilla" },
    ],
    init: function () {
      var agent = this.header.join(" "),
        os = this.matchItem(agent, this.dataos),
        browser = this.matchItem(agent, this.databrowser);

      return { os: os, browser: browser };
    },
    matchItem: function (string: string, data: any) {
      var i = 0,
        j = 0,
        html = "",
        regex,
        regexv,
        match,
        matches,
        version;

      for (i = 0; i < data.length; i += 1) {
        regex = new RegExp(data[i].value, "i");
        match = regex.test(string);
        if (match) {
          regexv = new RegExp(data[i].version + "[- /:;]([\\d._]+)", "i");
          matches = string.match(regexv);
          version = "";
          if (matches) {
            if (matches[1]) {
              matches = matches[1];
            }
          }
          if (matches) {
            matches = matches.toString().split(/[._]+/);
            for (j = 0; j < matches.length; j += 1) {
              if (j === 0) {
                version += matches[j] + ".";
              } else {
                version += matches[j];
              }
            }
          } else {
            version = "0";
          }
          return {
            name: data[i].name,
            version: parseFloat(version),
          };
        }
      }
      return { name: "unknown", version: 0 };
    },
  };

  var e = module.init();

  let obj = {
    os: e.os.name,
    osVersion: e.os.version,
    browser: e.browser.name,
    browserVersion: e.browser.version,
    userAgent: navigator.userAgent,
    appVersion: navigator.appVersion,
    platform: navigator.platform,
    vendor: navigator.vendor,
  };

  return obj;
}

function createFlag(
  title: string,
  description: string,
  projectId: string,
  dataUrl: string,
  sender: any,
  fullscreenData?: string
) {
  chrome.storage.local.get("token", (data) => {
    let token = data.token;

    const obj = getSystemData();
    const body = {
      name: "New Bug Report #" + Math.floor(Math.random() * 1000),
      description: "",
      systemData: obj,
      flagType: "image",
    };

    fetch(API_URL + "/flag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...body,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        uploadDocument(data.id, dataUrl, token, sender, 1);
        if (fullscreenData) {
          uploadDocument(data.id, fullscreenData, token, sender, 0);
        }
      })
      .catch((error) => {
        if (error.status == 401) {
          chrome.storage.local.remove("token", () => {
            console.log("Token removed");
          });
        }
        console.log("error", JSON.stringify(error));
      });
  });
}

const uploadDocument = (
  id: string,
  dataUrl: string,
  token: string,
  sender: any,
  documentType: number
) => {
  const formData = new FormData();
  const file = dataURLtoFile(dataUrl, "screenshot.png");
  formData.append("document", file);

  fetch(`${API_URL}/flag/uploadDocument/${id}?documentType=${documentType}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => response.json())
    .then(async (data) => {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      chrome.tabs.sendMessage(sender?.tab?.id, { type: "remove_iframe" });
      chrome.tabs.create({
        url: "https://localhost:3201/home/flags/" + id,
        active: true,
      });
    })
    .catch((error) => {
      console.log("Upload failed", error);
    });
};

async function login(email: string, password: string) {
  fetch(API_URL + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => response.json())
    .then(async (data) => {
      if (data.error) {
        return { error: data.error };
      } else {
        await chrome.storage.local.set({ token: data.token.toString() }, () => {
          console.log("Token saved", data.token);
        });
        await chrome.storage.local.set({ user: JSON.stringify(data) }, () => {
          console.log("User saved", data);
          chrome.storage.local.get("token", (data) => {
            console.log("Token saved", data);
          });
        });
        console.log("Login successful", data);
        return { success: true, data: data };
      }
    })
    .catch((error) => {
      console.log("login error", error);
    });
}

function refreshToken(token: string) {
  return new Promise((resolve, reject) => {
    fetch(API_URL + "/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.error) {
          reject({ error: data.error });
        } else {
          await chrome.storage.local.set(
            { token: data.token.toString() },
            () => {
              console.log("Token saved", data.token);
            }
          );
          await chrome.storage.local.set({ user: JSON.stringify(data) }, () => {
            console.log("User saved", data);
            chrome.storage.local.get("token", (data) => {
              console.log("Token saved", data);
            });
          });
          console.log("Login successful", data);
          resolve({ success: true, data: data });
        }
      })
      .catch((error) => {
        reject({ error: error });
        console.log("login error", error);
      });
  });
}

function getUserProjects() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("token", (data) => {
      let token = data.token;

      fetch(API_URL + "/user/projects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          console.log("error", JSON.stringify(error));
          chrome.storage.local.remove("token", () => {
            console.log("Token removed");
          });
          reject(error);
        });
    });
  });
}

chrome.action.onClicked.addListener(async (tab) => {
  const existingContexts = await chrome.runtime.getContexts({});
  let recording = false;

  const offscreenDocument = existingContexts.find(
    (c) => c.contextType === "OFFSCREEN_DOCUMENT"
  );

  // If an offscreen document is not already open, create one.
  if (!offscreenDocument) {
    // Create an offscreen document.
    chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: ["USER_MEDIA" as chrome.offscreen.Reason],
      justification: "Recording from chrome.tabCapture API",
    });
  }

  if (recording) {
    chrome.runtime.sendMessage({
      type: "stop-recording",
      target: "offscreen",
    });
    chrome.action.setIcon({ path: "icons/not-recording.png" });
    return;
  }

  // Get a MediaStream for the active tab.
  chrome.tabCapture.getMediaStreamId(
    {
      targetTabId: tab.id,
    },
    (streamId) => {
      // Send the stream ID to the offscreen document to start recording.
      chrome.runtime.sendMessage({
        type: "start-recording",
        target: "offscreen",
        data: streamId,
      });
    }
  );
});
