function blobToDataURL(blob: Blob, callback: (dataUrl: string) => void) {
  var a = new FileReader();
  a.onload = function (e) {
    callback(e.target?.result?.toString() || "");
  };
  a.readAsDataURL(blob);
}

export function processImage(
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
