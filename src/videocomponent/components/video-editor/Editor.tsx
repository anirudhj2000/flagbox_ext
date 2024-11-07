
import React, { useState, useEffect, useRef } from 'react'
import ReactSlider from 'react-slider'
import Spinner from '../../utils/spinner'

interface EditorProps {
    dataUrl: string
    onSave: (dataUrl: string) => void
}

const Editor = ({ dataUrl, onSave }: EditorProps) => {
    const [loading, setLoading] = useState(true)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [videoDuration, setVideoDuration] = useState(0)

    useEffect(() => {
        if (dataUrl) {
            const video = videoRef.current
            if (video) {
                video.src = dataUrl;
                video.controls = true;
                video.addEventListener('loadedmetadata', (event) => {
                    console.log("metadata", event);
                    setVideoDuration(video.duration);
                    setLoading(false);
                });
            }
        }
    }, [dataUrl])


    if (loading) {
        return <div className="w-full h-full flex flex-col bg-gray-100 items-center justify-center ">
            <Spinner loading={loading} width={12} height={24} color="#fd6262" />
        </div>
    }


    return (
        <div className="w-full h-full flex flex-col bg-gray-100 items-center justify-center ">
            <div className=' w-full h-[70vh] relative flex items-center justify-center '>
                <video preload="auto" ref={videoRef} />
            </div>
            <div className=' w-full flex flex-col bg-red-50 items-start justify-center h-[10vh] relative px-8'>

                <h3 className=' text-xl font-semibold text-black/90'>Edit the video</h3>
                <div className=' w-full flex flex-col items-start justify-center'>
                    <ReactSlider
                        className="slider"
                        thumbClassName="thumb"
                        trackClassName="track"
                        defaultValue={[0, videoDuration]}
                        min={0}
                        max={videoDuration}
                        ariaLabel={['Lower thumb', 'Upper thumb']}
                        ariaValuetext={(state: { valueNow: any }) => `Thumb value ${state.valueNow}`}
                        renderThumb={(props: any, state: any) => <div {...props} >{state.valueNow}</div>}
                        pearling
                    />
                </div>
            </div>
        </div>
    )
}

export default Editor