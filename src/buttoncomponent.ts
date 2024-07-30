function loadButtonComponent() {
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;
  let show = false;

  console.log("Button component loaded");
  const button = document.getElementById("main-button");
  let rollout = document.getElementById("rollout");

  document.getElementById("main-button")?.addEventListener("click", () => {
    // alert("main-button");
    console.log("abcd", rollout, rollout?.style.animationName);
    if (!show && rollout) {
      rollout.style.animationName = "animate";
      rollout.style.animationDuration = "2s";
      rollout.style.transform = "translateX(0)";
    } else if (show && rollout) {
      rollout.style.animationName = "";
      rollout.style.transform = "translateX(30vw)";
    }
    show = !show;
  });

  document.addEventListener("mousedown", startDrawing);
  document.addEventListener("mouseup", stopDrawing);

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
    }
  }

  const captureImage = document.getElementById("capture-image");

  captureImage?.addEventListener(
    "click",
    function handleCaptureClik(e: any) {
      captureImage.removeEventListener("click", handleCaptureClik);
      console.log("capture-image", rollout);
      e.preventDefault();

      chrome.runtime.sendMessage(
        {
          type: "take_screenshot",
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        },
        function (response) {
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
            processImage(
              response.response,
              startX,
              startY,
              endX - startX,
              endY - startY
            );
          }
        }
      );
    },
    { once: true }
  );
}

loadButtonComponent();

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
) {
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
      console.error("Specified coordinates and dimensions are out of bounds.");
      return;
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
          chrome.runtime.sendMessage({
            type: "upload_document",
            dataUrl: dataUrl,
          });
        });
      }
    }, "image/jpeg");
  };
}
