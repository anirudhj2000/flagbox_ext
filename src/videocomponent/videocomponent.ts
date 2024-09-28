// Button event listener for starting the recording
document.getElementById("start")?.addEventListener("click", async () => {
  console.log("Start recording button clicked");
  window.parent.postMessage({ type: "start_recording" }, "*");
});

// Button event listener for stopping the recording
document.getElementById("stop")?.addEventListener("click", () => {
  console.log("Stop recording button clicked");
  window.parent.postMessage({ type: "stop_recording" }, "*");
  chrome.runtime.sendMessage({ type: "remove_iframe" });
});
