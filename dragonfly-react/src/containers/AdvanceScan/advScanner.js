import { useEffect, useState } from "react";
import { Button } from "semantic-ui-react";
import { useUIStore } from "../../store/ui";
import { useAdvTestDataStore } from "../../storeAdv/advTestData";
import { useAdvSampleStore } from "../../storeAdv/advSample";
import { CalculateDateFromJDay } from "../../helpers";
import { useAdvUiStore } from "../../storeAdv/advUi";
import { useCurrentAdvTestDataStore } from "../../storeAdv/advCurrentSample";
import { useNonPersistentStates } from "../../store/noPersistentState";
import { BCR, SCAN_ERRORS } from "../../constants/sample";
import Video from "../../components/Video";
import { useSampleStore } from "../../store/samples";
import { useConfigStore } from "../../store/appconfiguration";
const AdvScanSample = ({
  isQRCode,
  transferState,
  capture,
}) => {
  const uiState = useUIStore();
  const { hasCaptureSampleScreen, setIsQRcode } = uiState;
  const { advSamples, setAdvSamples } = useAdvSampleStore();
  const { advTestPanelID } = useAdvTestDataStore();
  const { scanningForPos } = useAdvSampleStore();
  const {
    setIsAdvScanning,
    setIsAdvQRcode,
    isDirectResultCapture,
    setIsDirectResultCapture,
  } = useAdvUiStore();
  const [color, setColor] = useState("white");
  const {
    setAdvCompositePrepKit,
    setAdvCompositeTestPanelID,
  } = useAdvTestDataStore();
  const {
    currentAdvTestPanelID,
    setCurrentAdvSampleID,
    resetCurrentAdvTestDataState,
    setCurrentAdvCompositePrepKit,
    setCurrentAdvCompositeTestPanelID,
  } = useCurrentAdvTestDataStore();
  const {
    setIsWrongSample,
    setWrongMsg,
    wrongType,
    setWrongType,
    setIsWrongTestSample,
    setWrongTestPanelType,
    setWrongTestPanelMsg,
    wrongTestPanelType,
    resetNoPersistentState,
    setsampleIDScanned,
  } = useNonPersistentStates();
  const { allowExpiry } = useSampleStore()
  const { sample_ids, test_panel_ids } = useConfigStore()
  // const PREP_KIT = JSON.parse(localStorage.getItem('sampleids')).ids
  //                 ? JSON.parse(localStorage.getItem('sampleids')).ids
  //                 : ['100006', '100104', '100350']
  const PREP_KIT = sample_ids
  // const TEST_PANEL = JSON.parse(localStorage.getItem('testpanels')).ids
  //                   ? JSON.parse(localStorage.getItem('testpanels')).ids
  //                   : ['100051','100040', '100069']
  const TEST_PANEL = test_panel_ids

  // const {userInfo, processing, error} = useSelector((state) =>state.logIn)
  //old code below
  // const displayTimer = (timerStatus) => {
  //     let timer = secondsToTime(timerStatus);
  //     return (`${timer.m}:${timer.s}`)
  // };

  useEffect(() => {
    !isQRCode ? setIsQRcode(true) : setIsQRcode(false);
  }, [hasCaptureSampleScreen]);

  //old code below
  /*
    const handleWrongSample = () => {
        setColor("red")
    }
    const generateSNo = (ref,eld,jd,lot) => {
        var sn = ref+eld+jd+lot
        setCurrentAdvSerialNo(sn)
    }
    function calculateNDays(currentDate){
        let janThisYear = new Date();
        janThisYear.setDate(1);
        janThisYear.setMonth(0);
        return daysDifference(janThisYear, currentDate);
    }

    function daysDifference( date1, date2 ) {
        var one_day=1000*60*60*24;
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();
        var difference_ms = date2_ms - date1_ms;
        return Math.round(difference_ms/one_day);
      }
    */

  const checkForExpiry = (date) => {
    // console.log(YYMMDD)
    //console.log(Date)
    // return new Date(`20${YYMMDD.slice(0,2)}-${YYMMDD.slice(2,4)}-${YYMMDD.slice(4,6)}`) > new Date()
    if(allowExpiry){
      return true;
    }
    return date > new Date();
  };
  const checkForExpiryYYMMDD = (YYMMDD) => {
    // console.log(
    //   new Date(
    //     `20${YYMMDD.slice(0, 2)}-${YYMMDD.slice(2, 4)}-${YYMMDD.slice(4, 6)}`
    //   )
    // );
    if(allowExpiry){
      return true;
    }
    return (
      new Date(
        `20${YYMMDD.slice(0, 2)}-${YYMMDD.slice(2, 4)}-${YYMMDD.slice(4, 6)}`
      ) >= new Date()
    );
  };

  const handleQRCodeScanSampleExist = (response) => {

    var regex = new RegExp('\u001D', "ig"); //backward compatibility
    var responseType = response.split(regex);
    let testpanelCode = responseType[0].replace(/ /g, '');

    let extractedCode = responseType[BCR["ref"]].replace(/ [&\/\\#,+()$~%.'":*?<>{}-]/g, '');

    if (responseType.length > 1) {
      if (extractedCode && responseType[BCR["expiry"]]) {
        //console.log(responseType[BCR["expiry"]].slice(2),checkForExpiry(responseType[BCR["expiry"]].slice(2)))
        if (checkForExpiryYYMMDD(responseType[BCR["expiry"]].slice(2))) {
          if (PREP_KIT.indexOf(extractedCode.slice(3)) !== -1) {
            let total_length = extractedCode.slice(3).length; // + responseType[BCR['lot']].slice(2).length REMOVED AS PER NEW REQ
            if (total_length === 6) {
              setColor("green");
              //setAdvSamplePrepKit(scanningForPos,extractedCode.slice(3))
              setAdvCompositePrepKit(
                scanningForPos,
                extractedCode.slice(3),
                responseType[BCR["lot"]].slice(2),
                responseType[BCR["expiry"]].slice(2)
              );
              setIsWrongSample(false);
              setWrongType(SCAN_ERRORS["NONE"]);
              setWrongMsg(``);
              //setAdvLotNo(scanningForPos, responseType[BCR["lot"]].slice(2))
              //setTimeout(() => setAdvLotNo(scanningForPos, responseType[BCR["lot"]].slice(2)), 10)
            } else {
              //setAdvSamplePrepKit(scanningForPos,extractedCode.slice(3))
              //setAdvLotNo(scanningForPos, responseType[BCR["lot"]].slice(2))
              //setTimeout(() => setAdvLotNo(scanningForPos, responseType[BCR["lot"]].slice(2)), 10)
              setAdvCompositePrepKit(
                scanningForPos,
                extractedCode.slice(3),
                responseType[BCR["lot"]].slice(2),
                responseType[BCR["expiry"]].slice(2)
              );
              setIsWrongSample(true);
              setWrongType(SCAN_ERRORS["INVALID_PREP_KIT"]);
              setWrongMsg("The scanned prep kit is invalid.");
            }
          } else {
            /*setColor("red")
                  // setAdvSamplePrepKit(scanningForPos,extractedCode.slice(3))
                  setIsWrongSample(true)
                  setWrongType(SCAN_ERRORS["INVALID_PREP_KIT"])
                  setWrongMsg(`Captured Prep kit id is Invalid`)*/
            if (TEST_PANEL.indexOf(extractedCode.slice(3)) !== -1) {
              setIsWrongTestSample(true);
              setWrongTestPanelType(SCAN_ERRORS["INVALID_TEST_PANEL"]);
              setWrongTestPanelMsg(
                "Remove the Test Panel from the package and scan the Test Panel Tag"
              );
            } else {
              setCurrentAdvSampleID(response);
              setAdvSamples(scanningForPos, response);
              setsampleIDScanned(true);
            }
          }
        } else {
          if (PREP_KIT.indexOf(extractedCode.slice(3)) !== -1) {
            setColor("red");
            // setAdvSamplePrepKit(scanningForPos,extractedCode.slice(3))
            // setAdvLotNo(scanningForPos, responseType[BCR["lot"]].slice(2))
            // setTimeout(() => setAdvLotNo(scanningForPos, responseType[BCR["lot"]].slice(2)), 10)
            setAdvCompositePrepKit(
              scanningForPos,
              extractedCode.slice(3),
              responseType[BCR["lot"]].slice(2),
              responseType[BCR["expiry"]].slice(2)
            );
            setIsWrongSample(true);
            setWrongType(SCAN_ERRORS["EXPIRED_PREP_KIT"]);
            setWrongMsg(
              `The item is past the expiry date.\n
              Please scan a new item.`
            );
          } else if (
            TEST_PANEL.indexOf(extractedCode.slice(3)) !== -1
          ) {
            setIsWrongTestSample(true);
            setWrongTestPanelType(SCAN_ERRORS["INVALID_TEST_PANEL"]);
            setWrongTestPanelMsg(
              "Remove the Test Panel from the package and scan the Test Panel Tag"
            );
          } else {
            var id = responseType.join("");
            setCurrentAdvSampleID(id);
            setAdvSamples(scanningForPos, id);
            setsampleIDScanned(true);
          }
        }
      }
    } else {
      var expiryDate = CalculateDateFromJDay(
        parseInt(testpanelCode.slice(7, 10)),
        testpanelCode.slice(6, 7)
      );
      //console.log(expiryDate,responseType[0].slice(0,6),checkForExpiry(expiryDate))
      if (checkForExpiry(expiryDate)) {
        if (TEST_PANEL.indexOf(testpanelCode.slice(0, 6)) !== -1) {
          let len =
            testpanelCode.slice(0, 6).length +
            testpanelCode.slice(6).length;
          if (len === 15) {
            // setAdvTestPanelID(scanningForPos,responseType[0].slice(0,6))
            // setAdvSerialNo(scanningForPos,responseType[0].slice(6))
            // setTimeout(() => setAdvSerialNo(scanningForPos,responseType[0].slice(6)), 10)
            setAdvCompositeTestPanelID(
              scanningForPos,
              testpanelCode.slice(0, 6),
              testpanelCode.slice(6),
              expiryDate
            );
            setColor("green");
            setIsWrongTestSample(false);
            setWrongTestPanelType(SCAN_ERRORS["NONE"]);
            setWrongTestPanelMsg("");
          } else {
            // setAdvTestPanelID(scanningForPos,responseType[0].slice(0,6))
            // setAdvSerialNo(scanningForPos,responseType[0].slice(6))
            // setTimeout(() => setAdvSerialNo(scanningForPos,responseType[0].slice(6)), 10)
            setAdvCompositeTestPanelID(
              scanningForPos,
              testpanelCode.slice(0, 6),
              testpanelCode.slice(6),
              expiryDate
            );
            setIsWrongTestSample(true);
            setWrongTestPanelType(SCAN_ERRORS["INVALID_TEST_PANEL"]);
            setWrongTestPanelMsg("The scanned test panel tag is invalid.");
          }
        } else {
          /*setColor("red")
              setAdvTestPanelID(scanningForPos,responseType[0].slice(0,6))
              setAdvSerialNo(scanningForPos,responseType[0].slice(6))
              setIsWrongTestSample(true)
              setWrongTestPanelType(SCAN_ERRORS["INVALID_TEST_PANEL"])
              setWrongTestPanelMsg(`captured test panel id ${responseType[0].slice(0,6)} is Invalid`)*/
          setCurrentAdvSampleID(response);
          setAdvSamples(scanningForPos, response);
          setsampleIDScanned(true);
        }
      } else {
        if (TEST_PANEL.indexOf(testpanelCode.slice(0, 6)) !== -1) {
          setColor("red");
          // setAdvTestPanelID(scanningForPos,responseType[0].slice(0,6))
          // setAdvSerialNo(scanningForPos,responseType[0].slice(6))
          // setTimeout(() => setAdvSerialNo(scanningForPos,responseType[0].slice(6)), 10)
          setAdvCompositeTestPanelID(
            scanningForPos,
            testpanelCode.slice(0, 6),
            testpanelCode.slice(6),
            expiryDate
          );
          setIsWrongTestSample(true);
          setWrongTestPanelType(SCAN_ERRORS["EXPIRED_TEST_PANEL"]);
          setWrongTestPanelMsg(
            `The item is past the expiry date.\n
            Please scan a new Test Panel Tag.`
          );
        } else {
          setCurrentAdvSampleID(response);
          setAdvSamples(scanningForPos, response);
          setsampleIDScanned(true);
        }
      }
    }
    setTimeout(() => setColor("white"), 2000);
  };

  const handleQRCodeScan = (response) => {
    var regex = new RegExp('\u001D', "ig"); //backward compatibility
    var responseType = response.split(regex);
    //console.log(responseType)
    if (responseType.length > 1) {
      // const responseType = response.split(' ');
      let extractedCode = responseType[BCR["ref"]].replace(/ [&\/\\#,+()$~%.'":*?<>{}-]/g, '');
      if (extractedCode && responseType[BCR["expiry"]]) {
        //console.log(responseType[BCR["expiry"]].slice(2),checkForExpiry(responseType[BCR["expiry"]].slice(2)))
        if (checkForExpiryYYMMDD(responseType[BCR["expiry"]].slice(2))) {
          if (PREP_KIT.indexOf(extractedCode.slice(3)) !== -1) {
            let total_length = extractedCode.slice(3).length; // + responseType[BCR['lot']].slice(2).length REMOVED AS PER NEW REQ
            if (total_length === 6) {
              setColor("green");
              //setCurrentAdvSamplePrepKit(extractedCode.slice(3))
              setCurrentAdvCompositePrepKit(
                extractedCode.slice(3),
                responseType[BCR["lot"]].slice(2),
                responseType[BCR["expiry"]].slice(2)
              );
              setIsWrongSample(false);
              setWrongType(SCAN_ERRORS["NONE"]);
              setWrongMsg("");
              // setCurrentAdvLotNo(responseType[BCR["lot"]].slice(2))
              // setTimeout(() => setCurrentAdvLotNo(responseType[BCR["lot"]].slice(2)), 10)
            } else {
              //setCurrentAdvSamplePrepKit(extractedCode.slice(3))
              //setCurrentAdvLotNo(responseType[BCR["lot"]].slice(2))
              //setTimeout(() => setCurrentAdvLotNo(responseType[BCR["lot"]].slice(2)), 10)
              setCurrentAdvCompositePrepKit(
                extractedCode.slice(3),
                responseType[BCR["lot"]].slice(2),
                responseType[BCR["expiry"]].slice(2)
              );
              setIsWrongSample(true);
              setWrongType(SCAN_ERRORS["INVALID_PREP_KIT"]);
              setWrongMsg("The scanned prep kit is invalid.");
            }
          } else {
            /*setColor("red")
                  // setCurrentAdvSamplePrepKit(extractedCode.slice(3))
                  setIsWrongSample(true)
                  setWrongType(SCAN_ERRORS["INVALID_PREP_KIT"])
                  setWrongMsg(`Captured Prep kit id is Invalid`)*/
            if (TEST_PANEL.indexOf(extractedCode.slice(3)) !== -1) {
              setIsWrongTestSample(true);
              setWrongTestPanelType(SCAN_ERRORS["INVALID_TEST_PANEL"]);
              setWrongTestPanelMsg(
                "Remove the Test Panel from the package and scan the Test Panel Tag"
              );
            } else {
              setCurrentAdvSampleID(response);
              setsampleIDScanned(true);
              //setAdvSamples(scanningForPos, response)
            }
          }
        } else {
          if (PREP_KIT.indexOf(extractedCode.slice(3)) !== -1) {
            setColor("red");
            // setCurrentAdvSamplePrepKit(extractedCode.slice(3))
            // setCurrentAdvLotNo(responseType[BCR["lot"]].slice(2))
            // setTimeout(() => setCurrentAdvLotNo(responseType[BCR["lot"]].slice(2)), 10)
            setCurrentAdvCompositePrepKit(
              extractedCode.slice(3),
              responseType[BCR["lot"]].slice(2),
              responseType[BCR["expiry"]].slice(2)
            );
            setIsWrongSample(true);
            setWrongType(SCAN_ERRORS["EXPIRED_PREP_KIT"]);
            setWrongMsg(
              `The item is past the expiry date.\n
              Please scan a new item.`
            );
          } else if (
            TEST_PANEL.indexOf(extractedCode.slice(3)) !== -1
          ) {
            setIsWrongTestSample(true);
            setWrongTestPanelType(SCAN_ERRORS["INVALID_TEST_PANEL"]);
            setWrongTestPanelMsg(
              "Remove the Test Panel from the package and scan the Test Panel Tag"
            );
          } else {
            var id = responseType.join("");
            setCurrentAdvSampleID(id);
            setsampleIDScanned(true);
          }
        }
      }
    } else {
      let testpanelcode = responseType[0].replace(/ /g, '')
      var expiryDate = CalculateDateFromJDay(
        parseInt(testpanelcode.slice(7, 10)),
        testpanelcode.slice(6, 7)
      );
      //console.log(expiryDate,responseType[0].slice(0,6),checkForExpiry(expiryDate))
      if (checkForExpiry(expiryDate)) {
        if (TEST_PANEL.indexOf(testpanelcode.slice(0, 6)) !== -1) {
          let len =
            testpanelcode.slice(0, 6).length +
            testpanelcode.slice(6).length;
          if (len === 15) {
            // setCurrentAdvTestPanelID(responseType[0].slice(0,6))
            // setCurrentAdvSerialNo(responseType[0].slice(6))
            // setTimeout(() => setCurrentAdvSerialNo(responseType[0].slice(6)), 10)
            setCurrentAdvCompositeTestPanelID(
              testpanelcode.slice(0, 6),
              testpanelcode.slice(6),
              expiryDate
            );
            setColor("green");
            setIsWrongTestSample(false);
            setWrongTestPanelType(SCAN_ERRORS["NONE"]);
            setWrongTestPanelMsg("");
          } else {
            // setCurrentAdvTestPanelID(responseType[0].slice(0,6))
            // setCurrentAdvSerialNo(responseType[0].slice(6))
            // setTimeout(() => setCurrentAdvSerialNo(responseType[0].slice(6)), 10)
            setCurrentAdvCompositeTestPanelID(
              testpanelcode.slice(0, 6),
              testpanelcode.slice(6),
              expiryDate
            );
            setIsWrongTestSample(true);
            setWrongTestPanelType(SCAN_ERRORS["INVALID_TEST_PANEL"]);
            setWrongTestPanelMsg("The scanned test panel tag is invalid.");
          }
        } else {
          /*setColor("red")
                  setCurrentAdvTestPanelID(responseType[0].slice(0,6))
                  setCurrentAdvSerialNo(responseType[0].slice(6))
                  setIsWrongTestSample(true)
                  setWrongTestPanelType(SCAN_ERRORS["INVALID_TEST_PANEL"])
                  setWrongTestPanelMsg(`captured test panel id ${responseType[0].slice(0,6)} is Invalid`)*/
          setCurrentAdvSampleID(response);
          setsampleIDScanned(true);
        }
      } else {
        if (TEST_PANEL.indexOf(testpanelcode.slice(0, 6)) !== -1) {
          setColor("red");
          setIsWrongTestSample(true);
          // setCurrentAdvTestPanelID(responseType[0].slice(0,6))
          // setCurrentAdvSerialNo(responseType[0].slice(6))
          // setTimeout(() => setCurrentAdvSerialNo(responseType[0].slice(6)), 10)
          setCurrentAdvCompositeTestPanelID(
            testpanelcode.slice(0, 6),
            testpanelcode.slice(6),
            expiryDate
          );
          //   console.log("EEEEEE")
          setWrongTestPanelType(SCAN_ERRORS["EXPIRED_TEST_PANEL"]);
          setWrongTestPanelMsg(
            `The item is past the expiry date.\n
            Please scan a new Test Panel Tag.`
          );
          //   setWrongMsg("The item is past the expiry date. Please scan a new item.")
        } else {
          setCurrentAdvSampleID(response);
          setsampleIDScanned(true);
        }
      }
    }
    setTimeout(() => setColor("white"), 2000);
  };

  window.qrCodeOutput = function (response) {
    // setColor("red")
    // console.log(advSamples)
    advSamples[scanningForPos]
      ? handleQRCodeScanSampleExist(response)
      : handleQRCodeScan(response);
    // setTimeout(()=>setColor("white"),2000)
  };
  window.dataMatrixOutPut = function (response) {
    // console.log(response)
  };

  //following code is for development purposes only

    const TestSampleScanInput = () => {
        //window.qrCodeOutput('240100006101000117220128')
        //window.qrCodeOutput('10005120111234')
        //window.qrCodeOutput('2401000061010005ADA17221210') //proper
        window.qrCodeOutput('240100-006101000117220128') //error
        //window.qrCodeOutput('24232323') //error
        //alert(isDirectResultCapture + " " + wrongType)
        window.qrCodeOutput('100051317900345')
        //window.qrCodeOutput('100051200012356')
    }

  const handleCloseChild = () => {
    //setWrongType("")
    //setWrongMsg(``)
    resetNoPersistentState();
    setIsAdvQRcode(false);
    setIsAdvScanning(false);
    setIsDirectResultCapture(false);
    resetCurrentAdvTestDataState();
  };
  const captureChild = () => {
    //Reset the errors when done
    // setWrongType("")
    // setWrongMsg(``)
    resetNoPersistentState();
    if (advSamples[scanningForPos]) {
      capture();
    } else {
      capture();
      transferState();
      resetCurrentAdvTestDataState();
    }
  };

  return (
    <>
      {/* <button onClick={TestSampleScanInput} >Test Sample</button> */}
      <div className="flex flex-col justify-self-center self-center">
        <div className="my-0 mx-auto border-2.5 border-[#333] relative">
          <Video
            isQRCode={isQRCode}
            videoStyle={{
              minHeight: "60.34vh",
              maxHeight: "60.34vh",
              maxWidth: "46.51vw",
              minWidth: "46.51vw",
            }}
          />
          <div className="border-transparent absolute top-0 z-[100] w-full h-full grid border-t-[16vh] border-b-[16vh] border-l-[14.4vw] border-r-[14.4vw]">
            <div className="w-full">
              <div
                style={{
                  transform: "scale(0.35)",
                  position: "absolute",
                  left: "-20vh",
                  top: "-20vh",
                }}
              >
                <svg
                  style={{ margin: "0 auto" }}
                  width="511"
                  height="507"
                  viewBox="0 0 511 507"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="249" width="12" height="181" fill={`${color}`} />
                  <rect
                    x="249"
                    y="326"
                    width="12"
                    height="181"
                    fill={`${color}`}
                  />
                  <rect
                    x="330"
                    y="257"
                    width="12"
                    height="181"
                    transform="rotate(-90 330 257)"
                    fill={`${color}`}
                  />
                  <rect
                    y="257"
                    width="12"
                    height="181"
                    transform="rotate(-90 0 257)"
                    fill={`${color}`}
                  />
                </svg>
              </div>
              {/*
                      <>
                     <svg className="!m-[-1.4vw] " version="1.0" xmlns="http://www.w3.org/2000/svg" style={{width:"5vw"}}
                       viewBox="0 0 220.000000 213.000000"
                           preserveAspectRatio="xMidYMid meet">

                          <g transform="translate(0.000000,213.000000) scale(0.100000,-0.100000)"
                          fill={`${color}`} stroke="none">
                          <path d="M534 2115 c-263 -71 -468 -293 -520 -563 -18 -96 -21 -1430 -3 -1465
                          38 -75 150 -77 191 -4 10 17 14 190 18 743 l5 721 43 87 c57 115 123 181 238
                          238 l87 43 746 5 c790 5 772 4 805 52 30 42 11 136 -29 152 -9 3 -357 6 -773
                          5 -608 0 -767 -3 -808 -14z"/>
                          </g>
                          </svg>
                          <svg className="!m-[-1.4vw] absolute bottom-[0]" version="1.0" xmlns="http://www.w3.org/2000/svg"  style={{width:"5vw"}}
                            viewBox="0 0 213.000000 220.000000"
                            preserveAspectRatio="xMidYMid meet">

                            <g transform="translate(0.000000,220.000000) scale(0.100000,-0.100000)"
                            fill={`${color}`} stroke="none">
                            <path d="M38 2144 c-15 -8 -30 -25 -33 -37 -3 -12 -4 -368 -3 -792 l3 -770 33
                            -81 c94 -235 296 -403 538 -450 61 -11 205 -14 760 -14 734 0 727 0 754 49 15
                            29 12 93 -6 119 -33 48 -17 47 -780 52 l-721 5 -85 42 c-114 57 -184 127 -241
                            241 l-42 85 -5 746 c-4 573 -8 751 -18 768 -29 52 -98 68 -154 37z"/>
                            </g>
                            </svg>
                            <svg className="!m-[-1.4vw] absolute right-[0] top-[0]" version="1.0" xmlns="http://www.w3.org/2000/svg"  style={{width:"5vw"}}
                            viewBox="0 0 219.000000 214.000000"

                                preserveAspectRatio="xMidYMid meet">

                                <g transform="translate(0.000000,220.000000) scale(0.100000,-0.100000)"
                                 fill={`${color}`} stroke="none">
                                <path d="M78 2184 c-35 -19 -48 -43 -48 -91 0 -42 19 -76 53 -95 17 -10 190
                                -14 743 -18 l721 -5 85 -42 c102 -51 180 -124 227 -214 62 -115 61 -98 61
                                -864 0 -449 4 -713 10 -737 27 -94 155 -108 199 -21 8 15 11 229 11 733 0 771
                                -1 789 -56 925 -88 217 -296 386 -530 431 -113 21 -1436 20 -1476 -2z"/>
                                </g>
                            </svg>
                            <svg className="!m-[-1.4vw] absolute bottom-[0] right-[0]" version="1.0" xmlns="http://www.w3.org/2000/svg"  style={{width:"5vw"}}
                          viewBox="0 0 220.000000 214.000000"
                            preserveAspectRatio="xMidYMid meet">

                            <g transform="translate(0.000000,214.000000) scale(0.100000,-0.100000)"
                            fill={`${color}`} stroke="none">
                            <path d="M2032 2094 c-48 -33 -47 -17 -52 -780 l-5 -721 -42 -85 c-51 -102
                            -124 -180 -214 -227 -115 -62 -98 -61 -864 -61 -449 0 -713 -4 -737 -10 -94
                            -27 -108 -155 -21 -199 15 -8 229 -11 733 -11 771 0 789 1 925 56 167 68 316
                            216 387 385 57 135 58 157 58 905 0 734 0 727 -49 754 -29 15 -93 12 -119 -6z"/>
                            </g>
                            </svg>
                            </>
                            */}
            </div>
          </div>
          <div className="absolute bottom-8 z-[100] w-full text-center scanText">
            Scan in a well lit environment.
          </div>
          {/* <div className="absolute bottom-2 z-[100] w-full">
                <img src="images/CameraSwap.svg" alt="switch-camera" className="relative !mx-auto !w-[3.73vw] mb-[3.73vh] " onClick={handleFacingModeToggle} />
                </div> */}
        </div>
        <button
          className="absolute bottom-[5.21vh] left-[3.44vw]  confirmBtn t-24  backbtn"
          onClick={handleCloseChild}
        >
          Back
        </button>
        <Button
          className="absolute bottom-[5.21vh] right-[3.44vw] confirmBtn t-24 "
          disabled={
            !isDirectResultCapture &&
            (wrongType !== SCAN_ERRORS["NONE"] ||
              wrongTestPanelType !== SCAN_ERRORS["NONE"]) &&
            advSamples[scanningForPos] &&
            advSamples[scanningForPos].length > 0
          }
          onClick={captureChild}
        >
          {advTestPanelID[scanningForPos] || currentAdvTestPanelID
            ? "Done"
            : "Skip"}
        </Button>
      </div>
    </>
  );
};

export default AdvScanSample;
