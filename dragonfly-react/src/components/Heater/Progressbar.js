import React, { useEffect } from "react";
import { useSampleStore } from "../../store/samples";
import { useUIStore } from "../../store/ui";
import { secondsToTime } from "../../helpers";
import { useHeaterStore } from "../../store/heaterStore";
import { Button } from "semantic-ui-react"
import { useAdvTimerStore } from "../../storeAdv/advTimers";
import { ADV_TIMER_FOR_SCAN,ADV_TIMER_FOR_VOID } from "../../constants";
import { useAdvTestDataStore } from "../../storeAdv/advTestData";
const Progressbar = ({ id,no,loaded,handleScan}) => {
  const uiState = useUIStore()
  const { isHeatersButtonEnable, shouldDisplayId} = uiState;
  const sampleState = useSampleStore()
  const { scanningId } = sampleState
  const heaterState = useHeaterStore()
  const {advSerialNo} = useAdvTestDataStore()

  const {timerForSamplePos,activeTimer,setIncubationTimer,incubationTimer,begPopUp,begPopUpExpiry, addToBegPopUp} = useAdvTimerStore()
  const {setLoadNo,begSamples} = heaterState
  const { begSampleReadyForScan,setBegSampleReadyForScan } = sampleState;
  function handleScanChild() {
    handleScan(true,id)
  }

  useEffect(()=>{
    if(timerForSamplePos[id]){
      if(!timerForSamplePos[id].isPaused)
        setIncubationTimer(id,activeTimer-timerForSamplePos[id].timerInsertedAt)

      if(timerForSamplePos[id].heaterTimerEndsAt && timerForSamplePos[id].heaterTimerEndsAt-activeTimer<0 && !begSampleReadyForScan.includes(id)){
        setBegSampleReadyForScan([...begSampleReadyForScan,id])
        addToBegPopUp([...begPopUp,id])
      }
      if (begPopUpExpiry && begPopUpExpiry[id]<incubationTimer[id] && !begPopUp.includes(id))
      {
        addToBegPopUp([...begPopUp,id])
      }
    }
  },[activeTimer])

  const displayTimer = (timervar) => {
    let timer = secondsToTime(timervar);
    return (`${timer.m}:${timer.s}`)
  };

  const perc = Math.trunc((incubationTimer[id] /(ADV_TIMER_FOR_SCAN)) * 100);

  const handleHeater = (event) => {
    const { name } = event.target;
    setLoadNo(name)
  }
  return (<>
   <div style={loaded?{maxWidth:"18.75vw",minHeight:"4.26vh",backgroundColor:"rgb(210,255,222)"}:{maxWidth:"18.75vw",minHeight:"4.26vh"}}
    className={`relative w-[18.75vw] pheight flex items-center rounded-[40px]
    ${id && shouldDisplayId? `bg-[rgb(210,255,222)] hover:!bg-[#24B34B]` : "bg-[#d3d3d3]"}
     ${incubationTimer[id]>ADV_TIMER_FOR_VOID+ADV_TIMER_FOR_SCAN  && shouldDisplayId? "!bg-[#DF7E7E] text-white hover:!bg-[#D94444]" :shouldDisplayId && begSampleReadyForScan.includes(id) ? "!bg-[#F4DA9C] hover:!bg-[#F9C241]" : ""}`}>

    {!id ?
    <Button  className="heaterButton !leading-[0] !px-[1.25vw] !m-[0] !py-[0]" disabled={!isHeatersButtonEnable} onClick={handleHeater} name={no} style={loaded?{maxWidth:"18.75vw",minHeight:"4.26vh",backgroundColor:"rgb(210,255,222)",minWidth:"18.75vw"}:{maxWidth:"18.75vw",minHeight:"4.26vh",minWidth:"18.75vw"}}>
      {}
    </Button>
    :!shouldDisplayId && scanningId===id ?
    <Button  className="heaterButton !leading-[0] !px-[1.25vw] !m-[0] !py-[0]"
    disabled={!isHeatersButtonEnable} onClick={handleHeater} name={no} style={{maxWidth:"18.75vw",minHeight:"4.26vh",minWidth:"18.75vw"}}>
    {}
  </Button>:<>
    <Button id="up1" className={`absolute !px-[1.19vw] !py-[0px] top-[0px] right-[0px] m-[0px] !flex justify-between  items-center  ${id ? ` hover:!bg-[#24B34B]` : ""}  ${incubationTimer[id]>ADV_TIMER_FOR_VOID+ADV_TIMER_FOR_SCAN ? "text-white hover:!bg-[#D94444]" : begSampleReadyForScan.includes(id) ? " hover:!bg-[#F9C241]" : ""}`}
    onClick={()=>handleScanChild()} disabled={id?false:true} style={{width:"18.75vw",minHeight:"4.27vh",zIndex: "100",borderRadius: "40px",backgroundColor:"transparent"}} >
       <div>{advSerialNo[id]?'SN '+advSerialNo[id]:begSamples[id]}</div>
     <div>{timerForSamplePos[id]  ? displayTimer(incubationTimer[id]) : null} </div>
    </Button>
   {incubationTimer[id]<=ADV_TIMER_FOR_SCAN &&  <div style={{width: `${perc}%`,maxWidth:"18.75vw"}} className={`absolute bg-[#24B34B] top:0 left:0 ${perc < 10 ? "rounded-l-[40px]" : "rounded-[40px]"} ${Number.isNaN(perc) || perc < 5 ? "hidden" : "block"}  h-full `}/>}
    <div id="up1" onClick={()=>handleScanChild()} className="flex justify-between w-[18.75vw] px-[1.25vw] absolute">

    </div>
    </>}
  </div>
  </>
  )
};

export default Progressbar;
