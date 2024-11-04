
import React, { useState, useEffect, useRef } from 'react'
import ReactSlider from 'react-slider'


interface EditorProps {
    dataUrl: string
    onSave: (dataUrl: string) => void
}

const Editor = ({ dataUrl, onSave }: EditorProps) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [videoDuration, setVideoDuration] = useState(0)

    useEffect(() => {
        if (dataUrl) {
            const video = videoRef.current
            if (video) {
                video.src = dataUrl
                video.load()
                video.play()
                video.controls = true
                video.onload = () => {
                    setVideoDuration(video.duration)
                }
            }
        }

    }, [dataUrl])


    return (
        <div className="w-full h-full flex flex-col bg-gray-100 items-center justify-center ">
            <div className=' w-full h-[70vh] relative '>
                <video ref={videoRef} className='w-full h-full' />
            </div>
            <div className=' w-full flex flex-col items-start justify-center h-[10vh] relative px-8'>

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