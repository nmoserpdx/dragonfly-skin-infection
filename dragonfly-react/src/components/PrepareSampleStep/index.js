import { useEffect, useState } from "react"
import Timer from "../Timer"
import { usePrepareSampleStore } from "../../store/prepareSampleTimers";
import { useAdvTimerStore } from "../../storeAdv/advTimers";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

const PrepareSampleStep = ({
    showTimer,
    description,
    timerId,
    timerKey,
    updateTimer,
    pauseTimer
}) => {
    const {
        prepareSampleTimers,
        setPlayStateForTimerID,
        startTimer
    } = usePrepareSampleStore()
   const {activeTimer}=useAdvTimerStore()
   const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions()) //defaulting to M10
   const [scale, setScale] = useState(1)
    // useEffect(() => {
    //     let locaTimerId = null;
    //     if (prepareSampleTimers[timerId]?.timer && prepareSampleTimers[timerId]?.isPlaying) {
    //         locaTimerId = setInterval(() => {
    //         reduceTimerBySecond(timerId);
    //         updateTimer(prevKey => prevKey + 1)
    //       }, 1000)
    //       console.log("hi")
    //       if(activeTimer-prepareSampleTimers[timerId].timerStartesAt>30){
    //         setPlayStateForTimerID(timerId, false)
    //     }
    //     }

    //     return () => clearInterval(locaTimerId)
    //   }, [timerId, prepareSampleTimers[timerId]?.timer, reduceTimerBySecond, prepareSampleTimers[timerId]?.isPlaying])

    useEffect(() => {
          if (prepareSampleTimers[timerId]?.isPlaying) {
            if(activeTimer-prepareSampleTimers[timerId].timerStartesAt>30){
              setPlayStateForTimerID(timerId, false)
          }
        }
    }, [activeTimer,prepareSampleTimers[timerId]?.isPlaying])

    useEffect(() => {
      // alert(windowDimensions.width + " " + windowDimensions.height)
      // let standardWidth = 1280
      let standardHeight = 728
      // let standardRatio = standardWidth/standardHeight
      //let currentRatio = windowDimensions.width / windowDimensions.height
      var currentRatio = 1
      if(windowDimensions.height !== 728){
        currentRatio = (windowDimensions.height - 100) / standardHeight
      }
      // var currentScale = standardRatio / currentRatio
      if(isNaN(currentRatio)){
          setScale(1)
      }else{
          setScale(currentRatio.toFixed(2))
      }
    },[scale])

    const handleTimerStart = () => {
        startTimer(timerId,activeTimer+1)
        // if(prepareSampleTimers[timerId]) {
            if(!prepareSampleTimers[timerId].isPlaying) {
                setPlayStateForTimerID(timerId, true)
            }
        console.log(prepareSampleTimers);
        // }
        // else {
        //     alert("TIMER HAS NOT BEEN MAPPED IN STORE")
        // }
    }

    return (
        <div className="mb-2" style={{display:"grid"}} >
            {showTimer && <button className="timerButton" style={{ borderRadius: "200%", alignSelf: "center", justifySelf: "center", transform: `scale(${scale})`}} onClick={handleTimerStart}>
                <Timer countdown={prepareSampleTimers[timerId].isPlaying?30-(activeTimer-prepareSampleTimers[timerId].timerStartesAt):30} duration={prepareSampleTimers[timerId].timer} isPlaying={prepareSampleTimers[timerId].isPlaying} />
            </button>}
        </div>
    )
}

export default PrepareSampleStep
