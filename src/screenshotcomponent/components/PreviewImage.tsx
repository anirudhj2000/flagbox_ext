import React, { useEffect, useState } from "react";
import Editor from "./image-editor/editor";
import { IoMdClose } from "react-icons/io";

interface PreviewImageProps {
  sectionDataUrl: Array<string>;
  dataUrl: string;
  type: string;
  handleClose: () => void;
}

interface ImageObject {
  url: string;
  id: number;
  type: string;
}

const PreviewImage = ({
  sectionDataUrl,
  dataUrl,
  type,
  handleClose,
}: PreviewImageProps) => {
  const [loading, setLoading] = useState(true);
  const [imagesArray, setImagesArray] = useState<Array<ImageObject>>([]);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let array: Array<ImageObject> = [];
    sectionDataUrl.map((item, index) => {
      let obj: ImageObject = {
        url: item,
        id: index + 1,
        type: "section",
      };
      array.push(obj);
    });

    array.push({
      url: dataUrl,
      id: 0,
      type: "full",
    });

    setActiveImage(0);

    console.log("array", array);
    setImagesArray([...array]);
  }, [type]);

  return (
    <div className="h-screen w-screen bg-black/5 flex flex-col items-center justify-center">
      <div className="w-[80vw] h-[80vh] relative flex flex-col items-start rounded-xl shadow-lg bg-white ">
        <div className="w-full h-[5vh] flex flex-row items-center border-b-[1px] border-gray-300 justify-between px-4">
          <p className=" text-red-500 text-2xl font-bold">Create Flag</p>

          <button onClick={handleClose}>
            <IoMdClose className=" text-xl" />
          </button>
        </div>
        <div className=" w-full flex flex-row justify-between items-center h-[75vh]">
          <div className=" flex flex-col items-center justify-center h-full w-8/12 border-r-[1px] border-gray-300">
            <div className=" h-[62.5vh] w-full flex flex-col items-center justify-center border-b-[1px] border-gray-300">
              {imagesArray.length > 0 ? (
                <Editor imageUrl={imagesArray[activeImage].url} />
              ) : (
                ""
              )}
            </div>
            <div className=" flex flex-row items-center h-[12.5vh] justify-center gap-x-4">
              {imagesArray.map((item, index) => {
                return (
                  <button
                    className={` w-[10vh] h-[12.5vh] flex flex-col items-center justify-center`}
                    onClick={() => setActiveImage(index)}
                    key={index}
                  >
                    <img
                      key={index}
                      className={`${
                        activeImage == index
                          ? "border-[1px] border-[#EB0D0D]"
                          : ""
                      }
                      w-[10vh] h-[10vh]`}
                      style={{
                        objectFit: "contain",
                      }}
                      src={item.url}
                    />

                    {item.type == "full" ? (
                      <p className="text-[#EB0D0D] text-sm font-semibold">
                        Full screen
                      </p>
                    ) : (
                      <p className="text-[#EB0D0D] text-sm font-semibold">
                        Section {item.id}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className=" flex flex-col items-center justify-center w-4/12"></div>
        </div>
      </div>
    </div>
  );
};

export default PreviewImage;
