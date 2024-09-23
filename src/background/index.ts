// content script (content.ts)

import { parse } from "postcss";

// API URL
// const API_URL = "http://ec2-54-224-16-183.compute-1.amazonaws.com:7001/api";
const API_URL = "http://localhost:5001/api";

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

  console.log("System Data", obj);

  return obj;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(
    "Taking screenshot message recieved",
    message,
    message.type == "remove_iframe"
  );
  if (
    message.type === "take_screenshot" &&
    message.x != undefined &&
    message.y != undefined &&
    message.width &&
    message.height
  ) {
    chrome.tabs.captureVisibleTab(
      //@ts-ignore
      null,
      { format: "png" },
      async (dataUrl) => {
        const projects = await getUserProjects();
        sendResponse({ response: dataUrl, projects: projects });
      }
    );
  } else if (message.type === "record_video") {
    chrome.tabCapture.capture(
      {
        video: true,
        audio: true,
      },
      () => {}
    );
  } else if (message.type == "upload_document" && message.dataUrl) {
    createFlag(
      message.dataUrl,
      message.title,
      message.description,
      message.fullscreenData,
      message.projectId,
      sender
    );
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
  }

  return true;
});

function createFlag(
  dataUrl: string,
  title: string,
  description: string,
  fullscreenData: string,
  projectId: string,
  sender: any
) {
  chrome.storage.local.get("token", (data) => {
    console.log("token 1", data);
    let token = data.token;

    const obj = getSystemData();
    const body = {
      name: title || "New Bug Report #" + Math.floor(Math.random() * 1000),
      description: description || null,
      systemData: obj,
      projectId: parseInt(projectId),
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
        console.log("bug report", data);
        uploadDocument(data.id, dataUrl, token, sender);

        if (fullscreenData) {
          uploadDocument(data.id, fullscreenData, token, sender);
        }
      })
      .catch((error) => {
        if (error.status == 401) {
          chrome.storage.local.remove("token", () => {
            console.log("Token removed");
            chrome.tabs.create({
              url: chrome.runtime.getURL("loginscreen.html"),
            });
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
  sender: any
) => {
  const formData = new FormData();
  const file = dataURLtoFile(dataUrl, "screenshot.png");
  formData.append("document", file);

  console.log("uploading document", id, formData, dataUrl, file, typeof file);

  fetch(`${API_URL}/flag/uploadDocument/${id}`, {
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
      console.log("token 1", data);
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
          console.log("projects", data);
          resolve(data);
        })
        .catch((error) => {
          console.log("error", JSON.stringify(error));
          chrome.storage.local.remove("token", () => {
            console.log("Token removed");
            chrome.tabs.create({
              url: chrome.runtime.getURL("loginscreen.html"),
            });
          });
          reject(error);
        });
    });
  });
}
