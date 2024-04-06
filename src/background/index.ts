// content script (content.ts)
function blobToFile(theBlob: any, fileName: string) {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }

  function saveScreenshot(blob :any) {
    var url = URL.createObjectURL(blob);
    chrome.downloads.download({
       url: url,
       filename: 'screenshot.png'
    }, function(downloadId) {
       URL.revokeObjectURL(url);
    });
   }

// Listen for a message from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Taking screenshot message recieved1', message);

    if (message.type === 'take_screenshot') {
        console.log('Taking screenshot message recieved2', message);
        // Take a screenshot of the screen
        chrome.tabs.captureVisibleTab( null, { format: 'png' }, function(screenshotUrl) {
            console.log("screenshotUrl",screenshotUrl)
            // Send the screenshot URL back to the background script
            var byteString = atob(screenshotUrl.split(',')[1]);
            console.log("screenshotUrl1",screenshotUrl, byteString)
            var mimeString = screenshotUrl.split(',')[0].split(':')[1].split(';')[0];
            console.log("screenshotUrl2",screenshotUrl, mimeString)
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var blob = new Blob([ab], {type: mimeString});
            saveScreenshot(blob);
        });
    }
});