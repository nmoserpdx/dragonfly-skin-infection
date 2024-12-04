import React, { useEffect, useState } from 'react'
import Sections from './Sections'
import Sidebar from './Sidebar'
import { Button } from "semantic-ui-react"
import { useAdvUiStore } from '../storeAdv/advUi'
import AdvanceScreen from './AdvanceScreen'
import { useDashboard } from '../store/dashboard'
import Dashboard from './DashBoard'
import { useDispatch } from 'react-redux'
import {
    LOGIN_SUCCESS,
    LOGOUT
} from '../redux-store/types'
import { useAdvTimerStore } from '../storeAdv/advTimers'
import { useDashboardUiStore } from '../storeDashboard/dashboardUi'
import { useAdvSampleTimerStore } from '../storeAdv/advSampleTimer'
import { useAdvTestDataStore } from '../storeAdv/advTestData'
import { useAdvSampleStore } from '../storeAdv/advSample'
import { useAdvHeaterStore } from '../storeAdv/advHeater'
import { useHeaterStore } from '../store/heaterStore'
import { useUIStore } from '../store/ui'
import { useSampleStore } from '../store/samples'
import { usePrepareSampleStore } from '../store/prepareSampleTimers'
import { useTestDataStore } from '../store/testData'
import { usePreparationStore } from '../store/preparationSteps'
import { useConfigStore } from '../store/appconfiguration'
import { useSelector } from 'react-redux'
import TopBar from '../components/NavBar'
import { useTimer } from "react-use-precision-timer"
import axios from 'axios'
import IncubationProvider from '../context/incubationTimer'
import BarCodeScanner from '../components/BarCodeScanner/BarCodeScanner'
import Settings from '../components/Settings/'

