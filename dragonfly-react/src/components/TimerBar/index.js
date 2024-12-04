import { memo,useEffect } from "react"

import { Button } from "semantic-ui-react";
import { useAdvSampleStore } from "../../storeAdv/advSample";
import useClick from "../../containers/useClick";
import { useAdvSampleTimerStore } from "../../storeAdv/advSampleTimer";
import { TIMER_FOR_STEPS } from "../../constants";
// import { useAdvUiStore } from "../../storeAdv/advUi";
//import {useDelay} from"react-use-precision-timer";
import useSound from 'use-sound';
import beebeepala_30sec_alarmnorepeat from "../../Sounds/beebeepala_30sec_alarmnorepeat.mp3"
import { AdvanceInstructions } from "../../logic/instructions";


const TimerBar = ({sampleNo,stepName,prevStep,timerId}) =>{
  // const ref = useRef(null);
  // const [set,setset] = useState(false)
    const {
        setAdvSampleCompletedStep,
        advSampleCompletedStep
    } = useAdvSampleStore()
    // const [timerKey, updateTimer] = useState(0);
  const {
        setPlayStateForTimerID,
        reduceTimerBySecond,
        resetTimer,
        AdvSampleTimerPos,
    } = useAdvSampleTimerStore()
    const perc = Math.trunc(100 - (+100 / TIMER_FOR_STEPS * AdvSampleTimerPos[sampleNo][timerId].timer));
    const [play] = useSound(beebeepala_30sec_alarmnorepeat,{ volume: 0.5 });
    useEffect(() => {

        let locaTimerId = null;
        if (AdvSampleTimerPos[sampleNo][timerId]?.timer && AdvSampleTimerPos[sampleNo][timerId]?.isPlaying) {
            locaTimerId = setInterval(() => {
            reduceTimerBySecond(sampleNo,timerId);
          }, 1000)
        }
        if(AdvSampleTimerPos[sampleNo][timerId].timer===0){
          if(!advSampleCompletedStep[sampleNo].includes(stepName))
           { setAdvSampleCompletedStep(sampleNo,stepName)


          }
          setPlayStateForTimerID(sampleNo,timerId, false)
          resetTimer(sampleNo,timerId)
          play()
        }

        return () => clearInterval(locaTimerId)
      }, [timerId, AdvSampleTimerPos[sampleNo][timerId]?.timer, reduceTimerBySecond, AdvSampleTimerPos[sampleNo][timerId]?.isPlaying])


    const onLongPress = () => {
      //Do nothing as workflow changed
        //setIFUscreenFor(stepName)
        //setIsIFUscreen(true)
      };

      // useEffect(()=>{
      //   const timer = () => setTimeout(() =>  setanimation([...animation,sampleNo+stepName]) , 1000);
      //   const timerId = timer();
      //   return () => {
      //     clearTimeout(timerId);
      //   };

      // },[set])


      const onClick = () => {
      //   if(!animation.includes(sampleNo)){
      //    console.log(animation)

      //     setset(true)

      // }
        
    // Update other timers to 30 except selected timerID and record its timestamp
        if (AdvSampleTimerPos[sampleNo][timerId].timestamp === "") {
          AdvSampleTimerPos[sampleNo][timerId].timestamp = new Date().toISOString();
          console.log(AdvSampleTimerPos);
        }
        AdvanceInstructions.steps.map((step) => {
          if (step.timerId != timerId) {
            AdvSampleTimerPos[sampleNo][step.timerId].isPlaying = false;
            AdvSampleTimerPos[sampleNo][step.timerId].timer = 30;
          }
          return null;
        });
        console.log(AdvSampleTimerPos)

        if(AdvSampleTimerPos[sampleNo][timerId]) {
            if(!AdvSampleTimerPos[sampleNo][timerId].isPlaying) {
                setPlayStateForTimerID(sampleNo,timerId, true)
            }
        }
        else {
            // console.log(advSampleTimers[timerId])
        }

      };

      const onDoubleClick = () => {
        resetTimer(sampleNo,timerId)
      };
      const defaultOptions = {
        shouldPreventDefault: false,
        delay: 500
      };
      const isTimerPlaying = AdvSampleTimerPos[sampleNo][timerId].isPlaying
      const longPressEvent = useClick(onLongPress,onClick,onDoubleClick,isTimerPlaying, defaultOptions);

    return(

      <>
      {advSampleCompletedStep[sampleNo].includes(stepName) && !isTimerPlaying &&
      <><button className={`!absolute stepBarButtonTimer font-2rem ${sampleNo+stepName}`} {...longPressEvent}  name={stepName}/><div style={{width: `${100-perc}%`}} className="buttonabb"/></>}
        <Button className={`stepBarButtonTimer !text-[#292929] font-2rem ${sampleNo + stepName} ${isTimerPlaying ? "!justify-between" : ""} `}
          disabled={advSampleCompletedStep[sampleNo].includes(stepName) ? !isTimerPlaying : null}  {...longPressEvent} name={stepName}>
       <div style={{width: `${100-perc}%`}} className="buttonabb"/>
        <div>{stepName}</div>


        {/* className={`absolute  ${perc < 10 ? "rounded-l-[40px]" : "rounded-[40px]"} ${Number.isNaN(perc) || perc < 5 ? "hidden" : "block"} bg-[rgb(123,217,149)] h-[10px] `} */}
        {isTimerPlaying? <div >{AdvSampleTimerPos[sampleNo][timerId].timer}</div>:""}

        </Button>
        </>
    )
}
export default memo(TimerBar)
