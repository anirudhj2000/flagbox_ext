function loadButtonComponent() {
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;
  let show = false;

  let projects = [];

  document.addEventListener("mousemove", moveCursor);

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
      box.style.border = "1px dashed #cc6262";
      box.style.zIndex = "1202";
      box.style.backgroundColor = "transparent";
      document.body.appendChild(box);
      console.log("stopDrawing", e, box);

      chrome.runtime.sendMessage(
        {
          type: "take_screenshot",
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        },
        async function (response) {
          console.log("called");
          console.log("pricess images called", response);
          if (response && response.response) {
            // processImage(
            //   response.response,
            //   0,
            //   0,
            //   window.innerWidth,
            //   window.innerHeight
            // );

            const projects = response.projects;
            console.log("projects", projects);

            let dataUrl = await processImage(
              response.response,
              startX + 2,
              startY + 2,
              endX - startX - 2,
              endY - startY - 2
            );

            document.body.style.backgroundColor = "#00000044";

            document.removeEventListener("mousedown", startDrawing);
            document.removeEventListener("mouseup", stopDrawing);

            const projectSelect = document.getElementById("projects-select");
            console.log("projectSelect", projectSelect);
            if (projectSelect) {
              projects.forEach((project: any) => {
                const option = document.createElement("option");
                option.value = project.id;
                option.text = project.name;
                projectSelect.appendChild(option);
              });
            }

            const previewWindow = document.getElementById("preview-window");
            if (previewWindow) {
              previewWindow.style.display = "flex";
            }
            console.log("dataUrl abcd", dataUrl);

            const sectionBox = document.getElementById("section-box");
            if (sectionBox) {
              sectionBox.remove();
            }

            document
              .getElementById("preview-img")
              ?.setAttribute("src", dataUrl);

            document.getElementById("save")?.addEventListener("click", () => {
              CreateBugReport(dataUrl, response.response);
            });

            document.getElementById("cancel")?.addEventListener("click", () => {
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

loadButtonComponent();

function CreateBugReport(dataUrl: string, completeScreenshot?: string) {
  let title = (
    document.getElementById("preview-title-input") as HTMLInputElement
  ).value;

  let description = (
    document.getElementById("preview-description-textarea") as HTMLInputElement
  ).value;

  let includeFullScreen = (
    document.getElementById("include-fullscreen") as HTMLInputElement
  ).checked;

  const projectSelect = document.getElementById(
    "projects-select"
  ) as HTMLSelectElement;
  const selectedProjectId = projectSelect.value;

  console.log(
    "save button clicked",
    dataUrl,
    title,
    description,
    includeFullScreen
  );

  chrome.runtime.sendMessage({
    type: "upload_document",
    dataUrl: dataUrl,
    title,
    description,
    fullscreenData: includeFullScreen ? completeScreenshot : "",
    projectId: selectedProjectId,
  });
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
