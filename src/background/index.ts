// content script (content.ts)
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
  console.log("Taking screenshot message recieved", message);
  if (
    message.type === "take_screenshot" &&
    message.x != undefined &&
    message.y != undefined &&
    message.width &&
    message.height
  ) {
    console.log("Taking Process", message);

    chrome.tabs.captureVisibleTab(
      //@ts-ignore
      null,
      { format: "png" },
      (dataUrl) => {
        console.log("Resp sent Nia", message, dataUrl);
        // downloadBlobAsFile(dataUrl);
        sendResponse({ response: dataUrl });
      }
    );
  } else if (message.type === "upload_document" && message.dataUrl) {
    console.log("upload_document", message);
    createFlag(
      message.dataUrl,
      message.title,
      message.description,
      message.fullscreenData
    );
  } else if (message.type == "loginpopup") {
    console.log("Login Process", message);

    chrome.tabs.create({
      url: chrome.runtime.getURL("loginscreen.html"),
    });
  } else if (message.type == "login" && message.email && message.password) {
    const { email, password } = message;
    sendResponse(login(email, password));
  }

  return true;
});

function createFlag(
  dataUrl: string,
  title: string,
  description: string,
  fullscreenData: string
) {
  chrome.storage.local.get("token", (data) => {
    console.log("token 1", data);
    let token = data.token;

    refreshToken(token)
      .then((tokenData) => {
        console.log("token data", tokenData);

        const obj = getSystemData();
        const body = {
          name: title || "New Bug Report #" + Math.floor(Math.random() * 1000),
          description: description || null,
          systemData: obj,
        };

        fetch("http://localhost:7001/api/flag", {
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
            uploadDocument(data.id, dataUrl, token);

            if (fullscreenData) {
              uploadDocument(data.id, fullscreenData, token);
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
      })
      .catch((error) => {
        console.log("error", JSON.stringify(error));
        chrome.storage.local.remove("token", () => {
          console.log("Token removed");
          chrome.tabs.create({
            url: chrome.runtime.getURL("loginscreen.html"),
          });
        });
      });
  });
}

const uploadDocument = (id: string, dataUrl: string, token: string) => {
  const formData = new FormData();
  const file = dataURLtoFile(dataUrl, "screenshot.png");
  formData.append("document", file);

  console.log("uploading document", id, formData, dataUrl, file, typeof file);

  fetch(`http://localhost:7001/api/flag/uploadDocument/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => response.json())
    .then(async (data) => {
      console.log("Upload successful", data);
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const tab = tabs[0];
      console.log("tab", tab, tabs, tab.id);
      chrome.tabs.sendMessage(tab.id || 0, { type: "remove_iframe" });
    })
    .catch((error) => {
      console.log("Upload failed", error);
      chrome.storage.local.remove("token", () => {
        console.log("Token removed");
        chrome.runtime.sendMessage({ type: "loginpopup" });
      });
    });
};

async function login(email: string, password: string) {
  fetch("http://localhost:7001/api/login", {
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
    fetch("http://localhost:7001/api/refresh-token", {
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
