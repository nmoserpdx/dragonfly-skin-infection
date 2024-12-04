import { memo,useEffect,useState } from "react";
import TimerBar from "../../components/TimerBar";
import { Button } from "semantic-ui-react";
import { useAdvSampleStore } from "../../storeAdv/advSample";
import { useAdvSampleTimerStore } from "../../storeAdv/advSampleTimer";
const StepsProgressBar = ({step,sampleNo,handleComplete,completed}) =>{

    const [steps, setsteps] = useState()

    const {
        advSamples,
        advSampleCompletedStep
    } = useAdvSampleStore()
    const {
        AdvSampleTimerPos,
    } = useAdvSampleTimerStore()
    useEffect(() => {
        handleComplete(steps)
    }, [steps])
    return (
        <div className={`stepBar ${advSampleCompletedStep[sampleNo].includes(step.name) && !AdvSampleTimerPos[sampleNo][step.timerId].isPlaying ?``:`bg-white`}  `}>

    {step.timer? <>

     <TimerBar stepName={step.name} timerId={step.timerId} prevStep={step.prevStep} sampleNo={sampleNo}/>
     </>:

     <>
     <Button onClick={(e) => { setsteps(e.target.name); }} className={`${completed.includes(step.name)?"bg-green":""} ${step.timer?"stepBarButtonTimer":"stepBarButton font-2rem"}`}  name={step.name} disabled={advSamples[sampleNo]?false:true}>{step.name}
       </Button>
       </>}
   {/* { stepTimer?{Name}:<><div>{stepName}</div> <div>{timer}</div></>} */}

    </div>

    )
}

export default memo(StepsProgressBar)
