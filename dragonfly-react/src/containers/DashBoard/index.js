import React, { useState, useEffect } from 'react'
import { useDashboardUiStore } from '../../storeDashboard/dashboardUi'
import OrgDashboard from '../../DashBoradComponents/dashboard-manager/org-admin/OrgDashboard'
// import ProtondxDashboard from '../../DashBoradComponents/dashboard-manager/protondx-admin/ProtondxDashboard'
// import OrgList from '../../DashBoradComponents/dashboard-manager/protondx-admin/OrgList'
import UserList from '../../DashBoradComponents/dashboard-manager/org-admin/UserList'
import { useAdvTimerStore } from '../../storeAdv/advTimers'
import { useHeaterStore } from "../../store/heaterStore"; //For guided mode
import {
  ADV_TIMER_FOR_SCAN
} from '../../constants'
import { Button, Modal } from 'semantic-ui-react'
import { useAdvUiStore } from '../../storeAdv/advUi'
import { useUIStore } from '../../store/ui'
import { useDashboard } from '../../store/dashboard'
import useSound from 'use-sound'
import beep_alarm_25min_alarm_repeat from "../../Sounds/beep_alarm_25min_alarm_repeat.mp3"
import { useSampleStore } from "../../store/samples";

const MODES = {
  GUIDED: "Guided",
  ADVANCED: "Advanced"
}
//Getting timers status here
export default function Dashboard() {
  const { isList, setIsList, testCompleteModalViewed, setTestCompleteModalViewed } = useDashboardUiStore()
  const {
    timerForSamplePos,
    incubationTimer,
    activeTimer
  } = useAdvTimerStore()
  const { setIsDashboard } = useDashboard()
  const { setIsAdvSampleScreen } = useAdvUiStore()
  const { setHasCaptureSampleScreen, openScanner } = useUIStore()
  const sampleState = useSampleStore()
  const { setScanningId,samplePos, setScanningIdPos } = sampleState

  const { begSamples } = useHeaterStore()
  //const [openModal, setOpenModal] = useState(false)
  const [selectedMode, setSelectedMode] = useState("")
  const [isPlaying,setIsplaying] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(0.75);
  const [play,{stop}] = useSound(beep_alarm_25min_alarm_repeat, {
    playbackRate,
    interrupt: true,
  });
  //Handle all timers here
  useEffect(() => {
    var guidedsamplearray = []
    let key = null
    let val = null
    for (key in begSamples) {
      if (begSamples.hasOwnProperty(key)) {
        val = begSamples[key]
        guidedsamplearray.push(key)
      }
    }

    //Handled Advanced Timer
    for (key in incubationTimer) {
      if (incubationTimer.hasOwnProperty(key)) {
        // val = incubationTimer[key]
        if (guidedsamplearray.includes(key)) { //Guided
          if ((activeTimer - timerForSamplePos[key].timerInsertedAt) > ADV_TIMER_FOR_SCAN) {
            // console.log("Unload in guided") //Need to show pop up here
            setSelectedMode(MODES.GUIDED)
            setScanningId(key)
            setScanningIdPos(samplePos[key])
            if(!testCompleteModalViewed){
              setIsplaying(true)
              play()
            }
            break
          }
        } else { //advanced
          if ((activeTimer - timerForSamplePos[key].timerInsertedAt) > ADV_TIMER_FOR_SCAN) {
            // console.log("Unload in advanced") //Need to show pop up here
            setSelectedMode(MODES.ADVANCED)
            if(!testCompleteModalViewed){
              setIsplaying(true)
              play()
            }
            break
          } //Forward to advanced screen
        }
      }
    }
  }, [activeTimer, begSamples, incubationTimer, timerForSamplePos])

  useEffect(() => {
    return () => setTestCompleteModalViewed(false)
  }, [setTestCompleteModalViewed])

  const goToRightScreen = () => {
    if (selectedMode === MODES.ADVANCED) {
      setIsAdvSampleScreen(true)
    }
    else{
      setIsAdvSampleScreen(false)
      openScanner(true)
      setHasCaptureSampleScreen(true)
    }
    setSelectedMode("")
    setIsDashboard(false)
    setTestCompleteModalViewed(false)
    setIsplaying(false)
    stop()
  }
  const handleClose = () => {
    setSelectedMode("")
    setTestCompleteModalViewed(true)
    setIsplaying(false)
    stop()
  }

  return (
    <>
      {
        (isList ? <UserList isList={isList} toogleTab={setIsList} />
          : <OrgDashboard isList={isList} toogleTab={setIsList} />)
      }
      <Modal
        open={selectedMode && !testCompleteModalViewed}
        className="!relative !w-[39.5vw] !h-[45.05vh] cancelModalBeg"
      >
        <div className="font-bold text-[2.5vh] max-w-2xl">
          Test incubation is complete. Please go to app in {selectedMode} mode
        </div>

        <Modal.Actions className="!border-[0px]">
          <Button
            className="confirmBtn modalBtnLeft !w-[11.97vw] !h-[5.04vh] "
            //  onClick={() => setSelectedMode("")}
            onClick={handleClose}
          >Close</Button>
          <Button
            className="confirmBtn modalBtnRight !w-[11.97vw] !h-[5.04vh] "
            //  onClick={() => setSelectedMode("")}
            onClick={goToRightScreen}
          >Proceed</Button>
        </Modal.Actions>

      </Modal>

      {/*
        pseudo code <br />
        isPhotonDashboardBridge? photon dashboard bridge <br />
          isUserList? userlist <br />
          isphotonDashboard ? photonDashboard  <br /> <br />
        isOrgDashBoardBridge ? org dashboard bridge <br />
        isUserList? userlist <br />
        isEditDetai? editDetail <br />
        isOrgDashBoard? orgDashboard <br /> */}

    </>
  );
}
