import { memo, useEffect, useState } from "react";
import { useSelector } from 'react-redux'
import { Button } from "semantic-ui-react";
import { instructions } from "../../logic/instructions";
import { usePreparationStore } from "../../store/preparationSteps";
import { useUIStore } from "../../store/ui";
import { useSampleStore } from "../../store/samples";
import Instructions from "../../components/Instructions";
import { Dummy_Token } from "../../constants";
//import CompletedSamplesToasts from "../../components/CompletedSamplesToasts";
import ScanSample from "../ScanSample";
import PrepareSampleStep from "../../components/PrepareSampleStep";
import { usePrepareSampleStore } from "../../store/prepareSampleTimers";
//import Heater from "../../components/Heater";
import { useHeaterStore } from "../../store/heaterStore";
import { useAdvTimerStore } from "../../storeAdv/advTimers";
import ResultCaptureScreen from "../ResultCaptureScreen";
import { useAdvTestDataStore } from "../../storeAdv/advTestData";
import { useTestDataStore } from "../../store/testData";
import shortid from "shortid";
import axios from 'axios'
import ErrorPopUp from "../../components/ErrorPopUp";
import { checkForExpiryHelper, checkForExpiryYYMMDDHelper } from "../../helpers";

const PrepareSample = () => {
    //const videoRef = useRef(null)
    //const [isVideoPlaying, setIsVideoPlaying] = useState(false)
    const state = usePreparationStore()
    const {
        activeStep,
        completedSteps,
        setPlaybackTimes,
        setVideoPlaybackPointer,
        setCompletedSteps,
        setActiveStep,
        resetPreparationState
    } = state;

    const HeaterS = useHeaterStore()
    const [heaterNo,setHeaterNo] = useState("")
    const {
        heater,
        setHeater ,
        loadNo,
        setLoadNo,
        setBegSamples,
        resetLoadState
    } = HeaterS

    const uiState = useUIStore();
    const { resetUiState, setErrorPopUp,errorPopUp,isScanning, openScanner,setIsHeatersButtonEnable,hasCaptureSampleScreen,    setSamplePreparationStarted,setStartProcessForSamplePreparation } = uiState;
    const sampleState = useSampleStore()
    const { setScanningId } = sampleState;
    const { samples,setSamplePos, currentSample, setSamples, setCurrentSample } = sampleState;
    const {setTimerForSamplePos,activeTimer,setIncubationTimer}= useAdvTimerStore()
    const [timerKey, updateTimer] = useState(0);
    const testDataState = useTestDataStore()
    const [bgBackColour, setBgBackColour] = useState("#efefef")
    const [bgErrorColour, setBgErrorColour] = useState("#efefef")
    const [bgConfirmColour, setBgConfirmColour] = useState("#a7e1b7")
    const { userInfo } = useSelector(state => state.logIn)
    const {
        samplePrepKit,
        TestPanel,
        serialNo,
        lotNo,
        resetTestDataState,
        prepKitExpirydate,
        testPanelExpirydate
    } = testDataState;
    const {
        resetSampleTimerState
    } = usePrepareSampleStore()
    const {setAdvTestPanelID,setAdvSamplePrepKit,setAdvSerialNo, setAdvLotNo, setAdvPrepKitExpDate, setAdvTestPanelExpDate} = useAdvTestDataStore()
    useEffect(() => {
        //
        setHeaterNo(parseInt(loadNo)+1)
        setPlaybackTimes(instructions.steps[activeStep].steps.length - 1)
    }, [setPlaybackTimes, activeStep,loadNo])

    //Old code below
    //const handleVideoEnd = () => setIsVideoPlaying(true);
    const handleOpenScanner = (value,id) => {
        openScanner(value)
        setScanningId(id)
    }
    //old code below
    /*
    const handleResultCaptureScreen = (value,id) => {
        setHasCaptureSampleScreen(true)
    }
    */
    const insertTimerInCurrentSample = (id) =>{
         setTimerForSamplePos(id,'timerInsertedAt',activeTimer);
         setIncubationTimer(id,0)
    }
    const setSampleInAdvState = () => {

    }
    const handleNextVideo = (event) => {
        //const { name } = event.target;

        updateTimer(prev => prev + 1)
        setVideoPlaybackPointer(instructions.steps[activeStep].steps.length)
        setActiveStep(activeStep + 1)
        setCompletedSteps([
            ...completedSteps,
            activeStep + 1
        ])
        if (activeStep === instructions.steps.length - 3) {
            // setLoadNo(null)

            setIsHeatersButtonEnable(true)
         }

        if (activeStep === instructions.steps.length - 2) {
            var uid = shortid.generate()

        //    setHeater(loadNo,currentSample.id,1)
        insertTimerInCurrentSample(uid)
        setHeater(loadNo,uid)
        setBegSamples(uid,currentSample.id)

        setIsHeatersButtonEnable(false)
           setSamples([
            ...samples,
            {id:uid}
        ])
        setAdvSamplePrepKit(uid,samplePrepKit)
        setAdvSerialNo(uid,serialNo)
        setAdvTestPanelID(uid,TestPanel)
        setAdvLotNo(uid, lotNo)
        setSamplePos(uid,loadNo)
        setAdvPrepKitExpDate(uid,prepKitExpirydate)
        setAdvTestPanelExpDate(uid,testPanelExpirydate)
        setLoadNo(null)
        setSampleInAdvState()
        resetSampleTimerState()
        // insertTimerInCurrentSample()
        // setHeater(loadNo,currentSample.id,1)
        setCurrentSample({})
        resetTestDataState()
        resetPreparationState()
        resetUiState()

        }

        //    if (activeStep === instructions.steps.length - 1) {
        //     setSamples([
        //         ...samples,
        //         currentSample
        //     ])
        //     setLoadNo(null)
        //     resetPrepareSampleStoreState()
        //     // insertTimerInCurrentSample()
        //     // setHeater(loadNo,currentSample.id,1)
        //     setCurrentSample({})
        //     resetPreparationState()
        //     resetUiState()
        // }
    }
    const handlePrevVideo = () => {
        if(activeStep===0){
            // setCurrentSample({})

            // resetTestDataState()
        resetPreparationState()
        resetUiState()
        setSamplePreparationStarted(true)
        setStartProcessForSamplePreparation(false)


            openScanner()

        }else{
        updateTimer(prev => prev - 1)

        setVideoPlaybackPointer(instructions.steps[activeStep - 1].steps.length)
        setActiveStep(activeStep - 1)
        const newSteps = [...completedSteps];
        newSteps.pop()

        setCompletedSteps(newSteps)

        if (activeStep === instructions.steps.length - 2) {
            setLoadNo(null)

            setIsHeatersButtonEnable(false)
         }

        }
    }
    const submitErrorToApi = () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'X-AuthorityToken': 'auth-wpf-desktop',
          'X-AccessToken': userInfo
            ? userInfo.auth0_user_id
            : Dummy_Token,
        },
      }
      const stepsTimerData = {
        lysistime: 0,
        washtime: 0,
        drytime: 0,
        elutetime: 0,
      }
      const timerData = {
        totalelapsedtime: 'null',
        heatingtime: 0,
      }
      const loactionData = {
        long: '',
        lat: '',
      }
      let prepkitexpired = checkForExpiryYYMMDDHelper(prepKitExpirydate);
      let testpanelexpired = checkForExpiryHelper(testPanelExpirydate);
      const data = {
        id: userInfo ? userInfo.id : '',
        mac_address: userInfo ? userInfo.mac_address : '',
        user_name: userInfo ? userInfo.name : '',
        org_id: userInfo ? userInfo.org_id : '',
        heaterchosen: 'A',
        user_id: userInfo ? userInfo.id : '',
        testerId:
          typeof TestPanel != 'undefined'
            ? TestPanel
            : shortid.generate(),
        serialNo: serialNo,
        sampleID: currentSample.id,
        prepKitID: samplePrepKit,
        lotNo: lotNo,
        result: '0,0,0,0,0,0,0,0',
        invalid: true,
        image: "",
        loaction: loactionData,
        comments: "User stopped the test in between at step : " + activeStep,
        error: true,
        uploadtime: "",
        mode: "guided",
        flag: false,
        heatingexpired: false,
        prepkitexpired: prepkitexpired,
        testpanelexpired: testpanelexpired,
        ...stepsTimerData,
        ...timerData,
      }
      // https://reqres.in/api/users
      // https://api.anuparamanu.xyz/api/v1/results
      axios
        .post(process.env.REACT_APP_SERVER_BASE_URL + '/addresult', data, config)
        .then(response => console.log(response))
        .catch(function (error) {
          if (error.toJSON().message === 'Network Error') {
            console.log('Network error happend')
          }
          console.log(JSON.stringify({ data, config }))

          if (window.NativeDevice) {
            window.NativeDevice.insertDataToDb(
              JSON.stringify({ data, config })
            )
          }
        })
    }
    const handleEndTest = () => {
        submitErrorToApi()
        resetTestDataState()
        resetPreparationState()
        resetUiState()
        resetLoadState()
        resetSampleTimerState()
    }
    const handleNewPrepKit = () => {
        resetTestDataState()
        resetPreparationState()
        resetUiState()

        setSamplePreparationStarted(true)
        setStartProcessForSamplePreparation(false)

        openScanner()
    }

    //old code below
    // const handleVoidSample = (id) => {
    //     removeVoidSample(id)
    //     removeHeaterID(id)
    // }
    const handleHeater = (event) => {
        const { name } = event.target;
        setLoadNo(name)
        // setHeater(name,currentSample.id,1)
    }
    const heatersNo = ["1", "2", "3", "4"];
    return (

        < >
       {errorPopUp && <ErrorPopUp handleEndTest={handleEndTest} handleNewPrepKit={handleNewPrepKit}/>}
            {
                !isScanning ? (
                    <>
                        <div style={{minHeight:"67.82vh", maxWidth:"100%",minWidth:"100%"}}>
                            {/* <CompletedSamplesToasts timerMapper={timerMapper} samples={samples} timeExceededSamples={timeExceededSamples} voidSamples={voidSamples} /> */}
                            <div style={{minHeight:"67.82vh", maxWidth:"72.65vw",minWidth:"72.65vw",background:"rgb(239,239,239)", paddingBottom: "1.5vh"}} className="bg-[#c3c2c2] relative  flex flex-col border-3rem">


                                {activeStep === instructions.steps.length - 2?
                                <><div className="text-[2.5vw] w1379  border-3rem" style={{zIndex:"0",position:"relative"}}>
                                   <Instructions type={instructions.steps[activeStep].type} images={instructions.steps[activeStep].images} info={instructions.steps[activeStep].info} addInfo={instructions.steps[activeStep].addInfo} />
                                    <div id="overlaybuttons" style={{minHeight:"67.82vh",maxHeight:"67.82vh",width:"72.65vw"}}>

                                        <div id="loadheaterconatiner">
                                            <div id="loadheater">

                                            <ol className="heaterOl" style={{ minWidth:"100%"}}>
                                                        {heatersNo.map((key, index) => {
                                            return(
                                                <li key={index} style={{maxHeight:"3.04vh",alignSelf:"center",justifySelf:"center"}}>
                                                <div><Button onClick={handleHeater} disabled={heater[key]==='true'?true:false} name={key} style={heater[key] || loadNo === key ?{backgroundColor:"#24B34B",width:"19.63vw",minHeight:"3.04vh",fontSize:"2vh"}:{minWidth:"19.63vw",minHeight:"3.04vh",fontSize:"2vh"}} ></Button></div>
                                                </li>

                                                )
                                                })
                                            }

                                            </ol>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </>
                                :<>
                                <div className="text-[2.5vw] w1379  border-3rem"> <Instructions type={instructions.steps[activeStep].type} images={instructions.steps[activeStep].images} info={instructions.steps[activeStep].info} addInfo={instructions.steps[activeStep].addInfo} /></div>
                                <div style={{position:"absolute",bottom:"0",minWidth:"72.65vw"}} className="mt-6 grid grid-cols-4  px-[0.72vw]" >
                                            {instructions.steps[activeStep].steps.map((step, index) => (
                                                <PrepareSampleStep
                                                    {...step}
                                                    timerKey={timerKey}
                                                    updateTimer={updateTimer}
                                                    key={index}
                                                />

                                    ))}
                                </div>
                                </>}
                            </div>
                        </div>
                        <div id="videoDisc" style={{maxWidth:"64vw",alignItems:"flex-end",paddingTop:"1.39vh",lineHeight:"3.47vh"}}>
        <div id="stepcount">{instructions.steps[activeStep].heading}</div>

                <div id="stepname" style={{padding:"0px"}}>{instructions.steps[activeStep].description_2?(instructions.steps[activeStep].description +currentSample.id + instructions.steps[activeStep].description_1 +heaterNo  + instructions.steps[activeStep].description_2):(instructions.steps[activeStep].description)}</div>
        </div>

             <div className="flex justify-between absolute bottom-[0] w-full" style={{alignItems:"flex-end",maxHeight:"7.25vh",}}>




        <div onTouchStart={() => setBgBackColour("#cbcbcb")} onTouchEnd={() => setBgBackColour("#efefef")}>
            <Button className="backBtnTouch" size="mini" style={{maxWidth:"13.02vw",maxHeight:"5.04vh", backgroundColor:bgBackColour}} positive onClick={handlePrevVideo}>Back</Button>
        </div>

        <div onTouchStart={() => setBgErrorColour("#cbcbcb")} onTouchEnd={() => setBgErrorColour("#efefef")}>
            <Button className="backBtnTouch t-24 " size="mini" style={{maxWidth:"13.02vw",maxHeight:"5.04vh", backgroundColor:bgErrorColour}} positive disabled={loadNo !== null } onClick={()=>setErrorPopUp(true)}>Error</Button>
        </div>
        <div onTouchStart={() => setBgConfirmColour("#24b34b ")} onTouchEnd={() => setBgConfirmColour("#a7e1b7")}>
        <Button className="confirmBtnTouch t-24  " size="mini" style={{maxWidth:"13.02vw",maxHeight:"5.04vh", backgroundColor:bgConfirmColour}} positive disabled={(activeStep === instructions.steps.length - 2) && loadNo === null} onClick={handleNextVideo}>Confirm</Button>
        </div>

        </div>
        </>
        ) :(!hasCaptureSampleScreen?
            <ScanSample isQRCode={false} handleOpenScanner={handleOpenScanner} />:
                <ResultCaptureScreen />
            )
            }
        </>
    )
}

export default memo(PrepareSample)
