import { useEffect, useRef, useState } from "react"
import cv from '../../services/cv'

const Video = () => {
    const [processing, updateProcessing] = useState(false)
    const videoElement = useRef(null)
    const canvasEl = useRef(null)
    const maxVideoSize = 200;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
      await cv.load();
      console.log("Loaded");
    }, [])
  //  const data = cv._status?.canny ? cv._status?.canny[1].data.payload : []
   async function detectionAlgo() {
     const ctx = canvasEl.current.getContext('2d')
     ctx.drawImage(videoElement.current, 0, 0, 200, 200)
     const image = ctx.getImageData(0, 0, 200, 200)
     var data = cv._status?.canny ? cv._status?.canny[1].data.payload : []
     // // Render the processed image to the canvas
      if(data instanceof ImageData) {
        ctx.putImageData(data, 0, 0)
      }
     await cv.processVideo(image);
   }
      setInterval(() => {
        detectionAlgo()
      }, 400)
      useEffect(() => {
        async function initCamara() {
          videoElement.current.width = maxVideoSize
          videoElement.current.height = maxVideoSize

          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: false,
              video: {
                facingMode: 'user',
                width: maxVideoSize,
                height: maxVideoSize,
              },
            })
            videoElement.current.srcObject = stream

            return new Promise((resolve) => {
              videoElement.current.onloadedmetadata = () => {
                resolve(videoElement.current)
              }
            })
          }
          const errorMessage =
            'This browser does not support video capture, or this device does not have a camera'
          alert(errorMessage)
          return Promise.reject(errorMessage)
        }

        async function load() {
          const videoLoaded = await initCamara()
          videoLoaded.play()
          return videoLoaded
        }

        load()
      }, [])
    return (
        <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <video className="video" playsInline ref={videoElement} height="200" width="200" />
      <button
        disabled={processing}
        style={{ width: maxVideoSize, padding: 10 }}
        onClick={detectionAlgo}
      >
        {processing ? 'Processing...' : 'Take a photo'}
      </button>
      <canvas
        ref={canvasEl}
        width={maxVideoSize}
        height={maxVideoSize}
      ></canvas>
    </div>
    )
}

export default Video;
