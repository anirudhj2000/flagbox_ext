import React, { useState, useEffect, useRef } from "react";
import ReactSlider from "react-slider";
import Spinner from "../../utils/spinner";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

async function convertBlobToMp4(videoBlob: Blob) {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  // Write Blob data to ffmpeg file system
  ffmpeg.writeFile("writeFile", "input.webm", await fetchFile(videoBlob));

  // Run the conversion command to MP4 format
  await ffmpeg.run("-i", "input.webm", "output.mp4");

  // Read the converted file as Uint8Array
  const data = ffmpeg.FS("readFile", "output.mp4");

  // Create an MP4 Blob from Uint8Array
  return new Blob([data.buffer], { type: "video/mp4" });
}

interface EditorProps {
  dataUrl: Blob;
  onSave: (dataUrl: string) => void;
}

const Editor = ({ dataUrl, onSave }: EditorProps) => {
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState(0);

  useEffect(() => {
    if (dataUrl) {
      const video = videoRef.current;

      if (video) {
        video.style.display = "none";
        console.log("dataUrl", dataUrl);
        video.src = dataUrl;
        video.controls = true;
        video.addEventListener("loadedmetadata", (event) => {
          console.log("metadata", event);
          setVideoDuration(video.duration);
          setLoading(false);
          video.style.display = "block";
          console.log("video duration", video.duration);
        });
      }
    }
  }, [dataUrl]);

  // if (loading) {
  //     return <div className="w-full h-full flex flex-col bg-gray-100 items-center justify-center ">
  //         <Spinner loading={loading} width={12} height={24} color="#fd6262" />
  //     </div>
  // }

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 items-center justify-center ">
      {loading ? (
        <div className=" absolute top-0 left-0 ">
          <Spinner loading={loading} width={12} height={24} color="#fd6262" />
        </div>
      ) : null}

      <div className=" w-full h-[70vh] relative flex items-center justify-center ">
        <video preload="auto" ref={videoRef} />
      </div>
      <div className=" w-full flex flex-col bg-red-50 items-start justify-center h-[10vh] relative px-8">
        <h3 className=" text-xl font-semibold text-black/90">Edit the video</h3>
        <div className=" w-full flex flex-col items-start justify-center">
          <ReactSlider
            className="slider"
            thumbClassName="thumb"
            trackClassName="track"
            defaultValue={[0, videoDuration]}
            min={0}
            max={videoDuration}
            ariaLabel={["Lower thumb", "Upper thumb"]}
            ariaValuetext={(state: { valueNow: any }) =>
              `Thumb value ${state.valueNow}`
            }
            renderThumb={(props: any, state: any) => (
              <div {...props}>{state.valueNow}</div>
            )}
            pearling
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