function Main() {
    const [checked, setChecked] = useState(false)
    const { isLogin, setDashBoardUiStore } = useDashboardUiStore()
    //const { loginId, setLoginId } = useLoginStore()
    const { resetAdvTestDataState } = useAdvTestDataStore()
    const { resetAdvSampleTimerState, AdvSampleTimerPos, setAdvSampleTimerStore } = useAdvSampleTimerStore()
    const { resetAdvSampleState, samplesReadyForCapture } = useAdvSampleStore()
    const { advSamples, currentAdvSampleNo } = useAdvSampleStore()
    const { resetAdvUi, setIsDetected } = useAdvUiStore()
    const [dataset, setDatset] = useState()
    const { resetAdvHeaterState } = useAdvHeaterStore()
    const { updateActiveTimer, activeTimer, resetAdvTimerState } = useAdvTimerStore()

    //const [datass, setDatass] = useState()
    const { resetHeaterState, heater, setHeaterStore, begSamples } = useHeaterStore()
    const { resetUiState } = useUIStore()
    const { resetSampleState, samples, timeExceededSamples, voidSamples, timerMapper, samplePos, setSampleStore, scanningId, allowExpiry, setAllowExpiry, setActiveDemoMode } = useSampleStore()
    const { resetSampleTimerState } = usePrepareSampleStore()
    const { resetTestDataState } = useTestDataStore()
    const { resetPreparationState } = usePreparationStore()

    const { AdvHeater, HeaterId, allHeaters, setAdvHeaterStore } = useAdvHeaterStore()
    const { advSampleCompletedStep, advSamplesPos, setAdvSampleStore, samplesNo } = useAdvSampleStore()

    const { advSamplePrepKit, advTestPanelID, advSampleID, advLotNo, advSerialNo, setAdvTestDataStore } = useAdvTestDataStore()
    const { timerForSamplePos, incubationTimer, setAdvTimerStore } = useAdvTimerStore()
    const [twoMinuteTimer, setTwoMinuteTimer] = useState(0)
    const { sample_ids, test_panel_ids, setConfigStore } = useConfigStore()

    const dispatch = useDispatch()
    const {
        isAdvSampleScreen,
        setIsAdvSampleScreen,
    } = useAdvUiStore()
    const {
        isDashboard,
        setIsDashboard,
        OffResultSave,
        removeOffResultSave
    } = useDashboard()
    const { logIn, isBarCode, setIsBarCode, isBTactive, setisBTactive, isSettings, setIsSettings, setBluetoothDevices } = useDashboardUiStore()

    //old code below
    /*
    const resetUiStateOnly = () => {
        resetAdvUi()
        resetUiState()
        resetSampleTimerState()
    }
    */

    const handleResetAdvScreen = () => {
        resetAdvUi()
        resetAdvSampleState()
        resetAdvSampleTimerState()
        resetAdvHeaterState()
        resetAdvTimerState()
        resetAdvTestDataState()
    }
    const handleResetBeginnerScreen = () => {
        resetHeaterState()
        resetUiState()
        resetSampleState()
        resetSampleTimerState()
        resetTestDataState()
        resetPreparationState()
    }
    const handelLogout = () => {
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
        handleResetBeginnerScreen()
        handleResetAdvScreen()
        // resetUiStateOnly()
        if (window.NativeDevice) {
            window.NativeDevice.logoutCall()
        }
        localStorage.removeItem('userInfo') //Clearing at last
    }

    const storeLoginData = (data) => {
        dispatch({
            type: LOGIN_SUCCESS,
            payload: data
        })

        localStorage.setItem('userInfo', JSON.stringify(data))
        console.log(JSON.parse(localStorage.getItem('userInfo')), data)
    }
    // useAdvTestDataStoreData:{
    //     samplePrepKit:samplePrepKit,
    //     covidTestPanel:covidTestPanel,
    //     respiratoryTestPanel:respiratoryTestPanel,
    // },
    const { userInfo } = useSelector((state) => state.logIn)

    const [setting, setSetting] = useState(false)

    //old code below
    /*
    const handleSettings = () => {
        setSetting(!setting)
    }
    */

    const testingFn = () => {
      let data = '{"LoginData":{"isLogin":false},"LoginInfo":{"org_id":"627cdfa97903978a33ad9a74","permission_group":"ORG_ADMIN","auth0_user_id":"auth0|627cdfa929aee50069868e73","test_runs":82,"id":"627cdfa97903978a33ad9a75","name":"Determinant Studios","email":"anandbora@determinantstudios.com","mac_address":"4f6becafa4e396ba","auth0_access_token":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlNkRUtXVndxcnVSMVZUY0g5NzEzUSJ9.eyJuaWNrbmFtZSI6ImFuYW5kYm9yYSIsIm5hbWUiOiJEZXRlcm1pbmFudCBTdHVkaW9zIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyLzlmNmRmMDRhNTFhZGNkYjNiMWVjODViNDg4NmIzOWNiP3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGZHMucG5nIiwidXBkYXRlZF9hdCI6IjIwMjQtMDktMTZUMDc6MDU6MjcuOTYzWiIsImVtYWlsIjoiYW5hbmRib3JhQGRldGVybWluYW50c3R1ZGlvcy5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9wcm90b25keC5ldS5hdXRoMC5jb20vIiwiYXVkIjoiZko4V0dKb1BCVkVWM29mUnZLMFpYTFpTd09CTVYxV0MiLCJpYXQiOjE3MjY0NzAzMzMsImV4cCI6MTcyNjUwNjMzMywic3ViIjoiYXV0aDB8NjI3Y2RmYTkyOWFlZTUwMDY5ODY4ZTczIiwic2lkIjoiYlFKbGJHV25NekhLWlVOM3JIZjVfVUhSQlNLUjF5ZngiLCJub25jZSI6IlBCSnRzbG42Q3RmOWY4XzI5YTRMeldUZFFzNzNCTmpxSnBSNzJjdFVPV2cifQ.LqBGSzTbT6kW3kdEpKLZynIl66B1awPRe_YBGwvrYs9FbNKXdm5C6zyRmeik3FEAr2E9rGS8Xf0lYgAvweQm8D_qgh8IVKYFVEY63Agne50u3zaZgY3uUQ-nNPQYR4A6xTO9x0U0Dgg6AJeNGADH1lYJ49YCI1bXfSG8hWipYuuYQLUYb2IWNRIrLXJU85xxtIpZ-yCNJ5XO1jg48S8qy_SpqGhWl6pBQwtHV3IXTr97N3QOH5Afe4ZjSw6daDYm9SK-dxgMeXyY-vyGf_VyMVk9XcEhoUXDkJvqfUTu09ihWDeRew8hIjGc8LYoHQ0jiPFxlBWshD67TM-cB6WfPw","current_version":57},"AdvData":{"useAdvHeaterStoreData":{"AdvHeater":{"a":{"1":"","2":"","3":"","4":""}},"HeaterId":["a"],"allHeaters":[0]},"useAdvSampleStoreData":{"advSamples":{},"advSampleCompletedStep":{},"advSamplesPos":{},"samplesNo":[],"samplesReadyForCapture":[]},"useAdvSampleTimerStoreData":{"AdvSampleTimerPos":{}},"useAdvTestDataStoreData":{"advSamplePrepKit":{},"advTestPanelID":{},"advSampleID":{},"advLotNo":{},"advSerialNo":{}},"useAdvTimerStoreData":{"timerForSamplePos":{},"incubationTimer":{},"activeTimer":1726496427}},"BegData":{"useSampleStoreData":{"samples":[],"timerMapper":{},"voidSamples":[],"timeExceededSamples":{},"samplePos":{},"allowExpiry":false},"useHeaterStoreData":{"heater":{"1":"","2":"","3":"","4":""},"begSamples":{}}},"Mode":{"mode":false},"sample_testpanel_ids":{"sample_ids":["100006"],"test_panel_ids":[]}}';
      AllJsonToState(data);
    }

    useEffect(() => {
        updateActiveTimer(Math.floor(new Date().getTime() / 1000))

        window.addEventListener('offline', function (e) { console.log('offline'); });

        window.addEventListener('online', function (e) {
            if (OffResultSave.length > 0)
                submitDatasToApi()
        });

        window.setSaveJson = function (json) {
            AllJsonToState(json)
            return true
        }

        isAdvSampleScreen ? setChecked(true) : setChecked(false)

        //testingAPI()
        // testingFn()
    }, [])

    const handleSwitchUser = () => {
        if (window.NativeDevice) {
            window.NativeDevice.switchUser()
        }
    }

    if (window)
        window.setSaveJson = function (json) {
            AllJsonToState(json)
            return true
        }

    window.loginCall = function (json) {
        var data = JSON.parse(json)
        storeLoginData(data)
        logIn()
    }

    window.setBluetoothStatus = function (json) {
      var data = JSON.parse(json)
     if(data.status){
       setisBTactive(true)
       setBluetoothDevices(data)
       // localStorage.setItem('bt_deviceInfo', JSON.stringify(data))
      }else{
        setBluetoothDevices({})
        setisBTactive(false)
      }
    }

    function testingAPI() {
          axios({
              method: 'get',
              url: 'http://localhost:5000/api/v2/configuration',
              headers:{
                  'Content-Type':'application/json',
                  "X-AuthorityToken": "auth-wpf-desktop",
                  "X-AccessToken" : userInfo.auth0_access_token
              },
              params: {}
          }).then(function (response) {
              console.log(response.data.results.sample_ids)
              console.log(response.data.results.test_panel_ids)
          })
          .catch(function (error) {
              console.log(error)
          });
    }

    function submitDatasToApi() {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                "X-AuthorityToken": "auth-wpf-desktop",
                "X-AccessToken": userInfo.auth0_access_token
            }
        }

        OffResultSave.map((t) => {
            // console.log(t)
            axios.post(process.env.REACT_APP_SERVER_BASE_URL + '/addresult', t.data, config)
                .then(function (response) {
                    // console.log(response)
                    removeOffResultSave(t.testerId)
                })
                .catch(function (error) {
                    console.log(error)
                });
        })
    }
    const AllStatetoJson = () => {
        var LoginData = {
            isLogin: isLogin
        }
        var LoginInfo = userInfo
        var AdvData = {
            useAdvHeaterStoreData: {
                AdvHeater: AdvHeater,
                HeaterId: HeaterId,
                allHeaters: allHeaters,
            },
            useAdvSampleStoreData: {
                advSamples: advSamples,
                advSampleCompletedStep: advSampleCompletedStep,
                advSamplesPos: advSamplesPos,
                samplesNo: samplesNo,
                samplesReadyForCapture: samplesReadyForCapture
            },
            useAdvSampleTimerStoreData: {
                AdvSampleTimerPos: AdvSampleTimerPos,
            },
            useAdvTestDataStoreData: {
                advSamplePrepKit: advSamplePrepKit,
                advTestPanelID: advTestPanelID,
                advSampleID: advSampleID,
                advLotNo: advLotNo,
                advSerialNo: advSerialNo
            },
            useAdvTimerStoreData: {
                timerForSamplePos: timerForSamplePos,
                incubationTimer: incubationTimer,
                activeTimer: activeTimer
            }
        }

        var BegData = {
            useSampleStoreData: {
                samples: samples,
                timerMapper: timerMapper,
                voidSamples: voidSamples,
                timeExceededSamples: timeExceededSamples,
                samplePos: samplePos,
                allowExpiry: allowExpiry
            },
            useHeaterStoreData: {
                heater: heater,
                begSamples: begSamples
            }
        }

        var Mode = {
            mode: false
        }

        if (isAdvSampleScreen) {
            Mode.mode = true
        } else {
            Mode.mode = false
        }

        var Config = {
          sample_testpanel_ids: {
            sample_ids: sample_ids,
            test_panel_ids: test_panel_ids
          }
        }

        var Data = {
            LoginData,
            LoginInfo,
            AdvData,
            BegData,
            Mode,
            Config
        }
        setDatset(Data)

        //Setting demo mode here
        if(window.NativeDevice){
          if(window.NativeDevice.isDemoMode()){
            setActiveDemoMode(true);
          }else{
            setActiveDemoMode(false);
          }
        }

        //  console.log(JSON.stringify(Data))
        //  AllJsonToState(JSON.stringify(Data))
        return Data

    }
    // const handleall = () => {

    //     var data = AllStatetoJson()
    //     handelLogout()
    //     console.log(data)
    //     setTimeout(AllJsonToState(JSON.stringify(data)), 5000);


    // }

    const AllJsonToState = (json) => {
        // console.log(json)
        var data = JSON.parse(json)
        // var data = json
        if (data) {
            storeLoginData(data.LoginInfo)
            setDashBoardUiStore(data.LoginData)

            //setting sample and test panel data
            var sample_tp_obj = {}
            var sample_found = false
            if(data.sample_testpanel_ids.sample_ids.length == 0){
              sample_tp_obj.sample_ids = sample_ids //default
              sample_tp_obj.test_panel_ids = data.sample_testpanel_ids.test_panel_ids
              sample_found = true
            }
            if(data.sample_testpanel_ids.test_panel_ids.length == 0){
              sample_tp_obj.test_panel_ids = test_panel_ids //default
              if(sample_found = true){ //sample id is found
                sample_tp_obj.sample_ids = data.sample_testpanel_ids.sample_ids
              }
            }

            if(sample_found){
              setConfigStore(sample_tp_obj)
            }else{
              setConfigStore(data.sample_testpanel_ids)
            }

            setAdvHeaterStore(data.AdvData.useAdvHeaterStoreData)
            setAdvSampleTimerStore(data.AdvData.useAdvSampleTimerStoreData)
            setAdvTestDataStore(data.AdvData.useAdvTestDataStoreData)
            setAdvTimerStore(data.AdvData.useAdvTimerStoreData)
            setAdvSampleStore(data.AdvData.useAdvSampleStoreData)
            setHeaterStore(data.BegData.useHeaterStoreData)
            setSampleStore(data.BegData.useSampleStoreData)
            setIsAdvSampleScreen(data.Mode.mode)
            setIsDetected(false) //setting detected to false from background mode
        }
    }

    window.getSaveJson = function () {
        var data = AllStatetoJson()
        //console.log("window.getSaveJson",data)
        return data;
    }

    useEffect(() => {
        isAdvSampleScreen ? setChecked(true) : setChecked(false)
        AllStatetoJson()
    }, [isLogin, isAdvSampleScreen])

    useEffect(() => {

    }, [isLogin])

    const teimer = useTimer({ delay: 1000, callback: () => updatetime() });

    useEffect(() => {
        // const interval = setInterval(updatetime, 1000);
        teimer.start();
        // return () => {
        //     clearInterval(interval)
        // }
    }, [])

    function updatetime() {
        updateActiveTimer(Math.floor(new Date().getTime() / 1000))
        //Push a backup to Android every 2 minutes
        let time = twoMinuteTimer + 1
        if (time % 120 === 0) {
            //Call Android function here to handle any crashes
            var data = AllStatetoJson()
            if (window.NativeDevice) {
                window.NativeDevice.backupState(JSON.stringify(data))
            }
            setTwoMinuteTimer(0)
        }
        setTwoMinuteTimer(time)
    }

    const handleAdvScreen = (value) => {
        setIsDashboard(false)
        setIsAdvSampleScreen(true)
    }

    const handleDashBoard = () => {
        // setIsProtonDashboardBridge()
        setIsDashboard(!isDashboard)
    }

    //old code below
    /*
    const handleLoginType = () => {
        setIsOrgLogin(!isOrgLogin)
    }
    */
    const handleBeginner = () => {
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
    }
    //old code below
    /*
    const handleSwitchScreen = () => {
        if ((Object.keys(advSamples).length === samplesReadyForCapture.length) && (samples.length === voidSamples.length)) {
            setChecked(!checked)
            setIsDashboard(false)
            setIsAdvSampleScreen(!isAdvSampleScreen)
        }
        else
            alert("some sample preperation not finished yet")
    }
    */
    // const handleBack = () =>{


    //     updateDashboardMapper("")

    // }
    // const handleDashboardButton = (name)=> {

    //     updateDashboardMapper(name)
    // }

    const handleBarCodeScanner = () => {
        setIsDashboard(false);
        setIsBarCode(true);
    };

    const handleSettings = () => {
        setIsDashboard(false);
        setIsBarCode(false);
        setIsSettings(true);
    };

    return (
        <IncubationProvider
            incubationTimeForCurrentSample={
                incubationTimer[isAdvSampleScreen ? currentAdvSampleNo : scanningId]
            }
        >

            {/* {msg1} {msg}
        {console.log(OffResultSave)} */}

            {/* {userInfo?userInfo.name:""} */}
            {/* <div
                className="h-[6.95vh] topBar absolute top-[0] left-[0]"
                style={{ width: "100%" }}
            >
                <TopBar
                    handleSwitchUser={handleSwitchUser}
                    handleBeginner={handleBeginner}
                    handleDashBoard={handleDashBoard}
                    handleAdvScreen={handleAdvScreen}
                    handelLogout={handelLogout}
                    handleBarCodeScanner={handleBarCodeScanner}
                    handleSettings={handleSettings}
                />
            </div> */}

            {isBarCode ? (
                <BarCodeScanner
                    handleClose={() => {
                        setIsBarCode(false)
                    }}
                />
            ) : ""
            }

            {isSettings && !isBarCode && !isDashboard ? (
                <Settings
                    handleBarCodeScanner={handleBarCodeScanner}
                    handleCloseBtn={() => {
                        setIsSettings(false)
                    }}
                />
            ) : ""
            }

            {true ? (
                <div className="main" style={{ height: "100%", width: "100%" }}>
                    {/* {!isLogin && <Login />} */}
                    {true && isDashboard && <Dashboard />}
                    {/* {true && isDashboard &&
          ( !dashboardMapper?<>
             <Button name="userlist" onClick={(event)=>handleDashboardButton(event.target.name)}>list</Button>
             <Button name="org"  onClick={(event)=>handleDashboardButton(event.target.name)} >org</Button></>:
             <>
             <DashboardComponent component={dashboardMapper}  />
             <Button onClick={handleBack} >back</Button>
             </>
             )
        } */}
                    {true && !isDashboard && !isBarCode && !isSettings && (
                        <>
                            {isAdvSampleScreen ? (
                                <div
                                    style={{
                                        flexDirection: "column",
                                        height: "100%",
                                        width: "100%",
                                    }}
                                >
                                    <AdvanceScreen />
                                </div>
                            ) : (
                                <>
                                    <Sections />
                                    <Sidebar />
                                </>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <div className="container">
                    <h1>
                        Not found <span>:(</span>
                    </h1>
                    <p>Sorry,userInfo does not exist.</p>
                    <Button onClick={() => logIn()}> Force Login </Button>
                    <i>404</i>
                    {userInfo}
                </div>
            )}
        </IncubationProvider>
    );
}

export default React.memo(Main)

// {/* {isAdvSampleScreen && <AdvanceScreen /> }
// {isDashboard && <Dashboard />}
// {!isAdvSampleScreen && !isDashboard &&  <>
//     <Sections/>
//     <Sidebar/>
//     </>} */}
