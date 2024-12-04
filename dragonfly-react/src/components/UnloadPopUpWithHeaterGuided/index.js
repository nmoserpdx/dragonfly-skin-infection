import { Modal,Button } from "semantic-ui-react";
import { useEffect, useState } from "react";
import SingleHeaterForUnloadPopUp from "./SingleHeaterForUnloadPopUp";
import useSound from 'use-sound';
import beep_alarm_25min_alarm_repeat from "../../Sounds/beep_alarm_25min_alarm_repeat.mp3"
// import { useUIStore } from "../../store/ui"
import { useHeaterStore } from "../../store/heaterStore";
import { useAdvTestDataStore } from '../../storeAdv/advTestData';
export default function UnloadPopUpWithHeaterGuided({id,pos,closeModal,heaterNo,confirmPopUp, setScanningId}) {
  // const uiState = useUIStore();
  const heaterState = useHeaterStore()
  // const [isPlaying,setIsplaying] = useState(true)
  const {advSerialNo} = useAdvTestDataStore()
  const [playbackRate, setPlaybackRate] = useState(0.75);
  const [play,{stop}] = useSound(beep_alarm_25min_alarm_repeat, {
    playbackRate,
    // `interrupt` ensures that if the sound starts again before it's
    // ended, it will truncate it. Otherwise, the sound can overlap.
    interrupt: true,
  });

  const {begSamples} = heaterState
  // const [isHeaterPopupBg,setIsHeaterPopUpBg] = useState(true)
  const handleHeater = () => {
    //Need to check difference if basic or advanced mode
    // setHasCaptureSampleScreen(true)
    // setLoadNo(heaterNo)
    //setIsHeaterPopUpBg(false)
    // setIsplaying(false)
    stop()
    setScanningId(true, id)
    closeModal(begSamples[id],true)
    // setHeater(name,currentSample.id)
  }
  const handleCloseModal = () => {
    //setIsHeaterPopUpBg(false)
    // setIsplaying(false)
    stop()
   closeModal(id,true)
  }
  useEffect(
    () => {
    //  if(isHeaterPopupBg){
        play()
    //  }
      return () => {
      //  if(!isHeaterPopupBg){
          stop()
    //    }
      }
    }
  );

  // useEffect(
  //   () => {

  //     let timer1 = setTimeout(() => setIsplaying(false), 1000);

  //     // this will clear Timeout
  //     // when component unmount like in willComponentUnmount
  //     // and show will not change to true
  //     return () => {
  //       clearTimeout(timer1);
  //     };


  //   },[isPlaying]
  // );
  return (<>
    <Modal
    open={true}
    className="!relative !w-[67.86vw] !h-[65.12vh] py-[5.21vh] px-[4.166vw] "
    >
        <div className="flex w-full h-full"  style={{paddingTop: "20px"}}>
            <div className="h-full w-[50%]">
            <div className="font-extrabold text-[2.78vh]" style={{lineHeight:"1.5em"}}>
            Test incubation is complete.<br/>Please unload test panel from:<br/> Heat Block A{pos}<br/><b>ID {begSamples[id]}<br/>SN {advSerialNo[id]}</b><br/>
            <div className="mt-[5.56vh]">IMPORTANT: Remove and allow to cool 1 minute, then read result.</div>
            </div>
            </div>
            <div className="h-full w-[50%]">
                <SingleHeaterForUnloadPopUp id={(advSerialNo[id]!=null) ? "SN " + advSerialNo[id] : begSamples[id]} pos={pos} hName={heaterNo}/>
            </div>

        </div>
    {/* <Button onClick={()=>setIsplaying(!isPlaying)}>play {`${isPlaying}`}</Button> */}
      <Modal.Actions className="!border-[0px] ">

           <Button className="backbtn confirmBtn m-0 modalBtnLeft !w-[11.97vw] !h-[5.04vh]" onClick={handleCloseModal}>
           Close
           </Button>


        <Button
          className="confirmBtn modalBtnRight !w-[11.97vw] !h-[5.04vh] "
          onClick={handleHeater}



        >Unload</Button>
      </Modal.Actions>
    </Modal>

    </>
  );
}
