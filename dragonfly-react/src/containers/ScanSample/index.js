import React, {
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import { Button, Modal } from "semantic-ui-react";
import SampleDetectedScreen from "../../components/SampleDetectedScreen";
import { useUIStore } from "../../store/ui";
import axios from "axios";
import shortid from "shortid";
import { useSelector } from "react-redux";
import { useTestDataStore } from "../../store/testData";
import {
  Dummy_Token,
  VALID_RESULTS,
  ADV_TIMER_FOR_SCAN,
} from "../../constants";
import { useSampleStore } from "../../store/samples";
import { useAdvTestDataStore } from "../../storeAdv/advTestData";
import { useAdvUiStore } from "../../storeAdv/advUi";
import { useAdvTimerStore } from "../../storeAdv/advTimers.js";
import { useHeaterStore } from "../../store/heaterStore.js";
import ManualSelectValue from "../../components/ManualSelectValue";
import { IncubationContext } from "../../context/incubationTimer";
import { secondsToTime, checkForExpiryHelper, checkForExpiryYYMMDDHelper } from "../../helpers";
import Video from "../../components/Video";
import { useWarningsStore } from "../../store/warnings";
//Following scandit library is only for dev purposes
// import ScanditBarcodeScanner from "scandit-sdk-react"
// import { ScanSettings, Barcode } from "scandit-sdk"

const ScanSample = ({
  openCameraByDefault = true,
  printQrCodeOutput = () => {},
  isQRCode,
  handleOpenScanner,
}) => {
  const uiState = useUIStore();
  const [color, setColor] = useState("white");
  const [val, setVal] = useState();
  const [isConfirmPopUp, setisConfirmPopUp] = useState(false)
  //const [scannerReady, setScannerReady] = useState(false)
  const {
    hasCaptureSampleScreen,
    setHasCaptureSampleScreen,
    setIsQRcode,
    isWrongSample,
    setIsWrongSample,
    setShouldDisplayId,
  } = uiState;
  const { setScannedData, scannedTestPanelId} = useTestDataStore();
  const { scanningId, samplePos, removeVoidSample } = useSampleStore();
  const {
    activeTimer,
    pauseTimer,
    timerForSamplePos,
    incubationTimer,
    removeTimerForSamplePos,
  } = useAdvTimerStore();
  const {
    advSamplePrepKit,
    advTestPanelID,
    image64,
    removeAdvTestData,
    advSerialNo,
    advLotNo,
    currentSampleDetectionState,
    setCurrentSampleDetectionState,
    advPrepKitExpDate,
    advTestPanelExpDate
  } = useAdvTestDataStore();

  const { removeHeaterID, begSamples } = useHeaterStore();
  const canvasCamera = useRef(null);
  const [cropImage, setCropImage] = useState(
    "data:image/png;base64,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"
  );

  const { setCommentMsg, commentMsg, isCommentFlagged, setIsCommentFlagged } =
    useAdvUiStore();
  const [algorithm, setAlgorithm] = useState([1, 1, 1, 1, 1, 1, 1, 1]);
  // const [msg, setMsg] = useState('error function not called')
  // const { OffResultSave, setOffResultSave } = useDashboard()
  const { isDetected, setIsDetected, setIsManualOverride } =
    useAdvUiStore();
  const [resultbreak, setResultBreak] = useState([]);
  const [res, setRes] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);
  const [isManualInput, setManualInput] = useState(false);
  const {
    hasTimeElapsed,
    setHasTimeElapsed,
    setUnloadBeforeTime,
    setNoScannedImage,
  } = useContext(IncubationContext);
  const { sampleFlag, removeFlagWarning, sampleHeatingtimeExpired, removeHeatingTimeWarning } = useWarningsStore();

  const generateResultBreak = (respArr) => {
    Object.keys(respArr).map(function (key, index) {
      setResultBreak((prev) => {
        return { ...prev, [key]: respArr[key] };
      });
      return null;
    });
  };
  const [sampleDetectionState, setSampleDetectionState] = useState([]);
  const { userInfo } = useSelector((state) => state.logIn);

  // Following code is for scandit for development purposes
  /*
	const getScanSettings = () => {
		return new ScanSettings({ enabledSymbologies: [Barcode.Symbology.DATA_MATRIX, Barcode.Symbology.GS1_DATABAR, Barcode.Symbology.CODE128] });
	}
		const scanlicense ="AZNB5ArlK87XG0dLNUC3fq0UzbCfDa9b/QhO53dQroGcSkJPWXfWHqYytD31W9unG3krdFBdENnLZzdTQwT3JW16IY2xVw64jQjRYJNMI396fYIao2tNF4UOhTgQEaAYhg+HgcMGo0nhWcVdfGZT5lJuRfWHMp1IndhXYccjFgpBNZVTXHLFrMBg4Sdb0XruyVDwMbkTMh4dTKulklerTUQTWP3JJKPoJNlKlLBgdvHnIbGy0mucqnGOAmtS5AryzlBzqf78iLTYUEgH8DsukIb6H+Qov2PH4anqfNscT2nSA5kDQNfaUlZ6Lyp3Z0KGizZSUUuICIw8s0ptJXKjoGA0GxeBHnCKNSR9b6bK4Il6UOK5BdhBtIsurRHEOlzlK7u1XXTzzsBoQOhxm/oAgsMFUQHBwTKHwMIMk2/RAe9TrlKw+ood1RDEnAUPeEXBaSGe9WpjtyHqDSMcm2DB0C1XpjzbSTNbPngouC1rX+GEUUGFq20/xZywQ67r3CSG7aH9HXBY5jMnTHK/F+/CM5gDwX9Ox0wHXUVmFCrvc2PYUYwmOEXMip4lrllguGv6Umf8ihhyAdTX+biY7vx+t248tne6YtZM+JI4w8Nqm+dvMr+B9o/HHw/ahPHv6DwBJIWDrNbyeRy1eoeYrn4184tnNzyZVmRaLxWqeyyDHFawttCaD31Sar1Y4LbOTZ5tIVDdopj24EsqeLR9a9rzw7+X0PXXiB59AIy0EnL57OiOeNQbUouthccdkyDmnaXtiMye7kSe0F8KtzjqXAvgiFVl7EB1AQQ0dQ42uf2DV8OX9q7kBC1KVQx3nTdNd0mUeBNaT6M="
	*/

  const displayTimer = (timerStatus) => {
    let timer = secondsToTime(timerStatus);
    return `${timer.m}:${timer.s}`;
  };

  const submitDataToApi = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-AuthorityToken": "auth-wpf-desktop",
        "X-AccessToken": userInfo ? userInfo.auth0_user_id : Dummy_Token,
      },
    };
    const stepsTimerData = {
      lysistime: 30,
      washtime: 30,
      drytime: 30,
      elutetime: 30,
    };
    const timerData = {
      totalelapsedtime: timerForSamplePos[scanningId]
        ? displayTimer(
            activeTimer - timerForSamplePos[scanningId].timerInsertedAt
          )
        : "null",
      heatingtime: incubationTimer[scanningId],
    };
    const loactionData = {
      long: "",
      lat: "",
    };
    // const invalidResultBreak = {
    // 	'Influenza A': false,
    // 	'Influenza B': false,
    // 	RSV: false,
    // 	'Rhino Virus': true,
    // 	'Sars-Cov-2': false,
    // }
    const resultbreakdata = resultbreak;

    let comment_msg = commentMsg.replace(/(\r\n|\n|\r)/gm, " "); //replacing new line in text area
    comment_msg = comment_msg.replace(",", ";");

    let sampleflag = false;
    let heatingexpired = false;
    let prepkitexpired = checkForExpiryYYMMDDHelper(advPrepKitExpDate[scanningId]);
    let testpanelexpired = checkForExpiryHelper(advTestPanelExpDate[scanningId]);
    if(sampleFlag[scanningId]){
      sampleflag = true;
    }
    if(sampleHeatingtimeExpired[scanningId]){
      heatingexpired = true;
    }

    const data = {
      id: userInfo ? userInfo.id : "",
      mac_address: userInfo ? userInfo.mac_address : "",
      user_name: userInfo ? userInfo.name : "",
      org_id: userInfo ? userInfo.org_id : "",
      heaterchosen: "A",
      user_id: userInfo ? userInfo.id : "",
      testerId:
        typeof advTestPanelID[scanningId] !== "undefined"
          ? advTestPanelID[scanningId]
          : shortid.generate(),
      serialNo: advSerialNo[scanningId],
      sampleID: begSamples[scanningId],
      prepKitID: advSamplePrepKit[scanningId],
      lotNo: advLotNo[scanningId],
      result: algorithm.length !== 0 ? algorithm.toString() : "0,0,0,0,0,0,0,0",
      invalid: isInvalid,
      image: image64,
      loaction: loactionData,
      comments: comment_msg,
      error: isCommentFlagged,
      uploadtime: "",
      mode: "guided",
      flag: sampleflag,
      heatingexpired: heatingexpired,
      prepkitexpired: prepkitexpired,
      testpanelexpired: testpanelexpired,
      ...resultbreakdata,
      ...stepsTimerData,
      ...timerData,
    };
    // https://reqres.in/api/users
    // https://api.anuparamanu.xyz/api/v1/results
    axios
      .post(process.env.REACT_APP_SERVER_BASE_URL + "/addresult", data, config)
      .then((response) => console.log(response))
      .catch(function (error) {
        if (error.toJSON().message === "Network Error") {
          console.log("Network error happend");
        }
         //console.log(JSON.stringify({ data, config }));

        if (window.NativeDevice) {
          window.NativeDevice.insertDataToDb(JSON.stringify({ data, config }));
        }
      });

		setCommentMsg('')
		setIsCommentFlagged(false)
		setHasTimeElapsed(false)
		setUnloadBeforeTime(false)
	}
	//   useEffect(
	//     () => {
	//       submitDataToApi()
	//     },

	//     [isDetected]
	//   );
	// const setSample = () => {

  //     setAlgorithm([1,1,1,1,1,1,1,1])
  //     const multiplexResponse = calculateResult(algorithm)
  //     setSampleDetectionState(multiplexResponse)
  //     console.log(sampleDetectionState)
  const handleRemoveSample = (id) => {
    removeHeaterID(samplePos[id]);
    removeTimerForSamplePos(id);
    removeAdvTestData(id);
    removeVoidSample(id);
  };

  // setIsDetected(true)
  // }

  // useEffect(
  //     () => {
  //       let timer1 = setTimeout(() => setSample() , 2 * 1000);

  //       return () => {
  //         clearTimeout(timer1);
  //       };
  //     },

  //     [isDetected]
  //   );
  useEffect(() => {
    !isQRCode ? setIsQRcode(true) : setIsQRcode(false);
    !isQRCode ? setIsManualOverride(true) : setIsManualOverride(false); //overriding
    if (typeof begSamples[scanningId] !== "undefined" && !isQRCode) {
      if (begSamples[scanningId].length > 0) {
        //if sample is not removed yet
        setSampleDetectionState(currentSampleDetectionState);
      }
      if (hasTimeElapsed) {
        //if over 35 minutes
        setIsCommentFlagged(true);
        if (commentMsg === "") {
          setCommentMsg(
            "Warning: Incubation time was over 35 minutes. Use caution interpreting the results."
          );
          setIsCommentFlagged(true);
        }
      }
      if (typeof incubationTimer[scanningId] !== "undefined") {
        if (incubationTimer[scanningId] < ADV_TIMER_FOR_SCAN && !isDetected) {
          if (commentMsg === "") {
            setCommentMsg(
              "Warning: Incubation was less than 25 minutes. Use caution interpreting the results."
            );
            setIsCommentFlagged(true);
            setUnloadBeforeTime(true);
          }
        }
      }
    }
  }, [hasCaptureSampleScreen]);

  useEffect(() => {
    setCurrentSampleDetectionState(sampleDetectionState);
  }, [sampleDetectionState]);

  //Code for scandit for development purposes
  /*
	const scanViaScandit = (response) => {
		//console.log(scannerReady)
		console.log(response)
		//window.qrCodeOutput(response)
	}*/

  window.qrCodeOutput = function (response) {
    setColor("green");
    printQrCodeOutput(response);
    setTimeout(() => setColor("white"), 2000);
  };
  window.dataMatrixOutPut = function (response) {
    // console.log(response);
  };

  //old code below
  /*
	const getZeroOccurrence = output => {
		var count = 0
		output.forEach(v => v === 0 && count++)
		return count
	}
	const checkForAbsDifference = algorithm => {
		for (let outerIndex = 0; outerIndex < algorithm.length; outerIndex++) {
			for (
				let innerIndex = 0;
				innerIndex < algorithm.length;
				innerIndex++
			) {
				if (
					Math.abs(algorithm[outerIndex] - algorithm[innerIndex]) > 20
				) {
					return true
				}
			}
		}
		return false
	}

	const checkForCovid = sample => {
		if (sample[0] < 0 && sample[1] < 0 && sample[3] < 0) {
			if (sample[2] < 30 && sample[4] < 30) {
				return true
			}
		}
		return false
	}
	*/

  const calculateResult = (sample) => {
    if (sample.length === 0) {
      return;
    }
    var response = {};
    var respArr = [];
    var obj = {};
    obj["controls"] = false;
    if (advTestPanelID[scanningId] && advTestPanelID[scanningId] === "100040") {
      if (sample[2] === 0 && sample[3] === 0 && sample[0] !== 0) {
        //Valid result
        //if(sample[0] != 0){ //Reference available assumption
        setIsInvalid(false);
        if (sample[1] === 0) {
          //Covid positive
          response.sampleName = "OPXV";
          response.status = VALID_RESULTS["DETECTED"];
        } else if (sample[1] === 1) {
          response.sampleName = "OPXV";
          response.status = VALID_RESULTS["NOT_DETECTED"];
        } else {
          response.sampleName = "OPXV";
          response.status = VALID_RESULTS["EMPTY"];
        }
        respArr.push(response);
        if (response.status === VALID_RESULTS["DETECTED"]) {
          obj["covid"] = true;
        } else {
          obj["covid"] = false;
        }
        obj["controls"] = false;
        generateResultBreak(obj);
        response = {};
      } else {
        response.sampleName = "Controls";
        response.status = VALID_RESULTS["EMPTY"];
        respArr.push(response);
        obj["controls"] = true;
        generateResultBreak(obj);
        response = {};
      }
    } else {
      if (sample[6] === 0 && sample[7] === 0 && sample[0] !== 0) {
        //Valid result
        //if(sample[0] != 0){ //Reference available assumption
        setIsInvalid(false);
        if (sample[1] === 0) {
          //Covid positive
          response.sampleName = "OPXV";
          response.status = VALID_RESULTS["DETECTED"];
        } else if (sample[1] === 1) {
          response.sampleName = "OPXV";
          response.status = VALID_RESULTS["NOT_DETECTED"];
        } else {
          response.sampleName = "OPXV";
          response.status = VALID_RESULTS["EMPTY"];
        }
        respArr.push(response);
        if (response.status === VALID_RESULTS["DETECTED"]) {
          obj["covid"] = true;
        } else {
          obj["covid"] = false;
        }

        response = {};

        if (sample[2] === 0) {
          //FluA positive
          response.sampleName = "MPXV I/II";
          response.status = VALID_RESULTS["DETECTED"];
        } else if (sample[2] === 1) {
          response.sampleName = "MPXV I/II";
          response.status = VALID_RESULTS["NOT_DETECTED"];
        } else {
          response.sampleName = "MPXV I/II";
          response.status = VALID_RESULTS["EMPTY"];
        }
        if (response.status === VALID_RESULTS["DETECTED"]) {
          obj["influenzaA"] = true;
        } else {
          obj["influenzaA"] = false;
        }

        respArr.push(response);
        response = {};

        if (sample[3] === 0) {
          //FluB positive
          response.sampleName = "VZV";
          response.status = VALID_RESULTS["DETECTED"];
        } else if (sample[3] === 1) {
          response.sampleName = "VZV";
          response.status = VALID_RESULTS["NOT_DETECTED"];
        } else {
          response.sampleName = "VZV";
          response.status = VALID_RESULTS["EMPTY"];
        }
        if (response.status === VALID_RESULTS["DETECTED"]) {
          obj["influenzaB"] = true;
        } else {
          obj["influenzaB"] = false;
        }

        respArr.push(response);
        response = {};

        if (sample[4] === 0) {
          //RSV positive
          response.sampleName = "HSV 1";
          response.status = VALID_RESULTS["DETECTED"];
        } else if (sample[4] === 1) {
          response.sampleName = "HSV 1";
          response.status = VALID_RESULTS["NOT_DETECTED"];
        } else {
          response.sampleName = "HSV 1";
          response.status = VALID_RESULTS["EMPTY"];
        }
        if (response.status === VALID_RESULTS["DETECTED"]) {
          obj["rsv"] = true;
        } else {
          obj["rsv"] = false;
        }

        respArr.push(response);
        response = {};

        if (sample[5] === 0) {
          //RSV positive
          response.sampleName = "HSV 2";
          response.status = VALID_RESULTS["DETECTED"];
        } else if (sample[5] === 1) {
          response.sampleName = "HSV 2";
          response.status = VALID_RESULTS["NOT_DETECTED"];
        } else {
          response.sampleName = "HSV 2";
          response.status = VALID_RESULTS["EMPTY"];
        }
        if (response.status === VALID_RESULTS["DETECTED"]) {
          obj["rhino"] = true;
        } else {
          obj["rhino"] = false;
        }

        respArr.push(response);
        generateResultBreak(obj);
        response = {};
      } else {
        if (sample[6] === VALID_RESULTS["EMPTY"]) {
          response.sampleName = "Controls";
          response.status = VALID_RESULTS["EMPTY"];
          respArr.push(response);
        } else if (sample[7] === VALID_RESULTS["EMPTY"]) {
          response.sampleName = "Controls";
          response.status = VALID_RESULTS["EMPTY"];
          respArr.push(response);
        } else {
          response.sampleName = "Controls";
          response.status = VALID_RESULTS["EMPTY"];
          respArr.push(response);
        }
        obj["controls"] = true;
        generateResultBreak(obj);
        response = {};
      }
    }
    setSampleDetectionState(respArr);
    return respArr;
  };
  window.algoritmOutput = function (response) {
    var val = JSON.parse(response);
    var noinput = false;
    //conditions for returning if no data matrix
    if (typeof val === "undefined") {
      return;
    }
    if (val === null) {
      return;
    }
    if (typeof val.datamatrix === "undefined") {
      return;
    }
    if (val.datamatrix === "") {
      return;
    }

		const { algorithm = [] } = val.result
		//check value of response here.. if it is null or undefined set it to (1,1,1,1,1,1,1,1
		if(typeof(algorithm) === 'undefined'){
			noinput = true
			//setAlgorithm([1,1,1,1,1,1,1,1])
		}else if(algorithm.length === 0){
			noinput = true
			//setAlgorithm([1,1,1,1,1,1,1,1])
		}else if(algorithm === null){
			noinput = true
			//setAlgorithm([1,1,1,1,1,1,1,1])
		}
		setVal(response)
		var sno = val.datamatrix.replace(/ /g, '')
		setRes(sno)
		setScannedData(sno.slice(0, 6), sno.slice(6))
		// setHasTimeElapsed(false)
		// setUnloadBeforeTime(false)
		setNoScannedImage(false)
		setIsManualOverride(false)

    if (sno) {
      if (
        !(
          advTestPanelID[scanningId] === sno.slice(0, 6) &&
          advSerialNo[scanningId] === sno.slice(6)
        )
      ) {
        setIsWrongSample(true);
        setColor("red");
        return;
      } else {
        setColor("green");
        if (noinput === true) {
          setAlgorithm([1, 1, 1, 1, 1, 1, 1, 1]);
        } else {
          setAlgorithm(algorithm);
        }
        setCropImage(val.image);
        let multiplexResponse = null;
        if (noinput === true) {
          multiplexResponse = calculateResult([1, 1, 1, 1, 1, 1, 1, 1]);
        } else {
          multiplexResponse = calculateResult(algorithm);
        }

        setSampleDetectionState(multiplexResponse);
        //Pause the incubation timer here
        pauseTimer(scanningId, activeTimer);

        /*setSampleDetectionState(prev => [
					...prev,
					{
						sampleName: "Sars-Cov2",
						status: covidResponse
					}
				])*/

        /*const covidResponse = checkForCovid(algorithm)
				setSampleDetectionState(prev => [
					...prev,
					{
						sampleName: "Sars-Cov2",
						status: covidResponse
					}
				])*/

        setButtonActive(true);
        setManualInput(true);
        // stopCamera()
      }
    }
    setTimeout(() => setColor("white"), 2000);
    // setIsDetected(true);
    //}
    // const zeroCount = getZeroOccurrence(algorithm);

    // Algo Logic
    // if(zeroCount >= algorithm.length - 1) {
    //     setIsDetected(true);
    //     setDetectionMessage("Detected")
    // }
    // else {
    //     setIsDetected(true);
    //     setDetectionMessage("Not Detected")
    // }
    // if(zeroCount >= algorithm.length - 2) {
    //     alert("Not Detected")
    //     return;
    // }
    // const isDetected = checkForAbsDifference(algorithm.filter(item => item > 0))
    // if(isDetected) {
    //     alert("Sample Detected")
    // }
  };
  const handleScannerClose = () => {
    if (isManualInput) {
      calculateResult(algorithm);
    }

    if (isDetected) {
      setIsWrongSample(false);
      submitDataToApi();
      setSampleDetectionState([]);
      setAlgorithm([]);
      setIsDetected(false);
      setIsQRcode(false);
      handleOpenScanner(false);
      setHasCaptureSampleScreen(false);
      setShouldDisplayId(true);
      //setScanningId(true, scanningId) //Complete the test here
      handleRemoveSample(scanningId);
      // stopCamera()
      setScannedData("", ""); //removing the previous data

      //Removing warnings here
      if(sampleFlag[scanningId] == true){
        removeFlagWarning(scanningId);
      }
      if(sampleHeatingtimeExpired[scanningId] == true){
        removeHeatingTimeWarning(scanningId);
      }
      // removeHeaterID(samplePos[scanningId])
      // removeTimerForSamplePos(scanningId)
      // removeAdvTestData(scanningId)
      // setConfirmPopup(false)
      // setHeaterInfoPopUp(false)
      // removeVoidSample(scanningId)
    } else {
      // stopCamera()
      setIsDetected(true);
    }
  };
  //  {
  //      result:[],
  //      error:Boolean,
  //      testPanelId:""

  //  }

  const handleManualValue = (v) => {
    setIsWrongSample(false);
    // console.log(v,"called")
    setAlgorithm(v);
  };
  const handleBack = () => {
    setShouldDisplayId(true);
    setSampleDetectionState([]);
    setAlgorithm([]);
    setIsDetected(false);
    setIsQRcode(false);
    setIsWrongSample(false);
    handleOpenScanner(false, false);
    setScannedData("", "");
    setButtonActive(false);
    setIsCommentFlagged(false);
    setCommentMsg("");
    setHasTimeElapsed(false);
    setUnloadBeforeTime(false);
    setNoScannedImage(false);
    setIsManualOverride(false);
  };

  const handlerescan = () => {
    setisConfirmPopUp(false);
    setIsWrongSample(false);
    // alert("here1")
    setManualInput(false);
    // alert("here2")
    setIsDetected(false);
    // alert("here3")
    setIsQRcode(false);
    // alert("here4")
    setScannedData("", "");
    // alert("here5")
    setButtonActive(false);
    //setIsCommentFlagged(false)
    //setCommentMsg("")
    // alert("here6")
    //startCamera()
  };

  //old code below
  const handleManualInput = (value) => {
    //value ? stopCamera() : startCamera()
    if (!isDetected) {
      pauseTimer(); //stop timer here
      setNoScannedImage(true);
      setCommentMsg(
        "Warning: No image captured. Colour observations manually entered from incubated Test Panel"
      );
      setIsCommentFlagged(true);
    }
    setButtonActive(true);
    setManualInput(value);
  };

  //code below if for development purposes

  const TestScan = () => {
    window.algoritmOutput(
      '{"result":"","image":"data:image/png;base64,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","error":"","datamatrix":"100040317900345"}'
    );
  };

  return (
    <>
      {/* <button onClick={TestScan}>testScan</button> */}

			{isDetected && !isQRCode ? (
				<>
					<SampleDetectedScreen
						sampleDetectionState={sampleDetectionState}
						sampleId={scanningId}
						testPanelId={advTestPanelID[scanningId]}
					/>
					<div
						className='flex justify-between absolute bottom-[0] w-full'
						style={{ alignItems: 'flex-end', maxHeight: '7.25vh' }}
					>
						<Button
							className=' relateive !z-[100] confirmBtn t-24 l-space-2'
							size='mini'
							style={{ maxWidth: '13.02vw', maxHeight: '5.04vh' }}
							positive
							onClick={handlerescan}
						>
							{(sampleDetectionState && sampleDetectionState.length > 0 && !isManualInput) ? "Back" : "Recapture"}
						</Button>
						<Button
							className='relateive !z-[100] confirmBtn t-24 l-space-2'
							size='mini'
							style={{ maxWidth: '13.02vw', maxHeight: '5.04vh' }}
							positive
							onClick={handleScannerClose}
						>
							Approve
						</Button>
					</div>
				</>
			) : (
				<>
					<div
						className='my-0 mx-auto  border-2.5 border-[#333] relative border-3rem'
						style={{
							minHeight: '67.82vh',
							maxHeight: '67.82vh',
							maxWidth: '100%',
							minWidth: '100%',
						}}
					>
						{!isManualInput ? (
							<>
								{/* (window.NativeDevice) ? //code for dev test */}
								<Video isQRCode={isQRCode} videoStyle={{
				          minHeight: '67.82vh',
				          maxHeight: '67.82vh',
				          maxWidth: '100%',
				          minWidth: '100%'}}/>
								{/* //code for dev test  :
								<ScanditBarcodeScanner
								   // Library licensing & configuration options (see https://docs.scandit.com/stable/web/globals.html#configure)
								   licenseKey={"Ae7xBGXlRA5qG6oY+AXzesYGJpDLDqt+5R92KZNrionRWE9oF3EoIzg8yuAqTglxJ1tauJVcQr5eSVOV+n1USRBf9w1fQfglmS2Gn459G3cOGQSpSnTTon5Le/RRafubQ0DkSkRHNY9yUP/ONC3d2z14CbICXpcnMlSKMeBsM/orVJgRJEgXpB5LTDuMRj6Evny5vcwuo4BLQQp0c1KP1RpLt7v4cZzO3lWpErtQmd+JRRXNgF10qX10DS9bUI75fX3DQKlKTLPiYm77dTTndLdXQIfvaRAa1ndp62NGFC6HRk3gJHC5YjhJ9rX2ZHZnKVsLVIhtivTEa8jhJ0gaditwvYR/axT8a1ITz3p3zZkgS4DwrC3SolxJvUYGHl3AuHfyzhtdp3MNYCDwSEqcBhpE7Y1mRZ8lrF5aHqRCV2lmc5NPZmB86zNrh4HEQClb2W7/Rg9/RGi9JFRDSHs+gyx9MEuQDC1+JUfhwwVtDw8FU/jiBHQg7gB/kLKbRl4lgj3yMVwD/Mq3DXZkwDfwJoLp9YWQ5smhGZUqlVHnl3agU0Up/VzM2c2tHQcBGececG8CL18dUXfh2ykrTZ7W6JHicngl5f5jPmJ+g+bULuBQgHct2KTqhlW3Qof2pHRn2/FiBXKKt4vTg9teBUjwrY8ZwpP0SVDKL490kBPj6Vde46hYQQErwwv7arXD0gr/ReVByqp37AKe/ZEBpTlSTlECVG7yjFkZMbvD4RsgDHiDrIUAa7DAyQF7xSoCp4DiyBMantrr7RR+8fXvnTMuw5ApphM3kfwJf7qSqo/tDquX+lU9Rutt2/4b5LWexsX8IAFSMQA77Wp1xF1npDUioi4WrTI0IlnpvmNpf/bcVeFokvHcIDuXS9p3Ppn4nTU6T7eL0VRQH4tkF5dWssc5Y7gTzg3Ovv6RUDopcpJOMpKceU63RzxqAulYewxY80+kNVV/qhQEnPB/cKBYC9yhTJmCSMC1YQY/j3W1ql7IgxxEd7gOUYYOGmMVzTMqTEcqBOInLcKV0QTVZZ2h78R/kcD2JrFlJmxLU0wlc4Ff5l2GRcZDKn9BE0guQpPBYaiSMK8j4sPJoManPns3O2jNyDhfdAM7HWz3oVBjzUUaINJDCh25DTPbJ6GuNJItxorHw5A0E6YY6qaVYTkhuVpM5zmk9gSSKRL05YeyojsliJDWKt8tII64/DxO+a8iipuP"}
								   engineLocation="https://cdn.jsdelivr.net/npm/scandit-sdk@5.x/build/" // could also be a local folder, e.g. "build"
								   // Picker events
								   onReady={() => setScannerReady(true)}
								   onScan={(e) => scanViaScandit(e)}
									 onSubmitFrame={(e) => scanViaScandit(e)}
										onProcessFrame={(e) => scanViaScandit(e)}
								   onScanError={console.log()}
								   // Picker options
								   scanSettings={getScanSettings()}
								 ></ScanditBarcodeScanner>
							  */}
                <div
                  style={{
                    minHeight: "67.82vh",
                    maxHeight: "67.82vh",
                    maxWidth: "100%",
                    minWidth: "100%",
                  }}
                  className={`absolute top-0 left-0 z-50 border-3rem border-transparent
                    ${
                      isQRCode
                        ? "" /* border-t-[16.26vh] border-b-[16.26vh] border-l-[25.65vw] border-r-[25.65vw] */
                        : "border-t-[13vh] border-b-[25vh] border-l-[13.5vw] border-r-[13.5vw] "
                    }`}
                >
                  <div
                    className={`${
                      isQRCode ? `w-full` /* !w-[21.35vw] */ : `!w-[45.73vw]`
                    }`}
                  >
                    {isQRCode ? (
                      <div style={{ transform: "scale(0.4)" }}>
                        <svg
                          style={{ margin: "0 auto" }}
                          width="511"
                          height="507"
                          viewBox="0 0 511 507"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="249"
                            width="12"
                            height="181"
                            fill={`${color}`}
                          />
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
                    ) : (
                      <>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <svg
                            style={{ display: "inline-flex" }}
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5.27273 40L5.27273 5.44601H40.0003V0H5.27273H0.000266337H1.69282e-06L0 40H5.27273Z"
                              fill={`${color}`}
                            />
                          </svg>
                          <svg
                            style={{ display: "inline-flex" }}
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0 0H34.7273H40V5.44601V40H34.7273L34.7273 5.44601H0V0Z"
                              fill={`${color}`}
                            />
                          </svg>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                          }}
                        >
                          <svg
                            style={{ display: "inline-flex" }}
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5.27273 0L5.27273 34.554H40.0003V40H5.27273H0.000266337H1.69282e-06L0 0H5.27273Z"
                              fill={`${color}`}
                            />
                          </svg>
                          <svg
                            style={{ display: "inline-flex" }}
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0 40H34.7273H40V34.554V0H34.7273L34.7273 34.554H0V40Z"
                              fill={`${color}`}
                            />
                          </svg>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-8 z-[100] w-full text-center scanText">
                  Scan in a well lit environment.
                </div>
                {/* <div className='absolute bottom-2 z-[100] w-full'>
									<img
										src='images/CameraSwap.svg'
										alt='switch-camera'
										className='relative !mx-auto !w-[3.73vw] mb-[3.73vh] '
										onClick={handleFacingModeToggle}
									/>
								</div> */}
              </>
            ) : (
              <ManualSelectValue
                cropImg={cropImage}
                isCovid={
                  advTestPanelID[scanningId] &&
                  advTestPanelID[scanningId] === "100040"
                }
                value={algorithm}
                setValue={handleManualValue}
                sampleValue={scanningId}
              />
            )}
          </div>

          <canvas
            ref={canvasCamera}
            style={{
              maxWidth: openCameraByDefault ? 0 : "100%",
              maxHeight: openCameraByDefault ? 0 : "67.82vh",
              visibility: openCameraByDefault ? "hidden" : "visible",
            }}
          ></canvas>
        </>
      )}

      {/* REMOVE LATER */}

      {!isQRCode && !isDetected && (
        <>
          <div
            id="videoDisc"
            style={{
              minHeight: "15.21vh",

              alignItems: "flex-end",
              paddingTop: "1.39vh",
              lineHeight: "3.47vh",
            }}
          >
            <div id="stepcount">
              {!isManualInput ? "Result Capture" : "Result Interpretation"}
            </div>
            <div id="stepname" style={{ padding: "0px" }}>
              {/*TODO Text Change - Use appropriate flag*/}
              {isManualInput ? (
                "Tap each colour button to change the observed result from pink, yellow, or long press if it is empty."
              ) : (
                <span>
                  Align card with frame until image is captured and tag REF/SN
                  is confirmed.
                  <br />3 corner tags must be visible.
                </span>
              )}
            </div>
            {/* <div id="stepname" style={{padding:"0px"}}><div className="text-[20px]">Values: {JSON.stringify(algorithm)}</div></div> */}
          </div>

          <div
            className="flex justify-between absolute bottom-[0] w-full"
            style={{ alignItems: "flex-end", maxHeight: "7.25vh" }}
          >
            <Button
              className="relateive !z-[100] confirmBtn t-24 l-space-2"
              size="mini"
              style={{ maxWidth: "13.02vw", maxHeight: "5.04vh" }}
              positive
              onClick={
                !isDetected && isManualInput && !isQRCode
                  ? handlerescan
                  : handleBack
              }
            >
              {isManualInput ? "Recapture" : "Back"}
            </Button>
            {!isWrongSample && !isManualInput ? (
              <>
                {/* <Button className="relateive !z-[100] confirmBtn t-24 l-space-2" size="mini" style={{ maxWidth: "13.02vw", maxHeight: "5.04vh" }} positive onClick={() => handleManualInput(!isManualInput)}>Manual</Button> */}
                {/* <Button className="relateive !z-[100] confirmBtn t-24 l-space-2" onClick={()=>setIsWrongSample(true)}>Wrong Sample</Button> */}
                <Button
                  className="relateive !z-[100] confirmBtn t-24 l-space-2"
                  size="mini"
                  style={{
                    maxWidth: "13.02vw",
                    maxHeight: "5.04vh",
                  }}
                  positive
                  disabled={false} /* !buttonActive */
                  onClick={() =>{

                    ((isManualInput)?
                    handleManualInput(!isManualInput):console.log());
                    setisConfirmPopUp(true)
                  }
                  }
                >
                  Confirm
                </Button>

                 <Modal
      open={isConfirmPopUp}
      className="!relative !w-[39.5vw] !h-[45.05vh] cancelModalBeg"
    >

     <div className="font-bold text-[2.5vh] max-w-2xl">
     Test Panel Tag not scanned.
     <div style={{ height: "3vh" }} />
                Please Confirm Tag REF/SN matches:
                <div style={{ height: "1.5vh" }} />
                REF: {advTestPanelID[scanningId]}
                <div style={{ height: "1.5vh" }} />
                SN:  {advSerialNo[scanningId]}
            </div>

		 <Modal.Actions className="!border-[0px]">
        <Button className="confirmBtn m-0 modalBtnLeft !w-[11.97vw] !h-[5.04vh]" onClick={()=>setisConfirmPopUp(false)}>
          Back
        </Button>
        <Button
          className="backbtn confirmBtn modalBtnRight !w-[11.97vw] !h-[5.04vh] "
          onClick={() => { handleManualInput(!isManualInput)}}
        >Confirm</Button>
      </Modal.Actions>
     </Modal>



              </>
            ) : (
              <Button
                className="relateive !z-[100] confirmBtn t-24 l-space-2"
                size="mini"
                style={{
                  maxWidth: "13.02vw",
                  maxHeight: "5.04vh",
                }}
                positive
                disabled={false}
                onClick={!isWrongSample ? handleScannerClose : handleBack}
              >
                Confirm
              </Button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default React.memo(ScanSample);
