import { useAdvHeaterStore } from "../storeAdv/advHeater"
import { useAdvSampleStore } from "../storeAdv/advSample"
import { useAdvSampleTimerStore } from "../storeAdv/advSampleTimer"
import { useAdvTestDataStore } from "../storeAdv/advTestData"
import { useAdvTimerStore } from "../storeAdv/advTimers"
import { useAdvUiStore } from "../storeAdv/advUi"
import { useDashboardUiStore } from "../storeDashboard/dashboardUi"
import { useEffect } from "react"

  // {
  
    //     isAdvSampleScreen:false,
    //     isIFUscreen:false,
    //     iFUscreenFor:"",
    //     isAdvScanning:false,
    //     hasAdvSamplePreparationStarted,
    //       isAdvQRcode,
    //       isDirectResultCapture,
    //       isCancelMsgModal,
    //       cancelMsgFor,
    //       isDetected,
    //       commentMsg,
    //       finalDataToApi
      
          
    //   }



function AllStatetoJson(){
   
    const {AdvHeater,HeaterId,allHeaters} = useAdvHeaterStore()
    const {advSamples,advSampleCompletedStep,advSamplesPos,samples,samplesReadyForCapture} = useAdvSampleStore()
    const {AdvSampleTimerPos} = useAdvSampleTimerStore()
    const {advSamplePrepKit,advTestID,advSampleID} = useAdvTestDataStore()
    const {timerForSamplePos,incubationTimer} = useAdvTimerStore()
    const {isLogin} = useDashboardUiStore()
    useEffect(() => {
        
        const interval = setInterval(console.log("hw"), 1000);
        
        return () => {
            clearInterval(interval)
        }
    }, )
    var LoginData = {
        isLogin : isLogin
    }
    var AdvData = {
        isLogin:isLogin,
        useAdvHeaterStoreData:{
            AdvHeater:AdvHeater,
            HeaterId:HeaterId,
            allHeaters:allHeaters,

        },
        useAdvSampleStoreData:{
            advSamples:advSamples,
            advSampleCompletedStep:advSampleCompletedStep,
            advSamplesPos:advSamplesPos,
            samples:samples,
            samplesReadyForCapture:samplesReadyForCapture
        },
        useAdvSampleTimerStoreData:{
            AdvSampleTimerPos:AdvSampleTimerPos
        },
        useAdvTestDataStoreData:{
            advSamplePrepKit : advSamplePrepKit ,
            advTestID : advTestID ,
            advSampleID : advSampleID ,
        },
        useAdvTimerStoreData:{
            timerForSamplePos:timerForSamplePos,
            incubationTimer:incubationTimer
        }


         
    }    
   

}


export default AllStatetoJson


