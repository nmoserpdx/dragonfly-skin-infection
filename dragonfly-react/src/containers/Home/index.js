import React, { useEffect, useState, useCallback, memo } from 'react'
import { MemoryRouter, Route, Switch } from "react-router"
import Main from "../Main"
import TopBar from '../../components/NavBar'
import { useDashboard } from '../../store/dashboard'
import { useHeaterStore } from '../../store/heaterStore'
import { useAdvSampleStore } from '../../storeAdv/advSample'
import { useAdvUiStore } from '../../storeAdv/advUi'
import { useDispatch } from 'react-redux'
import {
    LOGIN_SUCCESS,
    LOGOUT
} from '../../redux-store/types'
import { useUIStore } from '../../store/ui'
import { useSampleStore } from '../../store/samples'
import { usePrepareSampleStore } from '../../store/prepareSampleTimers'
import { useTestDataStore } from '../../store/testData'
import { usePreparationStore } from '../../store/preparationSteps'
import { useAdvSampleTimerStore } from '../../storeAdv/advSampleTimer'
import { useAdvHeaterStore } from '../../storeAdv/advHeater'
import { useAdvTimerStore } from '../../storeAdv/advTimers'
import { useAdvTestDataStore } from '../../storeAdv/advTestData'
import { useDashboardUiStore } from '../../storeDashboard/dashboardUi'
// import TimerFn from "../Timer/TimerFn"

const Home = () => {
    const {
        isDashboard,
        setIsDashboard
    } = useDashboard()
    const { resetHeaterState, heater, setHeaterStore, begSamples } = useHeaterStore()
    const { advSamples, currentAdvSampleNo, resetAdvSampleState } = useAdvSampleStore()
    const {
        isAdvSampleScreen,
        setIsAdvSampleScreen,
    } = useAdvUiStore()
    const dispatch = useDispatch()
    const [setting, setSetting] = useState(false)
    const { resetUiState } = useUIStore()
    const { resetSampleState } = useSampleStore()
    const { resetSampleTimerState } = usePrepareSampleStore()
    const { resetTestDataState } = useTestDataStore()
    const { resetPreparationState } = usePreparationStore()
    const { resetAdvUi } = useAdvUiStore()
    const { resetAdvSampleTimerState } = useAdvSampleTimerStore()
    const { resetAdvHeaterState } = useAdvHeaterStore()
    const { resetAdvTimerState } = useAdvTimerStore()
    const { resetAdvTestDataState } = useAdvTestDataStore()
    const { isBarCode, setIsBarCode, isBTactive, setisBTactive, isSettings, setIsSettings } = useDashboardUiStore()

    const handleDashBoardEvt = useCallback(() => {
        // setIsProtonDashboardBridge()
        setIsDashboard(!isDashboard)
    }, []);
    const handleAdvScreenEvt = useCallback((value) => {
        setIsDashboard(false)
        setIsAdvSampleScreen(true)
    }, []);
    const handleBeginnerEvt = useCallback((value) => {
        setIsDashboard(false)
        let InGuidedMode = (Object.keys(begSamples).length > 0) ? true : false
        let InAdvanceMode = (Object.keys(advSamples).length > 0) ? true : false
        // if(!InGuidedMode && !InAdvanceMode){ //both true
        //   //dont set anything and return
        //   return
        // }
        if (InAdvanceMode) {
            setIsAdvSampleScreen(true)
            return
        }
        if (InGuidedMode) {
            setIsAdvSampleScreen(false)
            return
        }
        setIsAdvSampleScreen(false)
    }, []);
    const handelLogoutEvt = useCallback((value) => {
        //   var data = AllStatetoJson()
        //   console.log(data)
        //   setTimeout(function(){ AllJsonToState(JSON.stringify(data)) }, 3000);
        dispatch({
            type: LOGOUT
        })
        //   logOut()
        setSetting(!setting)
        setIsDashboard(false)
        setIsAdvSampleScreen(false)
        handleResetBeginnerScreenEvt()
        handleResetAdvScreenEvt()
        // resetUiStateOnly()
        if (window.NativeDevice) {
            window.NativeDevice.logoutCall()
        }
        localStorage.removeItem('userInfo') //Clearing at last
    }, []);
    const handleResetBeginnerScreenEvt = () => {
        resetHeaterState()
        resetUiState()
        resetSampleState()
        resetSampleTimerState()
        resetTestDataState()
        resetPreparationState()
    }
    const handleResetAdvScreenEvt = () => {
        resetAdvUi()
        resetAdvSampleState()
        resetAdvSampleTimerState()
        resetAdvHeaterState()
        resetAdvTimerState()
        resetAdvTestDataState()
    }

    const handleBarCodeScannerEvt = useCallback((value) => {
        setIsDashboard(false);
        setIsBarCode(true);
    }, []);

    const handleSettingsEvt = useCallback((value) => {
        setIsDashboard(false);
        setIsBarCode(false);
        setIsSettings(true);
    }, []);

    return (
        <MemoryRouter>
            <Switch>
                <Route path="/">
                    {/* <Header /> */}
                    {/* <AdvanceScreen /> */}
                    <div
                        className="h-[6.95vh] topBar absolute top-[0] left-[0]"
                        style={{ width: "100%" }}
                    >
                        <TopBar
                          handleBeginner={handleBeginnerEvt}
                          handleDashBoard={handleDashBoardEvt}
                          handleAdvScreen={handleAdvScreenEvt}
                          handelLogout={handelLogoutEvt}
                          handleBarCodeScanner={handleBarCodeScannerEvt}
                          handleSettings={handleSettingsEvt}
                        />
                    </div>
                    <Main />
                </Route>
            </Switch>
        </MemoryRouter>
    )
}

export default memo(Home)
