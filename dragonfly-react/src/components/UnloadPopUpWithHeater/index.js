
import { Modal, Button } from "semantic-ui-react";
import SingleHeaterForUnloadPopUp from "./SingleHeaterForUnloadPopUp";
import useSound from 'use-sound';
import beep_alarm_25min_alarm_repeat from "../../Sounds/beep_alarm_25min_alarm_repeat.mp3"
import { useEffect, useState } from "react";
import { useAdvTestDataStore } from '../../storeAdv/advTestData';

export default function UnloadPopUpWithHeater({ id, sampleNo, pos, closeModal, heaterNo, confirmPopUp, isIncubationLimitExceded, handleScan = () => { }, disableSound = false, pauseTimer }) {
  // const [isPlaying, setIsplaying] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(0.75)
  const { advSerialNo } = useAdvTestDataStore()
  const [play, { stop }] = useSound(beep_alarm_25min_alarm_repeat, {
    playbackRate,
    // `interrupt` ensures that if the sound starts again before it's
    // ended, it will truncate it. Otherwise, the sound can overlap.
    interrupt: true,
  });
  //const [isHeaterPopupBg, setIsHeaterPopUpBg] = useState(true)

  useEffect(
    () => {
      //if (!disableSound) {
        play()
      //}
      return () => {
        // if (!disableSound) {
        stop()
        // }
      }
    }
  );

  //old code below
  // const handleCloseModal = () => {
  //   setIsHeaterPopUpBg(false)
  //   setIsplaying(false)
  //   stop()
  //   closeModal(id, true)
  // }

  const handleConfirm = () => {
    // setIsHeaterPopUpBg(false)
    // setIsplaying(false)
    stop()
    confirmPopUp(true)
    handleScan(true)
    pauseTimer()
  }
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
      <div className="flex w-full h-full" style={{ paddingTop: "20px" }}>
        <div className="h-full w-[50%]">
          <div className="font-extrabold text-[2.78vh]" style={{ lineHeight: "1.5em" }}>
            Test incubation is complete.<br />Please unload test panel from:<br /> Heat Block <span style={{ textTransform: "uppercase" }}>{heaterNo}{pos}</span><br /><b>ID {id}<br />{(advSerialNo[sampleNo] != null && advSerialNo[sampleNo].length>0) ? "SN " + advSerialNo[sampleNo] : ""}</b><br />
            <div className="mt-[5.56vh]">IMPORTANT: Remove and allow to cool 1 minute, then read result.</div>
          </div>
        </div>
        <div className="h-full w-[50%]">
          <SingleHeaterForUnloadPopUp id={(advSerialNo[sampleNo] != null && advSerialNo[sampleNo].length>0) ? "SN " + advSerialNo[sampleNo] : id} pos={pos} hName={heaterNo} />
        </div>
      </div>
      <Modal.Actions className="!border-[0px] ">
        {/* {!isIncubationLimitExceded ?<Button className="backbtn confirmBtn m-0 modalBtnLeft !w-[11.97vw] !h-[5.04vh]" onClick={handleCloseModal}>
           +5min

           </Button> : */}
        {/* } */}
        <Button
          className="confirmBtn modalBtnLeft !w-[11.97vw] !h-[5.04vh] "
          onClick={closeModal}
        >Close</Button>
        <Button
          className="confirmBtn modalBtnRight !w-[11.97vw] !h-[5.04vh] "
          onClick={handleConfirm}
        >Unload</Button>
      </Modal.Actions>
    </Modal>

  </>
  );
}
