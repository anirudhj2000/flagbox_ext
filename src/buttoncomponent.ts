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
            processImage(
              response.response,
              0,
              0,
              window.innerWidth,
              window.innerHeight
            );
          }
        }
      );
    },
    { once: true }
  );
}

loadButtonComponent();

function processImage(
  dataUrl: string,
  x: number,
  y: number,
  width: number,
  height: number
) {
  console.log("processImage", dataUrl, x, y, width, height);
  const img = new Image();
  img.src = dataUrl;
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, window.innerWidth, window.innerHeight);
    canvas.toBlob((blob) => {
      console.log("blob", blob);
      if (blob) {
        console.log("blob", blob);
        try {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          console.log("link", link);
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
    }, "image/png");
  };
}
