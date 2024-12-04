import React, { useEffect } from "react";
import { useSampleStore } from "../../store/samples";
//import { TIMER_SECONDS } from "../../constants";
import { useUIStore } from "../../store/ui";
import { secondsToTime } from "../../helpers";
import { useHeaterStore } from "../../store/heaterStore";
import { useAdvTimerStore } from "../../storeAdv/advTimers";

const AdvProgressbar = ({ id,no,loaded}) => {
  const uiState = useUIStore()
  const { openScanner,setHasCaptureSampleScreen } = uiState;
  const sampleState = useSampleStore()
  const { setScanningId,samplePos,setScanningIdPos } = sampleState
  const heaterState = useHeaterStore()
  const {timerForSamplePos,activeTimer,setIncubationTimer,incubationTimer,removeTimerForSamplePos} = useAdvTimerStore()
  const {removeHeaterID} = heaterState
  const { voidSamples, setVoidSamples, removeVoidSample,begSampleReadyForScan,setBegSampleReadyForScan } = sampleState;
  function handlescan() {
    openScanner(true)
    setHasCaptureSampleScreen(true)
   setScanningId(id)
   setScanningIdPos(samplePos[id])

  }
  //old code below
  /*
  function handleAdd(){
    addExtraTime(id,500)
  }
  */
  useEffect(()=>{

    if(timerForSamplePos[id]){
      if(!voidSamples.includes(id)){
        if(!timerForSamplePos[id].isPaused)
          setIncubationTimer(id,activeTimer-timerForSamplePos[id].timerInsertedAt)
      }
      if(timerForSamplePos[id].heaterTimerEndsAt && timerForSamplePos[id].heaterTimerEndsAt-activeTimer<0 && !begSampleReadyForScan.includes(id)){
        setBegSampleReadyForScan([...begSampleReadyForScan,id])

      }else if(timerForSamplePos[id].heaterTimerEndsAt && timerForSamplePos[id].timerVoidAt+-activeTimer<0 && !voidSamples.includes(id))
      {

        setVoidSamples([
          ...voidSamples,
          id
        ])
      }


    }

  },[activeTimer])

  const displayTimer = (timervar) => {
    let timer = secondsToTime(timervar);
    return (`${timer.m}:${timer.s}`)
  };

  // const perc = Math.trunc(100 - (+timerMapper[id] / TIMER_SECONDS) * 100);

  const handleVoidSample = () => {
    removeHeaterID(samplePos[id])
    removeTimerForSamplePos(id)
    removeVoidSample(id)
  }

  //Old Code
  /*
  const handleHeater = (event) => {
    const { name } = event.target;
    setLoadNo(name)
    // setHeater(name,currentSample.id)
  }
  */

  return (<>
    {/* <button onClick={handleAdd}>add</button> */}
    <div style={loaded?{maxWidth:"20.83vw",minWidth:"20.83vw",minHeight:"4.26vh",backgroundColor:"#24B34B"}:{maxWidth:"20.83vw",minWidth:"20.83vw",minHeight:"4.26vh"}}  className={`relative w-full pheight flex items-center rounded-[40px] ${id ? `bg-[#24B34B]` : "bg-[#d3d3d3]"}  ${voidSamples.includes(id) ? "!bg-[red] text-white" : begSampleReadyForScan.includes(id) && !voidSamples.includes(id)? "!bg-[#ffc314]" : ""}`}>

    {<>

    <div style={{maxWidth:"20.83vw",minWidth:"20.83vw"}} id="up1" className="flex justify-center w-full p-[0] !text-[2.78vh] absolute text-center">
      <span>{id}</span>
      <span>{timerForSamplePos[id]  ? displayTimer(incubationTimer[id]) : null}</span>
      {/* {timerMapper[id] === 0 && <span>Scan</span>} */}
      {voidSamples.includes(id) && <span onClick={handleVoidSample}>Void</span>}
      {!voidSamples.includes(id) && begSampleReadyForScan.includes(id) && <span onClick={handlescan} >Capture</span>}

    </div>
    </>}

  </div>
  </>
  )
};

export default AdvProgressbar;
