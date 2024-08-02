function loadButtonComponent() {
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;
  let show = false;

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
            let dataUrl = await processImage(
              response.response,
              startX,
              startY,
              endX - startX,
              endY - startY
            );

            document.body.style.backgroundColor = "#00000044";

            document.removeEventListener("mousedown", startDrawing);
            document.removeEventListener("mouseup", stopDrawing);

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
              let title = (
                document.getElementById("preview-title") as HTMLInputElement
              ).value;

              let description = (
                document.getElementById(
                  "preview-description"
                ) as HTMLInputElement
              ).value;

              let includeFullScreen = (
                document.getElementById(
                  "include-fullscreen"
                ) as HTMLInputElement
              ).checked;

              console.log("save button clicked", dataUrl);

              chrome.runtime.sendMessage({
                type: "upload_document",
                dataUrl: dataUrl,
                title,
                description,
                fullscreenData: includeFullScreen ? response.response : "",
              });
            });
          }
        }
      );
    }
  }
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

// const handleImageEdit = (dataUrl: string) => {
//   const dataUri = dataUrl.replace(/^data:image\/(png|jpeg);base64,/, "");

//   const { TABS, TOOLS }: any = FilerobotImageEditor;
//   const config: FilerobotImageEditorConfig = {
//     source: dataUri,
//     onSave: (editedImageObject: any, designState: any) => {
//       console.log("saved", editedImageObject, designState);
//       alert(
//         "Image saved " +
//           JSON.stringify(editedImageObject) +
//           typeof editedImageObject
//       );
//     },
//     annotationsCommon: {
//       fill: "#ff0000",
//     },
//     Text: { text: "Filerobot..." },
//     Rotate: { angle: 90, componentType: "slider" },
//     translations: {
//       profile: "Profile",
//       coverPhoto: "Cover photo",
//       facebook: "Facebook",
//       socialMedia: "Social Media",
//       fbProfileSize: "180x180px",
//       fbCoverPhotoSize: "820x312px",
//     },
//     Crop: {
//       presetsItems: [
//         {
//           titleKey: "classicTv",
//           descriptionKey: "4:3",
//           ratio: 4 / 3,
//           // icon: CropClassicTv, // optional, CropClassicTv is a React Function component. Possible (React Function component, string or HTML Element)
//         },
//         {
//           titleKey: "cinemascope",
//           descriptionKey: "21:9",
//           ratio: 21 / 9,
//           // icon: CropCinemaScope, // optional, CropCinemaScope is a React Function component.  Possible (React Function component, string or HTML Element)
//         },
//       ],
//       presetsFolders: [
//         {
//           titleKey: "socialMedia", // will be translated into Social Media as backend contains this translation key

//           // icon: Social, // optional, Social is a React Function component. Possible (React Function component, string or HTML Element)
//           groups: [
//             {
//               titleKey: "facebook",
//               items: [
//                 {
//                   titleKey: "profile",
//                   width: 180,
//                   height: 180,
//                   descriptionKey: "fbProfileSize",
//                 },
//                 {
//                   titleKey: "coverPhoto",
//                   width: 820,
//                   height: 312,
//                   descriptionKey: "fbCoverPhotoSize",
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     tabsIds: [TABS.ADJUST, TABS.ANNOTATE, TABS.WATERMARK], // or ['Adjust', 'Annotate', 'Watermark']
//     defaultTabId: TABS.ANNOTATE, // or 'Annotate'
//     defaultToolId: TOOLS.TEXT,
//     savingPixelRatio: 0,
//     previewPixelRatio: 0,
//   };

//   // Assuming we have a div with id="editor_container"

//   let editor_container = document.querySelector(
//     "#editor_container"
//   ) as HTMLElement;
//   if (editor_container) {
//     const filerobotImageEditor = new FilerobotImageEditor(
//       editor_container,
//       config
//     );

//     filerobotImageEditor.render();
//   }
// };
