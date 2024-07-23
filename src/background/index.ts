// content script (content.ts)
function blobToFile(theBlob: any, fileName: string) {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuaXJ1ZGhqb3NoaTI4NUBnbWFpbC5jb20iLCJpYXQiOjE3MjE0NzUyMzMsImV4cCI6MTcyMTUxODQzM30.WTsWS0O8TjjJK90VT41mfp9kg-sNXqkAhS8NdHFkQNg";
function downloadBlobAsFile(blob: string) {
  console.log("creating bug report", blob);
  const obj = getSystemData();
  const body = {
    name: "New Bug Report #" + Math.floor(Math.random() * 1000),
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
      console.log("bug report created data", data);
      uploadDocument(data.id, blob);
    })
    .catch((error) => {
      console.log("error", error);
    });

  // const blob = new Blob([buffer], { type: "image/png" });

  // try {
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = "screenshot.png";
  //   document.body.appendChild(link);
  //   link.click();
  //   console.log("link", link, "clicked");
  //   document.body.removeChild(link);
  //   URL.revokeObjectURL(url);
  // } catch (error) {
  //   console.log("error", error);
  // }
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

const uploadDocument = (id: string, blob: string) => {
  // let token = "";
  // chrome.storage.local.get("token", (data) => {
  //   console.log("token", data);
  //   token = data.token;
  // });

  const formData = new FormData();
  const file = dataURLtoFile(blob, "screenshot.png");
  formData.append("document", file);

  console.log("uploading document", id, formData, blob, file, typeof file);

  fetch(`http://localhost:7001/api/flag/uploadDocument/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Upload successful", data);
      chrome.runtime.sendMessage({ type: "remove_iframe" });
    })
    .catch((error) => {
      console.log("Upload failed", error);
    });
};

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
        downloadBlobAsFile(dataUrl);
      }
    );
  } else if (message.type === "upload_document" && message.blob) {
    console.log("upload_document", message);
    downloadBlobAsFile(message.blob);
  } else if (message.type == "login" && message.email && message.password) {
    console.log("Login Process", message);
    // Perform login logic here
    // Example:
    const { email, password } = message;
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
          sendResponse({ error: data.error });
        } else {
          console.log("Login successful", data);
          sendResponse({ success: true, data: data });

          await chrome.storage.local.set({ token: data.token.toString() });
          await chrome.storage.local.set({ user: JSON.stringify(data) });
        }
      })
      .catch((error) => {
        console.log("login error", error);
      });
  }

  return true;
});

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
