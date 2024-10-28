function loadscreenshotcomponent() {
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;
  let show = false;

  document.addEventListener("mousemove", moveCursor);

  let subtype = "single_section";

  chrome.storage.local.get("section", (data) => {
    console.log("section valala", data);
    if (data.section) {
      subtype = data.section;
    }

    if (subtype == "multiple_section") {
      const multiSelectDiv = document.getElementById("multi-select-div");
      if (multiSelectDiv) {
        multiSelectDiv.style.display = "flex";
      }
    }
  });

  document.getElementById("save-multi")?.addEventListener("click", () => {
    const multiSelectDiv = document.getElementById("multi-select-div");
    if (multiSelectDiv) {
      multiSelectDiv.style.display = "none";
    }

    chrome.runtime.sendMessage(
      {
        type: "take_screenshot",
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        subtype: "multiple_section",
      },
      async function (response) {
        console.log("called multiple section");
        CreateBugReport(response.response, response.response, subtype);
      }
    );
  });

  document.getElementById("cancel-multi")?.addEventListener("click", () => {
    const multiSelectDiv = document.getElementById("multi-select-div");
    if (multiSelectDiv) {
      multiSelectDiv.style.display = "none";
    }
    chrome.runtime.sendMessage({ type: "remove_iframe" });
  });

  function moveCursor(e: MouseEvent) {
    const cursor = document.getElementById("cursor");
    if (cursor) {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    }
  }

  const mouseup = document.addEventListener("mousedown", startDrawing);
  const mousedown = document.addEventListener("mouseup", stopDrawing);

  function startDrawing(e: any) {
    if (e.shiftKey) {
      console.log("startDrawing", e);
      startX = e.clientX;
      startY = e.clientY;
      console.log("startDrawing", e, startX, startY);
    }
  }

  function stopDrawing(e: any) {
    if (e.shiftKey) {
      console.log("stopDrawing", e);
      endX = e.clientX;
      endY = e.clientY;
      const box = document.createElement("div");
      box.id = "section-box";
      box.style.position = "fixed";
      box.style.left = startX + "px";
      box.style.top = startY + "px";
      box.style.width = endX - startX + "px";
      box.style.height = endY - startY + "px";
      box.style.border = "2px solid #cc6262";
      box.style.zIndex = "1202";
      box.style.backgroundColor = "transparent";
      document.body.appendChild(box);
      console.log("stopDrawing", e, box);

      if (subtype == "multiple_section") {
        return;
      }

      chrome.runtime.sendMessage(
        {
          type: "take_screenshot",
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        },
        async function (response) {
          console.log("called single section");
          if (response && response.response) {
            let dataUrl = await processImage(
              response.response,
              startX + 3,
              startY + 3,
              endX - startX - 3,
              endY - startY - 3
            );

            document.body.style.backgroundColor = "#00000044";

            document.removeEventListener("mousedown", startDrawing);
            document.removeEventListener("mouseup", stopDrawing);

            const previewWindow = document.getElementById("modal");
            if (previewWindow) {
              previewWindow.style.display = "flex";
            }

            const checkFullscreen = document.getElementById("check-fullscreen");
            if (checkFullscreen) {
              checkFullscreen.style.display = "flex";
            }

            console.log("dataUrl abcd", dataUrl);

            const sectionBox = document.getElementById("section-box");
            if (sectionBox) {
              sectionBox.remove();
            }

            document
              .getElementById("screenshot-image")
              ?.setAttribute("src", dataUrl);

            document
              .getElementById("save-screenshot")
              ?.addEventListener("click", () => {
                CreateBugReport(dataUrl, response.response, subtype);
              });

            document
              .getElementById("cancel-screenshot")
              ?.addEventListener("click", () => {
                if (previewWindow) {
                  previewWindow.style.display = "none";
                }
                chrome.runtime.sendMessage({ type: "remove_iframe" });
              });

            document
              .getElementById("close-preview")
              ?.addEventListener("click", () => {
                if (previewWindow) {
                  previewWindow.style.display = "none";
                }
                chrome.runtime.sendMessage({ type: "remove_iframe" });
              });
          }
        }
      );
    }
  }
}

loadscreenshotcomponent();

function CreateBugReport(
  dataUrl: string,
  completeScreenshot?: string,
  subtype?: string
) {
  let includeFullScreen = false;
  if (subtype == "single_section") {
    includeFullScreen = (
      document.getElementById("include-fullscreen") as HTMLInputElement
    ).checked;
  }

  console.log("save button clicked", dataUrl);

  if (includeFullScreen) {
    chrome.runtime.sendMessage({
      type: "upload_document",
      dataUrl: dataUrl,
      includeFullScreen: true,
      fullScreenData: completeScreenshot,
    });
  } else {
    chrome.runtime.sendMessage({
      type: "upload_document",
      dataUrl: dataUrl,
      includeFullScreen: false,
    });
  }
}

function blobToDataURL(blob: Blob, callback: (dataUrl: string) => void) {
  var a = new FileReader();
  a.onload = function (e) {
    callback(e.target?.result?.toString() || "");
  };
  a.readAsDataURL(blob);
}

function processImage(
  dataUrl: string,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    let updatedDataUrl: string = "";
    const img = new Image();
    img.src = dataUrl;

    img.onload = () => {
      console.log("Image loaded with dimensions:", img.width, img.height);
      console.log("Specified coordinates and dimensions:", x, y, width, height);

      // Calculate the scale factors
      const scaleX = img.width / window.innerWidth;
      const scaleY = img.height / window.innerHeight;

      // Scale the coordinates and dimensions
      const scaledX = x * scaleX;
      const scaledY = y * scaleY;
      const scaledWidth = width * scaleX;
      const scaledHeight = height * scaleY;

      console.log(
        "Scaled coordinates and dimensions:",
        scaledX,
        scaledY,
        scaledWidth,
        scaledHeight
      );

      // Validate coordinates and dimensions
      if (
        scaledX + scaledWidth > img.width ||
        scaledY + scaledHeight > img.height
      ) {
        console.error(
          "Specified coordinates and dimensions are out of bounds."
        );
        reject("");
      }

      const canvas = document.createElement("canvas");
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      const ctx = canvas.getContext("2d");

      ctx?.drawImage(
        img,
        scaledX,
        scaledY,
        scaledWidth,
        scaledHeight,
        0,
        0,
        scaledWidth,
        scaledHeight
      );
      canvas.toBlob((blob) => {
        console.log("blob", blob);
        if (blob) {
          console.log("blob and new data url", blob);
          blobToDataURL(blob, (dataUrl: string) => {
            console.log("blob and new data url", dataUrl);
            // chrome.runtime.sendMessage({
            //   type: "upload_document",
            //   dataUrl: dataUrl,
            // });

            console.log("dataUrl resolve", dataUrl);
            resolve(dataUrl);
          });
        }
      }, "image/jpeg");
    };
  });
}
