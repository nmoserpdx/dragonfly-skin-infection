import { useEffect, useRef, useState } from "react"
import { useAdvTestDataStore } from '../../storeAdv/advTestData'
import { useUIStore } from '../../store/ui'

export default function Video({isQRCode, videoStyle, setIsTimeoutError = () => {}, timerId={current: null}}) {
  const videoElement = useRef(null)
  const [facingMode, setFacingMode] = useState('environment')
  const canvasCamera = useRef(null)
  const {
    setImage64
  } = useAdvTestDataStore()
  const uiState = useUIStore()
  const {
    setCamera
  } = uiState

  useEffect(() => {
    const getUserMedia = async () => {
      startCamera()
      setCamera(true)
    }
    getUserMedia()
    return () => {
      stopCamera()
      setCamera(false)
    }
  }, []);

  //For toggling cameras
  useEffect(() => {
  },[facingMode])

  // const handleFacingModeToggle = () => {
  //   // stopCamera()
  //   facingMode === 'environment'
  //     ? setFacingMode('user')
  //     : setFacingMode('environment')
  //   //startCamera()
  // }

  const stopCamera = () =>
	{
    console.log("-------------------STOP CAMERA-----------------");
		(videoElement.current && videoElement.current.srcObject
			? true
			: false) &&
		videoElement.current.srcObject.getTracks().forEach(t => t.stop())
		if(window.NativeDevice){
				window.NativeDevice.htmlCameraReadyToRecord(false)
		}
	}
 
  
	function startCamera() {
		if(videoElement.current && videoElement.current.srcObject){
			//Already started
      console.log("-------------------ALREADY RUNNING CAMERA-----------------");
			return
		}
    
   timerId.current = setTimeout(() => {
     setIsTimeoutError(true);
   }, 30000);
		// if(isCamera === false){
		// 	setCamera(true)
		// }
		if (navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices
				.getUserMedia(
					{video: {facingMode: {exact: facingMode}},
					width: { min: 1024, ideal: 1920, max: 1920 },
					height: { min: 576, ideal: 1200, max: 1280 },
					audio: false }
				).then(function (stream) {
					if (videoElement.current)
						videoElement.current.srcObject = stream
					const track = stream.getVideoTracks()[0]

					//Create image capture object and get camera capabilities
					const imageCapture = new ImageCapture(track)
					// const photoCapabilities = imageCapture
					// 	.getPhotoCapabilities()
					// 	.then(() => {
					// 		//todo: check if camera has a torch
					// 		//let there be light!
					// 		// track.applyConstraints({
					// 		// 	advanced: [{ focusMode: 'manual', focusDistance: 0.19 }]
					// 		// });
					// 	})
          console.log("-------------------START CAMERA-----------------");
				})
				.catch(function (error) {
					//alert('Please check your device permissions')
					//console.log('Something went wrong!')
					//error happened in opening the stream.. toggle the camera
					// if(facingMode === "environment"){
					// 	setFacingMode("user")
					// }else{
					// 	setFacingMode("environment")
					// }
				})
			if (videoElement.current)
				videoElement.current.onloadeddata = function () {
					if (window.NativeDevice)
						window.NativeDevice.htmlCameraReadyToRecord(true)
				}
		}
	}

  function getCurrentFrameAndSendToNative() {
    console.log("-------------------SENDING FRAME-----------------");
    var preview = canvasCamera.current
    var vid = videoElement.current
    if(preview!=null)
    {
      preview.width = 1920 //vid.offsetWidth;
      preview.height = 1200 //vid.offsetHeight;
      if(vid){ //call only when video is active
        var ctx = preview.getContext('2d')
        ctx.drawImage(vid, 0, 0, preview.width, preview.height)
        var data = preview.toDataURL('image/jpeg')
        setImage64(data)
        console.log("-------------------INSIDE VIDEO CAMERA-----------------");
        if (window.NativeDevice)
          window.NativeDevice.framesFromHtml(data, isQRCode)
      }else{
        console.log("-------------------VIDEO NOT VALID-----------------");
      }

    }
   
  }

  if (window)
    window.startCapturingFrames = function (frameRate) {
      setInterval(getCurrentFrameAndSendToNative, 1000 / frameRate)
  }

  return (
    <div>
      <video
        autoPlay={true}
        ref={videoElement}
        style={videoStyle}
        className={`border-3rem ${(facingMode === "user") ? "flipvideo" : "" }`}
        poster="images/videobkg.png"
      ></video>
      <canvas
        ref={canvasCamera}
        style={{
          maxWidth: 0,
          maxHeight: 0,
          visibility: 'hidden'
        }}
      ></canvas>
    </div>
  );
}
