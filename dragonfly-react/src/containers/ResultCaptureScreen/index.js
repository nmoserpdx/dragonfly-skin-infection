import { memo, useEffect } from "react";
import { Button } from "semantic-ui-react";
import { instructions } from "../../logic/instructions";
//import { usePreparationStore } from "../../store/preparationSteps";
import { useUIStore } from "../../store/ui";
import { useSampleStore } from "../../store/samples";
// import { usePrepareSampleStore } from "../../store/prepareSampleTimers";
// import { useHeaterStore } from "../../store/heaterStore";
import { useAdvTestDataStore } from '../../storeAdv/advTestData';

 const ResultCaptureScreen = () => {
    // const videoRef = useRef(null)
    //const [isVideoPlaying, setIsVideoPlaying] = useState(false)
    //const state = usePreparationStore()
    const {advSerialNo} = useAdvTestDataStore()
    // const [heaterNo,setHeaterNo] = useState("")

    const uiState = useUIStore();
    const { setHasCaptureSampleScreen,setCamera,setShouldDisplayId } = uiState;
    const sampleState = useSampleStore()
    const { scanningId,scanningIdPos } = sampleState

    //const [timerKey, updateTimer] = useState(0);
    // const {
    //     resetState : resetPrepareSampleStoreState
    // } = usePrepareSampleStore()

    //old code below
    /*
    const handleOpenScanner = (value,id) => {
        openScanner(value)
    }
    */

    useEffect(() => {
       setCamera(true)

    }, [])
    const handleNext = () =>{
        setHasCaptureSampleScreen(false)
        setShouldDisplayId(false)
        // setScanningId(id)
    }

    return (
        < >
          <>
          <div style={{minHeight:"67.82vh",maxHeight:"67.82vh",maxWidth:"100%",minWidth:"100%"}}>
              {/* <CompletedSamplesToasts timerMapper={timerMapper} samples={samples} timeExceededSamples={timeExceededSamples} voidSamples={voidSamples} /> */}
              <div style={{minHeight:"67.82vh",maxHeight:"67.82vh",maxWidth:"72.65vw",minWidth:"72.65vw",background:"rgb(239,239,239)"}} className="bg-[#c3c2c2] relative  flex flex-col border-3rem">
                <div className="w-full flex-row" style={{display: "inline-flex", justifyContent: "center",paddingTop:"3.47vh",paddingRight:"1.14vw",paddingLeft:"1.14vw"}}>
                  <div className="" style={{paddingLeft:"0.98vw",paddingRight:"0.98vw"}}>
                    <img  className="w-[33.95vw] h-[41.39vh]"  src={`/images/8-1capture.png`} type="image/png"  alt="capture"/>
                    <div className="content-text" style={{maxWidth: "34vw", paddingTop: "1vw"}}>
                      <span style={{fontWeight: "800"}}>{1}</span><br/>
                      Carefully remove the Test Panel from the Heat Block.<br/>
                      <br/><span className="fontpublic">IMPORTANT:</span> making sure lids remain closed.<br/>
                      <br/><span className="fontpublic">TIP:</span> Lift from tag.
                    </div>
                  </div>
                  <div className="" style={{paddingLeft:"0.98vw",paddingRight:"0.98vw"}}>
                    <img  className="w-[33.95vw] h-[41.39vh]"  src={`/images/8-2capture.png`} type="image/png"  alt="capture"/>
                    <div className="content-text" style={{maxWidth: "34vw", paddingTop: "1vw"}}>
                      <span style={{fontWeight: "800"}}>{2}</span><br/>
                      Fold open the Result Capture Card and place the test panel into position as shown.<br/>
                      <br/><span className="fontpublic">IMPORTANT:</span> Allow test panel to cool for 1 minute before assessing the results.
                    </div>
                  </div>
                </div>
              </div>
          </div>
          <div id="videoDisc" style={{minHeight:"15.21vh",maxWidth:"64vw",alignItems:"flex-end",paddingTop:"1.39vh",lineHeight:"3.47vh"}}>
            <div id="stepcount">{instructions.steps[6].heading}</div>
                <div id="stepname" style={{padding:"0px"}}>{instructions.steps[6].description_2?(instructions.steps[6].description + "SN " + advSerialNo[scanningId] + instructions.steps[6].description_1 +scanningIdPos  + instructions.steps[6].description_2):(instructions.steps[6].description)}</div>
                </div>
                <div className="flex justify-between absolute bottom-[0] w-full" style={{alignItems:"flex-end",maxHeight:"7.25vh"}}>
                <Button className="confirmBtn t-24 l-space-2 backbtn" size="mini" style={{maxWidth:"13.02vw",maxHeight:"5.06vh"}} positive disabled={true} >Back</Button>
                <Button className="confirmBtn t-24 l-space-2" size="mini" style={{maxWidth:"13.02vw",maxHeight:"5.06vh"}} positive onClick={handleNext}>Confirm</Button>
            </div>
        </>
        </>
    )
}

export default memo(ResultCaptureScreen)
