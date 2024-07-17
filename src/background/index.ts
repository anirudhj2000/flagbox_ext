// content script (content.ts)
function blobToFile(theBlob: any, fileName: string) {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

function downloadBlobAsFile(buffer: ArrayBuffer) {
  //   console.log("blob", blob, typeof blob);
  //   var url = URL.createObjectURL(blob);
  //   chrome.downloads.download(
  //     {
  //       url: url,
  //       filename: "screenshot.png",
  //     },
  //     function (downloadId) {
  //       URL.revokeObjectURL(url);
  //     }
  //   );

  const blob = new Blob([buffer], { type: "image/png" });

  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "screenshot.png";
    document.body.appendChild(link);
    link.click();
    console.log("link", link, "clicked");
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.log("error", error);
  }
}

// Listen for a message from the background script

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
        sendResponse({ response: dataUrl });
      }
    );
  } else if (message.type === "downloadImage" && message.buffer) {
    console.log("downloadImage", message);
    downloadBlobAsFile(message.buffer);
  }
  return true;
});
