import { memo } from "react"
import { Button } from "semantic-ui-react"
import { TOTAL_HEATERS } from "../../constants";
import { useSampleStore } from "../../store/samples";
import { useUIStore } from "../../store/ui"
import PrepareSample from "../PrepareSample";
import ScanSample from "../ScanSample";
import { checkBluetooth } from "../../helpers/utilities"

import SampleRequirementForm from "../SampleRequirementForm";
// import { useHeaterStore } from "../../store/heaterStore";
// import { useAdvTimerStore } from "../../storeAdv/advTimers";
import ResultCaptureScreen from "../ResultCaptureScreen";
// import { useAdvTestDataStore } from "../../storeAdv/advTestData";
// import { v4 as uuidv4 } from 'uuid';
const Activity = () => {
    const uiState = useUIStore();

    const {
        hasSamplePreparationStarted,
        startProcessForSamplePreparation,
        setStartProcessForSamplePreparation,
        setSamplePreparationStarted,
        isScanning,
        openScanner,
        hasCaptureSampleScreen,
        setHasCaptureSampleScreen,
    } = uiState;
    const sampleState = useSampleStore()

    //const {removeAdvTestData} = useAdvTestDataStore()
    const { setScanningId,setScanningIdPos } = sampleState
    const { samples,setPreperationScreenSampleId,preperationScreenSampleId , setCurrentSample } = sampleState;
    const startPrep = () => {

        setSamplePreparationStarted(true)
        const epoch =  Math.floor(new Date().getTime() / 100)
        checkBluetooth()
      //  console.log(uuidv4())
        const currentSample = {
            id: preperationScreenSampleId?preperationScreenSampleId:epoch.toString()
        }
        setCurrentSample(currentSample)

        setPreperationScreenSampleId("")
    }
    const handleBack = () => {
        setCurrentSample({id:""})
        setSamplePreparationStarted(false)
    }
    //const { removeTimerForSamplePos, addToBegPopUp} = useAdvTimerStore()
    //old code below
    /*const createSample = useCallback(() => {
        const sampleId = shortid.generate();
        const currentSample = {
            id: sampleId
        }
        setCurrentSample(currentSample)
    }, [setCurrentSample])
    const handleResultCaptureScreen = (id,pos) => {
        setHasCaptureSampleScreen(true)
    }*/
    // const HeaterS = useHeaterStore()

    // const {
    //     removeHeaterID
    // } = HeaterS

    //old code below
    /*
    const handleVoidSample = (id) => {

        removeHeaterID(samplePos[id])
        removeTimerForSamplePos(id)
        removeAdvTestData(id)
        removeVoidSample(id)
    }
    */
    const handleOpenScanner = (value,id,pos) => {
      openScanner(value)
      setHasCaptureSampleScreen(value)
      setScanningId(id)
      setScanningIdPos(pos)
        //    setScanningId(id)
    }

    const areHeatersAvailable = samples.length < TOTAL_HEATERS

    return (<>

        <div className="bg-cont" style={{ maxHeight: "100%",minWidth:"100%" }}>
             <div className="bg-white act-w2 relative" style={{ minHeight: "100%",maxWidth:"72.65vw" }}>


                {
                !hasSamplePreparationStarted ?
                    <>
                        {
                            !isScanning ? (
                                < >
            <>
                        <div className="border-3rem"  style={{minHeight:"67.82vh",maxHeight:"67.82vh",maxWidth:"100%",minWidth:"100%"}}>
                            {/* <CompletedSamplesToasts timerMapper={timerMapper} samples={samples} timeExceededSamples={timeExceededSamples} voidSamples={voidSamples} /> */}
                            <div  style={{minHeight:"67.82vh",maxHeight:"67.82vh",maxWidth:"72.65vw",minWidth:"72.65vw",background:"rgb(239,239,239)"}} className="bg-[#c3c2c2] border-3rem relative  flex flex-row">
                              <div className="w-1/4">
                                <img style={{maxHeight:"35.5vh", paddingLeft: "2vw", paddingTop: "2vw"}} src="images/1-1prep.png" type="image/png" alt="prep"/>
                                <div className="content-text !text-[2.43vh] !leading-[2.43vh]" style={{minWidth: "16vw", paddingLeft: "2vw", paddingTop: "1vw"}}>
                                  <span className="fontpublic">1</span><br/>
                                  Wipe test area and wear clean gloves during test procedure.<br/><br/>
                                  The Heat Block should be at 63.5&deg;C
                                </div>
                              </div>
                              <div className="w-3/4">
                                  <img style={{maxHeight:"35.5vh", paddingLeft: "1vw", paddingTop: "2vw", paddingRight: "2vw"}} src="images/1-2prep.png" type="image/png"  alt="prep2"/>
                                  <div className="content-text start-content !text-[2.43vh] !leading-[2.43vh]" style={{minWidth: "16vw", paddingLeft: "1vw", paddingTop: "1vw"}}>
                                    <span className="fontpublic">2</span>
                                    Prepare the following<br/>
                                    <div style={{marginLeft: "1.2vw"}}>
                                      <ul style={{listStyleType: "disc"}}>
                                        <li className="content-text" style={{lineHeight: "1.7rem", listStyle: "disc"}}>Patient Sample</li>
                                        <li className="content-text" style={{lineHeight: "1.7rem", listStyle: "disc"}}>Sample Preparation Kit</li>
                                        <li className="content-text" style={{lineHeight: "1.7rem", listStyle: "disc"}}>Test Panel</li>
                                        <li className="content-text" style={{lineHeight: "1.7rem", listStyle: "disc"}}>20 &micro;L Pipette and tips</li>
                                      </ul>
                                    </div>
                                  </div>

                                  <div className="content-text start-content !text-[2.43vh] !leading-[2.43vh]" style={{minWidth: "16vw", paddingLeft: "1vw", paddingTop: "1vw"}}>
                                    <span className="fontpublic">3</span>
                                    Press Start, then scan or manually enter the codes circled in green:<br/>
                                    <div style={{marginLeft: "1.2vw"}}>
                                      <ul style={{listStyleType: "disc"}}>
                                        <li className="content-text" style={{lineHeight: "1.7rem", listStyle: "disc"}}>Patient Sample ID</li>
                                        <li className="content-text" style={{lineHeight: "1.7rem", listStyle: "disc"}}>Sample Preparation Kit REF/LOT</li>
                                        <li className="content-text" style={{lineHeight: "1.7rem", listStyle: "disc"}}>Test Panel Tag REF/SN</li>
                                      </ul>
                                    </div>
                                  </div>
                              </div>
                            {/* <img className="border-3rem" style={{maxHeight:"67.82vh",borderRadius:"16px!important",maxWidth:"72.65vw",minWidth:"72.65vw"}} src="images/01 new test.png" type="image/png" /> */}
                            </div>
                        </div>
                        <div id="videoDisc" style={{minHeight:"15.21vh",maxWidth:"63.28vw",alignItems:"flex-end",paddingTop:"1.39vh",lineHeight:"3.47vh"}}>
        <div id="stepcount">Preparation</div>
                <div id="stepname" style={{padding:"0px"}}>Prepare the workspace and collect all test consumables. Open and set-up the Sample Preparation Kit and Test Panel.</div>
        </div>

             <div className="flex justify-start absolute bottom-[0] w-full" style={{alignItems:"flex-end",maxHeight:"7.25vh"}}>

             <Button disabled={!areHeatersAvailable}  className="startBtn t-24 " size="mini" style={{maxWidth:"13.02vw",maxHeight:"5.04vh"}} positive  onClick={startPrep}>Start</Button>
        </div> </>
        </>
                            )
                                :
                                (!hasCaptureSampleScreen?
                                <ScanSample isQRCode={false} handleOpenScanner={handleOpenScanner} />:
                                    <ResultCaptureScreen />
                                )
                        }
                    </>
                    :
                    startProcessForSamplePreparation ?
                        <PrepareSample /> :
                        <SampleRequirementForm
                            setStartProcessForSamplePreparation={setStartProcessForSamplePreparation}
                            back = {handleBack}
                        />}
            </div>
        </div>
        </>
    )
}

export default memo(Activity)
