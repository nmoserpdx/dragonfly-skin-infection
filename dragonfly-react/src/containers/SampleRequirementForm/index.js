import { memo, useCallback, useState, useEffect } from "react"
import { Button } from "semantic-ui-react"
import { BCR, SCAN_ERRORS } from "../../constants/sample";
import { CalculateDateFromJDay } from "../../helpers";
import { useNonPersistentStates } from "../../store/noPersistentState";
import { useSampleStore } from "../../store/samples";
import { useTestDataStore } from "../../store/testData";
import { useUIStore } from "../../store/ui";
import { useConfigStore } from "../../store/appconfiguration";
import ScanSample from "../ScanSample";

const SampleRequirementForm = ({
    setStartProcessForSamplePreparation,
    back
}) => {
    const testDataState = useTestDataStore()

    const {
        setSamplePrepKit,
        setTestPanel,
        setSerialNo,
        serialNo,
        lotNo,
        setLotNo,
        setCompositePrepKit,
        setCompositeTestPanel
    } = testDataState;
    const {setIsWrongSample,wrongMsg,setWrongMsg,
      setWrongType,setIsWrongTestSample, setWrongTestPanelType, setWrongTestPanelMsg,
      wrongTestPanelMsg, resetNoPersistentState, setsampleIDScanned} = useNonPersistentStates()
    const [isBarCodeOpen, openBarCodeScanner] = useState(false)
    const state = useSampleStore()
    const { setCurrentSample, allowExpiry } = state
    const uiState = useUIStore()
    // const [expiry,SetExpiry] = useState()
    // const [wrongSample,setWrongSample]=useState(false)
    const { openScanModal, isScanning, openScanner } = uiState
        const [bgBackColour, setBgBackColour] = useState("#efefef")
    const [bgConfirmColour, setBgConfirmColour] = useState("#a7e1b7")
    const { sample_ids, test_panel_ids } = useConfigStore()
    // const PREP_KIT = JSON.parse(localStorage.getItem('sampleids')).ids
    //                 ? JSON.parse(localStorage.getItem('sampleids')).ids
    //                 : ['100006', '100104', '100350']
    const PREP_KIT = sample_ids
    // const TEST_PANEL = JSON.parse(localStorage.getItem('testpanels')).ids
    //                   ? JSON.parse(localStorage.getItem('testpanels')).ids
    //                   : ['100051','100040', '100069']
    const TEST_PANEL = test_panel_ids

    // useEffect(()=>{

    //     openScanner(true)
    //     return function(){
    //         openScanner(false)
    //     }
    // })
    // const createSample = useCallback(() => {
    //     const sampleId = shortid.generate();
    //     const currentSample = {
    //         id: sampleId
    //     }
    //     setCurrentSample(currentSample)
    // }, [setCurrentSample])

    const capture = useCallback(
        () => {

            setStartProcessForSamplePreparation(true)
            resetNoPersistentState()
            // createSample()
        },
        [setStartProcessForSamplePreparation]
    );

    const checkForExpiry = (date) => {
        // console.log(YYMMDD)
        // return new Date(`20${YYMMDD.slice(0,2)}-${YYMMDD.slice(2,4)}-${YYMMDD.slice(4,6)}`) > new Date()
        if(allowExpiry){
          return true;
        }
        return date > new Date()
    }
    const checkForExpiryYYMMDD = (YYMMDD) => {
        // console.log(new Date(`20${YYMMDD.slice(0,2)}-${YYMMDD.slice(2,4)}-${YYMMDD.slice(4,6)}`) )
        if(allowExpiry){
          return true;
        }
        return new Date(`20${YYMMDD.slice(0,2)}-${YYMMDD.slice(2,4)}-${YYMMDD.slice(4,6)}`) >= new Date()
    }

    //old code below
    /*
    const GetDayInFormat = (YYMMDD) => {
        console.log(YYMMDD)
        return new Date(`20${YYMMDD.slice(0,2)}-${YYMMDD.slice(2,4)}-${YYMMDD.slice(4,6)}`)
    }
    const handleWrongSample = () => {
        setWrongSample(true)
    }
    const generateSNo = (ref,eld,jd,lot) => {
        var sn = ref+eld+jd+lot
        setSerialNo(sn)
    }

    function daysDifference( date1, date2 ) {
        var one_day=1000*60*60*24;
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();
        var difference_ms = date2_ms - date1_ms;
        return Math.round(difference_ms/one_day);
    } */

    //old code below
    /*
    function calculateNDays(currentDate){
        let janThisYear = new Date();
        janThisYear.setDate(1);
        janThisYear.setMonth(0);
        console.log(currentDate)
        return daysDifference(janThisYear, currentDate);
    }
    */

    const handleQRCodeScan = (response) => {

        var regex = new RegExp('\u001D', "ig"); //backward compatibility
        var responseType = response.split(regex);

        if(responseType.length != 3){ //invalid code detected
          responseType = response.split('&'); //trying with new version
        }

        if(responseType.length > 1){
          let extractedCode = responseType[BCR["ref"]].replace(/ [&\/\\#,+()$~%.'":*?<>{}-]/g, '');
           if(extractedCode && responseType[BCR["expiry"]]){
            if(checkForExpiryYYMMDD(responseType[BCR["expiry"]].slice(2))){
              if(PREP_KIT.indexOf(extractedCode.slice(3))!==-1 ){
                  let total_length = extractedCode.slice(3).length // + responseType[BCR['lot']].slice(2).length REMOVED AS PER NEW REQ
                  if(total_length === 6) //REMOVED AS PER NEW REQ
                  {
                    //setSamplePrepKit(responseType[BCR["ref"]].slice(3))
                    //setLotNo(responseType[BCR['lot']].slice(2))
                    setCompositePrepKit(extractedCode.slice(3), responseType[BCR['lot']].slice(2), responseType[BCR["expiry"]].slice(2))
                    //setTimeout(() => setLotNo(responseType[BCR['lot']].slice(2)), 10)
                    setIsWrongSample(false)
                    setWrongType(SCAN_ERRORS["NONE"])
                    setWrongMsg("")
                  }else{
                    setCompositePrepKit(extractedCode.slice(3), responseType[BCR['lot']].slice(2), responseType[BCR["expiry"]].slice(2))
                    //setSamplePrepKit(responseType[BCR["ref"]].slice(3))
                    //setLotNo(responseType[BCR['lot']].slice(2))
                    //setTimeout(() => setLotNo(responseType[BCR['lot']].slice(2)), 10)
                    setIsWrongSample(true)
                    setWrongType(SCAN_ERRORS["INVALID_PREP_KIT"])
                    setWrongMsg("The scanned prep kit is invalid.")
                  }
              }
              else {
                  // setSamplePrepKit(responseType[BCR["ref"]].slice(3))
                  // setLotNo(responseType[BCR['lot']].slice(2))
                  /*setIsWrongSample(true)
                  setWrongType(SCAN_ERRORS["INVALID_PREP_KIT"])
                  setWrongMsg(`captured test panel id ${responseType[0].slice(0,6)} is Invalid`)*/
                  if(TEST_PANEL.indexOf(extractedCode.slice(3))!==-1){
                    setIsWrongTestSample(true)
                    setWrongTestPanelType(SCAN_ERRORS["INVALID_TEST_PANEL"])
                    setWrongTestPanelMsg('Remove the Test Panel from the package and scan the Test Panel Tag')
                  }else{
                    //Set color here
                    setCurrentSample({id: response})
                    setsampleIDScanned(true)
                  }
              }
            }
            else{
                // console.log("herherherhehreh")
                if(PREP_KIT.indexOf(extractedCode.slice(3))!==-1 ){
                  // setSamplePrepKit(responseType[BCR["ref"]].slice(3))
                  // setLotNo(responseType[BCR['lot']].slice(2))
                  // setTimeout(() => setLotNo(responseType[BCR['lot']].slice(2)), 10)
                  setCompositePrepKit(extractedCode.slice(3), responseType[BCR['lot']].slice(2), responseType[BCR["expiry"]].slice(2))
                  setIsWrongSample(true)
                  setWrongType(SCAN_ERRORS["EXPIRED_PREP_KIT"])
                  setWrongMsg(`The item is past the expiry date.\n
                  Please scan a new item.`)
                }else if(TEST_PANEL.indexOf(extractedCode.slice(3))!==-1){
                    setIsWrongTestSample(true)
                    setWrongTestPanelType(SCAN_ERRORS["INVALID_TEST_PANEL"])
                    setWrongTestPanelMsg('Remove the Test Panel from the package and scan the Test Panel Tag')
                }else{
                  var id = responseType.join("");
                  //set color here
                  setCurrentSample({id: id})
                  setsampleIDScanned(true)
                }
            }
        }
      }
      else {
        let testpanelcode = responseType[0].replace(/ /g, '');
        var expiryDate = CalculateDateFromJDay(parseInt(testpanelcode.slice(7,10)),testpanelcode.slice(6,7))
        //console.log(expiryDate,responseType[0].slice(0,6),checkForExpiry(expiryDate))
        if(checkForExpiry(expiryDate)) {
          if(TEST_PANEL.indexOf(testpanelcode.slice(0,6))!==-1)
          {
              let len = testpanelcode.slice(0,6).length + testpanelcode.slice(6).length
              if(len === 15){
                // setTestPanel(responseType[0].slice(0,6))
                // //setSerialNo(responseType[0].slice(6))
                // setTimeout(() => setSerialNo(responseType[0].slice(6)), 10)
                setCompositeTestPanel(testpanelcode.slice(0,6), (testpanelcode.slice(6)), expiryDate)
                setIsWrongTestSample(false)
                setWrongTestPanelType(SCAN_ERRORS["NONE"])
                setWrongTestPanelMsg("")
              }else{
                // setTestPanel(responseType[0].slice(0,6))
                // setSerialNo(responseType[0].slice(6))
                // setTimeout(() => setSerialNo(responseType[0].slice(6)), 10)
                setCompositeTestPanel(testpanelcode.slice(0,6), (testpanelcode.slice(6)), expiryDate)
                setIsWrongTestSample(true)
                setWrongTestPanelType(SCAN_ERRORS["INVALID_TEST_PANEL"])
                setWrongTestPanelMsg("The scanned test panel tag is invalid.")
              }
          }
          else{
              /*setTestPanel(responseType[0].slice(0,6))
              setSerialNo(responseType[0].slice(6))
              setIsWrongTestSample(true)
              setWrongTestPanelType(SCAN_ERRORS["INVALID_TEST_PANEL"])
              setWrongTestPanelMsg(`captured test panel id ${responseType[0].slice(0,6)} is Invalid`)*/
              setCurrentSample({id: response})
              setsampleIDScanned(true)
          }
        }
        else {
            if(TEST_PANEL.indexOf(testpanelcode.slice(0,6))!==-1){
              // setTestPanel(responseType[0].slice(0,6))
              // setSerialNo(responseType[0].slice(6))
              // setTimeout(() => setSerialNo(responseType[0].slice(6)), 10)
              setCompositeTestPanel(testpanelcode.slice(0,6), (testpanelcode.slice(6)), expiryDate)
              setIsWrongTestSample(true)
              setWrongTestPanelType(SCAN_ERRORS["EXPIRED_TEST_PANEL"])
              setWrongTestPanelMsg(`The item is past the expiry date.\nPlease scan a new Test Panel Tag.`)
            }else{
              setCurrentSample({id: response}) //Sample
              setsampleIDScanned(true)
            }
        }
      }
    }

    const closeCamera = () => openScanModal(false)

    useEffect(() => {
        openBarCodeScanner(true)
    })
    const handleOpenScanner = (value) => {
        openScanner(value)
    }
    const handleBack = (value) => {
        setTestPanel("")
        setSerialNo("")
        setSamplePrepKit("")
        setLotNo("")
        setStartProcessForSamplePreparation(false)
        resetNoPersistentState()
        back()
    }
    //following code is for development purpose only

    const TestSampleScanInput = () => {
      //  handleQRCodeScan('240100006101000517221210') //proper
        handleQRCodeScan('2401001041012345617303498') //proper
        //handleQRCodeScan('240100006^11010004^117221210') //proper
          //handleQRCodeScan('240100-006101000117220128') //error
        //handleQRCodeScan('Test Sample')
        //handleQRCodeScan('100051200012356')
        handleQRCodeScan('100 051429043667')
        //handleQRCodeScan('100040317900345')
        //setTimeout(() => handleQRCodeScan('100040317900345'), 2000)
    }

    return (
        <>
            {/* <button onClick={()=>TestSampleScanInput()}>TEST SAMPLE</button> */}
            <div >
                {
                    (!isScanning ? <ScanSample isQRCode printQrCodeOutput={handleQRCodeScan} closeCamera={closeCamera} /> : <ScanSample isQRCode={false} handleOpenScanner={handleOpenScanner} />)
                }
            </div>
            {!isScanning &&
                <>
                <div style={{minHeight:"15.21vh",maxWidth:"63.28vw",alignItems:"flex-end",paddingTop:"1.39vh",lineHeight:"3.47vh"}}>

            <div id="stepcount">Scan reference codes</div>

                    <div id="stepname" style={{padding:"0px"}}>Scan or manually enter the data matrix or bar codes for the Patient Sample, Sample Preparation Kit, and Test Panel Tag.</div>
            </div>
            <div className="flex justify-between absolute bottom-[0] w-full" style={{alignItems:"flex-end",maxHeight:"7.25vh"}}>
                <div onTouchStart={() => setBgBackColour("#cbcbcb")} onTouchEnd={() => setBgBackColour("#efefef")}>
                    <Button className="backBtnTouch t-24 l-space-2" size="mini" style={{maxWidth:"13.02vw",maxHeight:"5.04vh", backgroundColor:bgBackColour}} positive onClick={()=>handleBack()}>Back</Button>
                </div>
                <div onTouchStart={() => setBgConfirmColour("#24b34b ")} onTouchEnd={() => setBgConfirmColour("#a7e1b7")}>
                    <Button className="confirmBtnTouch t-24 l-space-2" size="mini" style={{maxWidth:"13.02vw",maxHeight:"5.04vh", backgroundColor:bgConfirmColour}}
                    positive  disabled={lotNo==="" || serialNo==="" || wrongMsg!=="" || wrongTestPanelMsg!==""} onClick={capture}>Confirm</Button>
                </div>
            </div>
                </>
            }

        </>
    )
}

export default memo(SampleRequirementForm)
