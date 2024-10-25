import React from "react";
import { useEffect, useState } from "react";
import "../tailwind.css";
import { IoMdHelpCircleOutline } from "react-icons/io";
import Section from "./components/Section";
import SectionCapture from "./components/SectionCapture";
import PreviewImage from "./components/PreviewImage";

export const env = {
  IMAGE_URL: "https://d28exn2y7ee0u1.cloudfront.net/static",
  // LIVE_URL: "https://flagbox-ui.vercel.app",
  LIVE_URL: "http://localhost:5001",
};

interface PreviewInterface {
  sectionDataUrl: Array<string>;
  dataUrl: string;
  type: string;
}

const App = () => {
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("");
  const [preivewObject, setPreviewObject] = useState<PreviewInterface>({
    sectionDataUrl: [],
    dataUrl: "",
    type: "",
  });

  const handleOnCapture = (
    sectionsData: Array<string>,
    fullScreenData: string
  ) => {
    let previewObject = {
      sectionDataUrl: sectionsData,
      dataUrl: fullScreenData,
      type: type,
    };
    setPreviewObject(previewObject);
    setType("edit");
  };

  const handleClose = () => {
    chrome.runtime.sendMessage({ type: "remove_iframe" });
  };

  useEffect(() => {
    setLoading(true);
    chrome.storage.local.get("section", (data) => {
      console.log("section", data.section);
      setType(data.section);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-start w-screen h-screen bg-transparent px-4 py-[16px]">
      {type == "single_section" ? (
        <SectionCapture onCapture={handleOnCapture} />
      ) : type == "edit" ? (
        <PreviewImage
          sectionDataUrl={preivewObject.sectionDataUrl}
          dataUrl={preivewObject.dataUrl}
          type={preivewObject.type}
          handleClose={handleClose}
        />
      ) : null}

      <p className=" absolute left-0 top-0 text-black text-xl">{type}</p>
    </div>
  );
};

export default App;
