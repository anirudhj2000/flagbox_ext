// Add a message listener
// document.addEventListener("mousedown", startDrawing);
// document.addEventListener("mouseup", stopDrawing);

let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;
let show = false;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // // Handle the received message
  // const box = document.createElement("div");
  // box.style.position = "fixed";
  // box.style.left = `0`;
  // box.style.top = `0`;
  // box.style.width = `100vw`;
  // box.style.height = `100vh`;
  // box.style.border = "1px dashed red";
  // box.style.zIndex = "9995";
  // box.style.backgroundColor = "transparent";
  // box.style.cursor = "crosshair";

  // document.body.appendChild(box);

  // Insert the fetched HTML into the document
  // const buttonGroup = document.createElement("div");
  // buttonGroup.style.position = "fixed";
  // buttonGroup.style.bottom = "10px";
  // buttonGroup.style.right = "10px";
  // buttonGroup.style.zIndex = "9999";
  // buttonGroup.innerHTML = `<div class="container">
  //     <div id="rollout" class="rollout-icon">
  //       <ul class="list">
  //         <li><a>Comment</a></li>
  //         <li><a>Marker</a></li>
  //         <li><a>Note</a></li>
  //         <li><a id="capture-image">Capture</a></li>
  //       </ul>
  //     </div>
  //     <div id="main-button" class="main-button">
  //       <p>+</p>
  //     </div>
  // </div>`;

  const iframe = document.createElement("iframe");
  iframe.src = chrome.runtime.getURL("buttoncomponent.html");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "100vw";
  iframe.style.height = "100vh";
  iframe.style.border = "none";
  iframe.style.border = "1px dashed #fa7d7d";
  iframe.style.zIndex = "9999999";
  iframe.style.backgroundColor = "transparent";
  iframe.style.cursor = "crosshair";
  iframe.style.overflow = "hidden";
  iframe.scrolling = "no";

  document.body.appendChild(iframe);
  // let rollout = document.getElementById("rollout");

  // document.getElementById("capture-image")?.addEventListener("click", () => {
  //   console.log("capture-image", rollout);

  //   chrome.runtime.sendMessage(
  //     {
  //       type: "take_screenshot",
  //       x: startX,
  //       y: startY,
  //       width: endX - startX,
  //       height: endY - startY,
  //     },
  //     function (response) {
  //       console.log("called");
  //       console.log("pricess images called", response);
  //       if (response && response.response) {
  //         confirm("Image Captured");
  //         processImage(
  //           response.response,
  //           startX,
  //           startY,
  //           endX - startX,
  //           endY - startY
  //         );
  //       }
  //     }
  //   );
  // });

  // document.getElementById("main-button")?.addEventListener("click", () => {
  //   alert("main-button");
  //   console.log("abcd", rollout, rollout?.style.animationName);
  //   if (!show && rollout) {
  //     rollout.style.animationName = "animate";
  //     rollout.style.animationDuration = "2s";
  //     rollout.style.transform = "translateX(0)";
  //   } else if (show && rollout) {
  //     rollout.style.animationName = "";
  //     rollout.style.transform = "translateX(30vw)";
  //   }
  //   show = !show;
  // });
});

// function startDrawing(e: any) {
//   if (e.shiftKey) {
//     console.log("startDrawing", e);
//     startX = e.clientX;
//     startY = e.clientY;
//     console.log("startDrawing", e, startX, startY);
//   }
// }

// function stopDrawing(e: any) {
//   if (e.shiftKey) {
//     console.log("stopDrawing", e);
//     endX = e.clientX;
//     endY = e.clientY;
//     const box = document.createElement("div");
//     box.style.position = "fixed";
//     box.style.left = startX + "px";
//     box.style.top = startY + "px";
//     box.style.width = endX - startX + "px";
//     box.style.height = endY - startY + "px";
//     box.style.border = "1px dashed yellow";
//     box.style.zIndex = "1202";
//     box.style.backgroundColor = "transparent";
//     document.body.appendChild(box);
//     console.log("stopDrawing", e, box);
//   }
// }

// function processImage(
//   dataUrl: string,
//   x: number,
//   y: number,
//   width: number,
//   height: number
// ) {
//   console.log("processImage", dataUrl, x, y, width, height);
//   const img = new Image();
//   img.src = dataUrl;
//   img.onload = () => {
//     const canvas = document.createElement("canvas");
//     canvas.width = width;
//     canvas.height = height;
//     const ctx = canvas.getContext("2d")!;
//     ctx.drawImage(img, 0, 0, window.innerWidth, window.innerHeight);
//     canvas.toBlob((blob) => {
//       console.log("blob", blob);
//       if (blob) {
//         console.log("blob", blob);
//         try {
//           const url = URL.createObjectURL(blob);
//           const link = document.createElement("a");
//           link.href = url;
//           console.log("link", link);
//           link.download = "screenshot.png";
//           document.body.appendChild(link);
//           link.click();
//           console.log("link", link, "clicked");
//           document.body.removeChild(link);
//           URL.revokeObjectURL(url);
//         } catch (error) {
//           console.log("error", error);
//         }
//       }
//     }, "image/png");
//   };
// }
