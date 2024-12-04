import React, {
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import { Button } from "semantic-ui-react";
import { useUIStore } from "../../store/ui";
import {
  TIMER_FOR_STEPS,
  VALID_RESULTS,
  ADV_TIMER_FOR_SCAN,
  INCUBATION_TIME_ALERT_LIMIT,
} from "../../constants";
import { useAdvTestDataStore } from "../../storeAdv/advTestData";
import { useAdvSampleStore } from "../../storeAdv/advSample";
import { useSelector } from "react-redux";
import { useAdvSampleTimerStore } from "../../storeAdv/advSampleTimer";
import { useAdvTimerStore } from "../../storeAdv/advTimers";
import { CalculateDateFromJDay, secondsToTime, checkForExpiryHelper, checkForExpiryYYMMDDHelper } from "../../helpers";
import { useAdvUiStore } from "../../storeAdv/advUi";
import ManualSelectValue from "../../components/ManualSelectValue";
import { useAdvHeaterStore } from "../../storeAdv/advHeater";
import AdvSampleDetectedScreen from "../../components/AdvSampleDetectedScreen";
import { useTestDataStore } from "../../store/testData";
import { IncubationContext } from "../../context/incubationTimer";
import Video from "../../components/Video";
import ConfirmDetection from "../../components/ConfirmDetection";
import { checkForAlphanumeric } from "../../helpers";
import { useSampleStore } from "../../store/samples";
import { useWarningsStore } from "../../store/warnings";

const AdvTestTubeScanner = ({
  printQrCodeOutput = () => {},
  isQRCode,
  submitDataToApi,
  handleOpenScanner,
  setHeight,
}) => {
  const {
    hasTimeElapsed,
    setHasTimeElapsed,
    setNoScannedImage,
    noScannedImage,
    setTagMissing,
  } = useContext(IncubationContext);
  let timerId = useRef("");
  const { setScannedData, scannedTestPanelId, scannedSerialNo } =
    useTestDataStore();
  const uiState = useUIStore();
  const { hasCaptureSampleScreen, setIsQRcode } = uiState;
  const {
    activeTimer,
    incubationTimer,
    pauseTimer,
    timerForSamplePos,
    removeTimerForSamplePos,
  } = useAdvTimerStore();

  const {
    advSamplePrepKit,
    advTestPanelID,
    advSerialNo,
    advLotNo,
    removeAdvTestData,
    image64,
    setImage64,
    currentSampleDetectionState,
    setCurrentSampleDetectionState,
    advPrepKitExpDate,
    advTestPanelExpDate
  } = useAdvTestDataStore();
  const { AdvSampleTimerPos, removeTimerofSampleNo } = useAdvSampleTimerStore();
  const { scanningForPos, advSamplesPos, advSamples, removeSample } =
    useAdvSampleStore();
  const [algorithm, setAlgorithm] = useState([1, 1, 1, 1, 1, 1, 1]);
  const {
    isDetected,
    setIsDetected,
    isAdvQRcode,
    commentMsg,
    setCommentMsg,
    setIsCommentFlagged,
  } = useAdvUiStore();
  const [isManual, setIsManual] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [resultbreak, setResultBreak] = useState([]);
  // const [flashon, setFlashOn] = useState(false)
  const [color, setColor] = useState("white");
  const { allowExpiry } = useSampleStore();
  const [cropImage, setCropImage] = useState(
    "data:image/png;base64,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"
  );
  //const [focusVal, setFocusVal] = useState(1)
  const [isTimeoutError, setIsTimeoutError] = useState(false);
  const [isLowTimeoutError, setIsLowTimeoutError] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sampleDetectionState, setSampleDetectionState] = useState([]);
  const { userInfo } = useSelector((state) => state.logIn);
  const [testPanelExp, setTestPanelExp] = useState(false);

  const displayTimer = (timerStatus) => {
    let timer = secondsToTime(timerStatus);
    return `${timer.m}:${timer.s}`;
  };
  const generateResultBreak = (respArr) => {
    Object.keys(respArr).map((key, index)=>{
      setResultBreak((prev) => {
        return { ...prev, [key]: respArr[key] };
      });
      return null;
    });
  };

  const { sampleFlag, removeFlagWarning, sampleHeatingtimeExpired, removeHeatingTimeWarning } = useWarningsStore();

	const { setAdvHeater } = useAdvHeaterStore()
	const submitDataToApiChild = () => {
		// const config = {
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		'X-AuthorityToken': 'auth-wpf-desktop',
		// 		'X-AccessToken': userInfo ? userInfo.access_token : Dummy_Token,
		// 	},
		// }
		// const stepsTimerData = {
		// 	lysistime: AdvSampleTimerPos[scanningForPos]
		// 		? TIMER_FOR_STEPS -
		// 		  AdvSampleTimerPos[scanningForPos].LYSIS_1.timer
		// 		: 0, //default 0
		// 	washtime: AdvSampleTimerPos[scanningForPos]
		// 		? TIMER_FOR_STEPS -
		// 		  AdvSampleTimerPos[scanningForPos].WASH_1.timer
		// 		: 0, //default 0
		// 	drytime: AdvSampleTimerPos[scanningForPos]
		// 		? TIMER_FOR_STEPS -
		// 		  AdvSampleTimerPos[scanningForPos].DRY_1.timer
		// 		: 0, //default 0
		// 	elutetime: AdvSampleTimerPos[scanningForPos]
		// 		? TIMER_FOR_STEPS -
		// 		  AdvSampleTimerPos[scanningForPos].Elution_1.timer
		// 		: 0, //default 0
		// }

    const stepsTimerData = {
        lysistime:  AdvSampleTimerPos[scanningForPos].LYSIS_1.timestamp,
        washtime:  AdvSampleTimerPos[scanningForPos].WASH_1.timestamp,
        drytime:  AdvSampleTimerPos[scanningForPos].DRY_1.timestamp,
        elutetime:  AdvSampleTimerPos[scanningForPos].Elution_1.timestamp
      };
		const timerData = {
			totalelapsedtime: timerForSamplePos[scanningForPos]
				? displayTimer(
						activeTimer -
							timerForSamplePos[scanningForPos].timerInsertedAt
				  )
				: 'null',
			heatingtime: incubationTimer[scanningForPos],
		}
		const loactionData = {
			long: '',
			lat: '',
		}
		// const invalidResultBreak = {
		// 	'Influenza A': false,
		// 	'Influenza B': false,
		// 	RSV: false,
		// 	'Rhino Virus': true,
		// 	'Sars-Cov-2': false,
		// }
		const resultbreakdata = resultbreak

    //Handling for Direct Scan
    let scanPanelId = "";
    let scanSerialNo = "";
    if (
      advTestPanelID[scanningForPos] &&
      advTestPanelID[scanningForPos].length > 0
    ) {
      scanPanelId = advTestPanelID[scanningForPos];
    } else if (scannedTestPanelId !== "") {
      scanPanelId = scannedTestPanelId;
    } else {
      scanPanelId = ""; //not applicable
    }

    if (advSerialNo[scanningForPos] && advSerialNo[scanningForPos].length > 0) {
      scanSerialNo = advSerialNo[scanningForPos];
    } else if (scannedSerialNo !== "") {
      scanSerialNo = scannedSerialNo;
    } else {
      scanSerialNo = ""; //not applicable
    }

    if (noScannedImage) {
      setImage64(
        "data:image/png;base64,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"
      );
    }

    let sampleflag = false;
    let heatingexpired = false;
    if(sampleFlag[scanningForPos]){
      sampleflag = true;
    }
    if(sampleHeatingtimeExpired[scanningForPos]){
      heatingexpired = true;
    }
    let prepkitexpired = false;
    if(advPrepKitExpDate[scanningForPos]){
      prepkitexpired = checkForExpiryYYMMDDHelper(advPrepKitExpDate[scanningForPos]);
    }

    let testpanelexpired = false;
    if(advPrepKitExpDate[scanningForPos]){
      testpanelexpired = checkForExpiryHelper(advTestPanelExpDate[scanningForPos]);
    }else{
      testpanelexpired = testPanelExp;
    }

    const data = {
      id: userInfo ? userInfo.id : "",
      mac_address: userInfo ? userInfo.mac_address : "",
      org_id: userInfo ? userInfo.org_id : "",
      user_id: userInfo ? userInfo.id : "",
      heaterchosen: advSamplesPos[scanningForPos]
        ? String(advSamplesPos[scanningForPos]).slice(0, 1).toUpperCase()
        : "",
      testerId: scanPanelId,
      serialNo: scanSerialNo,
      sampleID: advSamples[scanningForPos],
      prepKitID: advSamplePrepKit[scanningForPos],
      lotNo: advLotNo[scanningForPos],
      result: algorithm.length !== 0 ? algorithm.toString() : "0,0,0,0,0,0,0,0",
      invalid: isInvalid,
      image: image64,
      loaction: loactionData,
      uploadtime: "",
      flag: sampleflag,
      heatingexpired: heatingexpired,
      prepkitexpired: prepkitexpired,
      testpanelexpired: testpanelexpired,
      ...resultbreakdata,
      ...stepsTimerData,
      ...timerData,
    };

    setScannedData("", "");
    submitDataToApi(data);
    removeScannedSample(scanningForPos);
    removeTimerForSamplePos(scanningForPos);
    setIsTimeoutError(false); //remove timeout error
    setIsLowTimeoutError(false);
    setIsCommentFlagged(false);
    setCommentMsg("");
    setNoScannedImage(false);
    setHasTimeElapsed(false);

    if(sampleFlag[scanningForPos] == true){
      removeFlagWarning(scanningForPos);
    }
    if(sampleHeatingtimeExpired[scanningForPos] == true){
      removeHeatingTimeWarning(scanningForPos);
    }
    //resetAdvTimerState()

    //Remove the current sample here

    //     axios.post('https://api.anuparamanu.xyz/api/v1/addresult', data,config)
    //     .then(response => console.log(response) )
    //     .catch(error => {

    //     console.error('There was an error!', error);

    // });
    // resetAdvSampleState()
    // resetAdvSampleTimerState()
    // resetAdvTestDataState()
    // resetAdvTimerState()
    // resetAdvHeaterState()
  };

  useEffect(() => {
      !isQRCode ? setIsQRcode(true) : setIsQRcode(false);
      if (isManual) setIsTimeoutError(false); //if moved to result remove error
      if (typeof advSamples[scanningForPos] !== "undefined" && !isQRCode) {
        if (advSamples[scanningForPos].length > 0) {
          //if sample is not removed yet
          var count = Object.keys(currentSampleDetectionState).length;
          if (count > 0) {
            setSampleDetectionState(currentSampleDetectionState);
          }
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
      }
  }, [hasCaptureSampleScreen]);

  useEffect(() => {
    setCurrentSampleDetectionState(sampleDetectionState);
  }, [sampleDetectionState]);

  useEffect(() => {
      setHeight(false);
      if (typeof incubationTimer[scanningForPos] !== "undefined") {
        if (incubationTimer[scanningForPos] < ADV_TIMER_FOR_SCAN && !isDetected) {
          setIsLowTimeoutError(true);
          if (commentMsg === "") {
            setCommentMsg(
              "Warning: Incubation was less than 25 minutes. Use caution interpreting the results."
            );
            setIsCommentFlagged(true);
          }
        }
      if (incubationTimer[scanningForPos] > INCUBATION_TIME_ALERT_LIMIT) {
        setHasTimeElapsed(true);
      }
      // if(incubationTimer[scanningForPos] > INCUBATION_TIME_ALERT_LIMIT){
      // 	setHasTimeElapsed(true)
      // }
    return () => {
      // console.log("unmount");
        clearTimeout(timerId.current);
      };

    }
  }, []);

  useEffect(() => {
    if (noScannedImage) {
      setIsCommentFlagged(true);
      setCommentMsg(
        "Warning: No image captured. Colour observations manually entered from incubated Test Panel"
      );
    }
  }, [noScannedImage]);

  window.qrCodeOutput = function (response) {
    setColor("green");
    printQrCodeOutput(response);
    setTimeout(() => setColor("white"), 2000);
  };
  window.dataMatrixOutPut = function (response) {
    console.log(response);
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
    var checkCovidScan = scannedTestPanelId === "100040" ? true : false;
    if (
      (advTestPanelID[scanningForPos] &&
        advTestPanelID[scanningForPos] === "100040") ||
      checkCovidScan
    ) {
      if (sample[2] === 0 && sample[3] === 0 && sample[0] !== 0) {
        //Valid result
        //if(sample[0] != 0){ //Reference available assumption
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
    // var val = response ? JSON.parse(response) : JSON.parse([1,1,1,1,1,1,1,1])
    var val = JSON.parse(response);
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

    clearTimeout(timerId.current);
    timerId.current = "";

    const { algorithm = [] } = val.result;
    let noinput = false;
    if (typeof algorithm === "undefined") {
      noinput = true;
      //setAlgorithm([1,1,1,1,1,1,1,1])
    } else if (algorithm.length === 0) {
      noinput = true;
      //setAlgorithm([1,1,1,1,1,1,1,1])
    } else if (algorithm === null) {
      noinput = true;
      //setAlgorithm([1,1,1,1,1,1,1,1])
    }

    var sno = val.datamatrix.replace(/ /g, ''); //remove spaces if any

    if (sno) {
      let panelpresent = false;
      let serialpresent = false;
      if (
        advTestPanelID[scanningForPos] &&
        advTestPanelID[scanningForPos].length > 0
      ) {
        panelpresent = true;
      }
      if (
        advSerialNo[scanningForPos] &&
        advSerialNo[scanningForPos].length > 0
      ) {
        serialpresent = true;
      }

      if (panelpresent && serialpresent) {
        //Ideal case
        if (
          !(
            advTestPanelID[scanningForPos] === sno.slice(0, 6) &&
            advSerialNo[scanningForPos] === sno.slice(6)
          )
        ) {
          setIsError(true);
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
          setScannedData(sno.slice(0, 6), sno.slice(6));
          //setHasTimeElapsed(false)
          setNoScannedImage(false);
          //removeTimerForSamplePos(scanningForPos)
          //resetAdvTimerState()
          let multiplexResponse = null;
          if (noinput === true) {
            multiplexResponse = calculateResult([1, 1, 1, 1, 1, 1, 1, 1]);
          } else {
            multiplexResponse = calculateResult(algorithm);
          }
          setSampleDetectionState(multiplexResponse);
          pauseTimer(scanningForPos, activeTimer);
          handleManualInput(true);
          setButtonActive(true);
          setIsExpired(false);
          setIsError(false);
        }
      } else {
        //Both serial and test panel not present
        //Ask user to add manual sample id
        //Check
        var expiryDate = CalculateDateFromJDay(
          parseInt(sno.slice(7, 10)),
          sno.slice(6, 7)
        );
        if(expiryDate > new Date()){
          setTestPanelExp(false);
        }else{
          setTestPanelExp(true);
        }
        var allow = false;
        if(!allowExpiry){
          if(expiryDate > new Date()){
            allow = true;
          }
        }else{
          allow = true;
        }
        if (allow) {
          setScannedData(sno.slice(0, 6), sno.slice(6));
          //removeTimerForSamplePos(scanningForPos)
          //setHasTimeElapsed(false)
          setNoScannedImage(false);
          //resetAdvTimerState()
          setColor("red");
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
          handleManualInput(true);
          setButtonActive(true);
          setIsExpired(false);
          setIsError(false);
          setIsTimeoutError(false); //Direct scan mode so not applicable
          //setIsLowTimeoutError(false)
        } else {
          setIsExpired(true);
          setIsError(true);
          setColor("red");
          return;
        }
      }
    }
    setTimeout(() => setColor("white"), 2000);
    setTimeout(() => setIsError(false), 2000);
    setTimeout(() => setIsExpired(false), 2000);
  };
  const handleManualInput = (v) => {
    setIsManual(v);
  };
  const handleManualValue = (v) => {
    setAlgorithm(v);
  };
  const handleScannerClose = () => {
    setSampleDetectionState([]);
    setAlgorithm([]);
    setIsQRcode(false);
    handleOpenScanner(false);
    setIsDetected(false);
  };

  const handleDetectionScreen = () => {
    setShowConfirmModal(false);
    handleManualInput(false);
    // calculateResult([1,1,1,1,1,0,0,0])
    //testing algorithm variable
    var noinput = false;

    if (typeof algorithm === "undefined") {
      noinput = true;
      //setAlgorithm([1,1,1,1,1,1,1,1])
    } else if (algorithm.length === 0) {
      noinput = true;
      //setAlgorithm([1,1,1,1,1,1,1,1])
    } else if (algorithm === null) {
      noinput = true;
      //setAlgorithm([1,1,1,1,1,1,1,1])
    }

    if (isManual) {
      if (noinput) {
        calculateResult([1, 1, 1, 1, 1, 1, 1, 1]);
      } else {
        calculateResult(algorithm);
      }
      setIsDetected(true);
    } else {
      setIsManual(true);
    }

    setIsTimeoutError(false);
    //setIsLowTimeoutError(false)

    // setIsDetected(true)
  };
  const handleCloseChild = () => {
    handleManualInput(false);
    handleOpenScanner();
    setScannedData("", "");
    setIsCommentFlagged(false);
    setNoScannedImage(false);
    setIsLowTimeoutError(false);
    setHasTimeElapsed(false);
    setTimeout(false);
    setTagMissing(false);
    setIsCommentFlagged(false);
    setCommentMsg("");
  };

  //old code
  /*
	const captureChild = () => {
		stopCamera()
		capture()
	}
	const addExtraTime = () => {
		removeFromAdvPopUp(scanningForPos, incubationTimer[scanningForPos])
		handleCloseChild()
	}
	*/
  const handleRescan = () => {
    setIsDetected(false);
    setScannedData("", "");
    setTagMissing(false);
    //setIsTimeoutError(false) //remove timeout error
    //setIsLowTimeoutError(false)
    //setIsCommentFlagged(false)
  };

  const removeScannedSample = (sampleNo) => {
    let c = String(advSamplesPos[sampleNo]);
    if (c !== "undefined") {
      let id = c.slice(0, 1);
      let row = c.slice(1);
      setAdvHeater(id, row, "");
    }
    setHasTimeElapsed(false);
    setNoScannedImage(false);
    removeSample(sampleNo);
    if (timerForSamplePos[sampleNo]) {
      removeTimerForSamplePos(sampleNo);
    }
    removeTimerofSampleNo(sampleNo);
    removeAdvTestData(sampleNo);
    // setIsCancelMsgModal(false, '')
  };

  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const triggerConfirmModal = () => {
    let scanpanelmissing = false;
    let scanserialmissing = false;

    if (isManual) {
      handleDetectionScreen();
      return;
    }

    if (scannedTestPanelId.length === 0) {
      scanpanelmissing = true;
    }
    if (scannedSerialNo.length === 0) {
      scanserialmissing = true;
    }

    let panelpresent = false;
    let serialpresent = false;
    if (
      advTestPanelID[scanningForPos] &&
      advTestPanelID[scanningForPos].length > 0
    ) {
      panelpresent = true;
    }
    if (advSerialNo[scanningForPos] && advSerialNo[scanningForPos].length > 0) {
      serialpresent = true;
    }

    if (
      scanpanelmissing &&
      scanserialmissing &&
      panelpresent &&
      serialpresent
    ) {
      //Ideal case
      setShowConfirmModal(true);
    } else {
      setShowConfirmModal(false);
      if (!scanpanelmissing && !scanserialmissing) {
        //scan happened
        handleDetectionScreen();
      } else {
        setNoScannedImage(true);
        setTagMissing(true);
        handleDetectionScreen();
      }
    }
  };

  //following code is for development purposes only

  const TestScan = () => {
    window.algoritmOutput(
      '{"result":"","image":"data:image/png;base64,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","error":"","datamatrix":"100051317900345"}' //317900345
    );
  };

  return (
    <div className="h-max z-20 bg-white w-full">
      {/* <Button onClick={TestScan}>Test</Button> */}
      {/* <p>Focus Value: {focusVal/10}</p>
			<input type="range" id="points" name="points" value={focusVal} onChange={(e) => setFocusVal(e.target.value)} min={1} max={10}></input> */}

      <>
        {isManual ? (
          <div className="flex justify-between" style={{ flexGrow: "1" }}>
            <div className="w-[72.65vw]">
              <ManualSelectValue
                cropImg={cropImage}
                isCovid={
                  //Adding case for direct scan
                  scannedTestPanelId
                    ? scannedTestPanelId === "100040"
                    : advTestPanelID[scanningForPos] &&
                      advTestPanelID[scanningForPos] === "100040"
                }
                value={algorithm}
                setValue={handleManualValue}
                sampleValue={scanningForPos}
              />
              <div
                id="videoDisc"
                style={{
                  minHeight: "15.21vh",

                  alignItems: "flex-end",
                  paddingTop: "1.39vh",
                  lineHeight: "3.47vh",
                }}
              >
                <div id="stepcount" style={{ maxWidth: "75%" }}>
                  {isDetected
                    ? "Result Interpretation"
                    : "Result Interpretation"}{" "}
                </div>
                <div id="stepname" style={{ maxWidth: "75%" }}>
                  {/*TODO Text Change - Use appropriate flag*/}
                  <div style={{ minWidth: "72.65vw" }}>
                    Tap each colour button to change the observed result from
                    pink, yellow, or long press if it is empty.
                  </div>
                </div>
                {/* <div id="stepname"><div className="text-[20px]">Values: {JSON.stringify(algorithm)}</div></div> */}
              </div>
            </div>
            <SideBarSampleInfo
              isError={isError}
              isTimeoutError={isTimeoutError}
              isLowTimeoutError={isLowTimeoutError}
              isExpired={isExpired}
            />
          </div>
        ) : (
          <>
            {!isManual && isDetected ? (
              <div
                className="flex justify-between"
                style={{ paddingBottom: "9%" }}
              >
                <div
                  className="absolute font-semibold !text-[3.30vh]"
                  style={{
                    textAlign: "center",
                    width: "69%",
                    zIndex: "100",
                    margin: "2%",
                    marginTop: "3%",
                  }}
                >
                  {scannedSerialNo
                    ? scannedTestPanelId === "100040"
                      ? "SARS-CoV-2 Panel"
                      : "Skin Infection Viral Test Panel"
                    : advTestPanelID[scanningForPos] === "100040"
                    ? "SARS-CoV-2 Panel"
                    : "Skin Infection Viral Test Panel"}
                </div>
                <AdvSampleDetectedScreen
                  handleScannerClose={handleScannerClose}
                  sampleDetectionState={sampleDetectionState}
                  SampleId={advSamples[scanningForPos]}
                  scanningForPos={scanningForPos}
                  testPanel={advTestPanelID[scanningForPos]}
                />

                <div
                  className="absolute bottom-[10.8vh]"
                  style={{ lineHeight: "2rem" }}
                >
                  <div id="stepcount" style={{ maxWidth: "75%" }}>
                    Results
                  </div>
                  <div id="stepname" style={{ maxWidth: "75%" }}>
                    {/*TODO Text Change - Use appropriate flag*/}
                    <div style={{ minWidth: "72.65vw", lineHeight: "1em" }}>
                      Review the results and make notes as needed.
                      <br />
                      To accept the results and start a new test, press Approve.
                    </div>
                  </div>
                </div>

                <button
                  className="absolute bottom-[4.8vh] right-[3.44vw] confirmBtn t-24"
                  onClick={submitDataToApiChild}
                >
                  Approve
                </button>
                <button
                  className="absolute bottom-[4.8vh] left-[2vw] confirmBtn t-24  backbtn"
                  onClick={handleRescan}
                >
                  Recapture
                </button>
              </div>
            ) : (
              <div className="flex justify-between">
                <div className="flex flex-col  self-center">
                  <div className="my-0 mx-auto  border-2.5 border-[#333] relative">
                    <Video
                      isQRCode={isQRCode}
                      videoStyle={{
                        minHeight: "67.82vh",
                        maxHeight: "67.82vh",
                        maxWidth: "72.65vw",
                        minWidth: "72.65vw",
                      }}
                      setIsTimeoutError={setIsTimeoutError}
                      timerId={timerId}
                    />
                    <div className="border-transparent border-3rem absolute top-0 z-[100] w-[72.65vw] h-full grid border-t-[13vh] border-b-[25vh] border-l-[13.5vw] border-r-[13.5vw]">
                      <div className="!w-[45.73vw]">
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
                  </div>
                  <div
                    id="videoDisc"
                    style={{
                      minHeight: "15.21vh",
                      alignItems: "flex-end",
                      paddingTop: "1.39vh",
                      lineHeight: "3.47vh",
                    }}
                  >
                    <div id="stepcount" style={{ maxWidth: "75%" }}>
                      {isDetected ? "Result Interpretation" : "Result Capture"}{" "}
                    </div>
                    <div id="stepname" style={{ maxWidth: "75%" }}>
                      {/*TODO Text Change - Use appropriate flag*/}
                      <div style={{ minWidth: "72.65vw" }}>
                        {isDetected ? (
                          "Tap each colour button to change the observed result from pink, yellow, or long press if it is empty."
                        ) : (
                          <>
                            Align card with frame until image is captured and
                            tag REF/SN is confirmed.
                            <br />3 corner tags must be visible.
                          </>
                        )}
                      </div>
                    </div>
                    {/* <div id="stepname"><div className="text-[20px]">Values: {JSON.stringify(algorithm)}</div></div> */}
                  </div>
                </div>
                <SideBarSampleInfo
                  isError={isError}
                  isTimeoutError={isTimeoutError}
                  isLowTimeoutError={isLowTimeoutError}
                  isExpired={isExpired}
                />
              </div>
            )}
          </>
        )}

        {isAdvQRcode && !isDetected && (
          <button
            className="absolute !z-[100] bottom-[5.21vh] left-[2vw] confirmBtn t-24  backbtn"
            onClick={handleCloseChild}
            style={{ marginLeft: "2.4%" }}
          >
            Back
          </button>
        )}
        {/* !isManual &&  isAdvQRcode && !isDetected &&<Button className="absolute !z-[100] bottom-[5.21vh] right-[50%] confirmBtn t-24  backbtn"  onClick={()=>handleManualInput(true)}>Manual</Button> */}
        {/* !isManual && isAdvQRcode && !isDetected && (
					<Button
						className='absolute !z-[100] bottom-[5.21vh] left-[45%] confirmBtn t-24  backbtn'
						onClick={addExtraTime}
					>
						+5min
					</Button>
				) */}
        {isAdvQRcode && !isDetected && (
          <Button
            disabled={false} /* !isManual && !isDetected */
            className="absolute !z-[100] bottom-[5.21vh] right-[3.44vw] confirmBtn t-24"
            onClick={triggerConfirmModal}
          >
            Confirm
          </Button>
        )}
      </>
      {showConfirmModal ? (
        <ConfirmDetection
          setIsCancelModal={hideConfirmModal}
          setConfirm={handleDetectionScreen}
          tagRef={advTestPanelID[scanningForPos]}
          tagSerial={advSerialNo[scanningForPos]}
        />
      ) : (
        <div></div>
      )}
    </div>
  );
};

const SideBarSampleInfo = ({
  isError,
  isTimeoutError,
  isLowTimeoutError,
  isExpired,
}) => {
  const { hasTimeElapsed, tagMissing, setTagMissing } =
    useContext(IncubationContext);
  const { advTestPanelID, advSerialNo } =
    useAdvTestDataStore();
  const { scannedTestPanelId, scannedSerialNo, setScannedData } =
    useTestDataStore();
  const { scanningForPos, advSamples, advSamplesPos } = useAdvSampleStore();
  const { isDetected } = useAdvUiStore();
  const handleTestPanelInput = (v) => {
    if (v.length > 6) {
      if (checkForAlphanumeric(v)) {
        let tagref = scannedTestPanelId; //v.substr(0,6)
        let tagserial = v.replace(/\//g, "").slice(6);
        setScannedData(tagref, tagserial);
        if (tagref.length + tagserial.length === 15) {
          setTagMissing(false);
        }
      }
    } else {
      if (checkForAlphanumeric(v)) {
        setScannedData(v, "");
      }
    }
  };

  return (
    <div style={{ paddingLeft: "20px" }}>
      <div className="inpCont !mt-[2.08vh] flex flex-col">
        <label className="inpTxt font-semibold pb-1">Sample ID</label>
        <div className="ui input input-bd !min-h-[4.86vh]">
          <input
            className="!bg-[#CBEFD5]"
            placeholder="000000/00000"
            type="text"
            value={advSamples[scanningForPos]}
            onInput={(e) => {}}
          />
        </div>
      </div>
      <div className="inpCont !mt-[2.08vh] flex flex-col">
        <label className="inpTxt  font-semibold pb-1">
          Test Panel Tag REF / SN
        </label>
        <div className="ui input input-bd !min-h-[4.86vh]">
          <input
            className={
              isError || tagMissing ? "!bg-[#F2CBCB]" : "!bg-[#CBEFD5]"
            }
            type="text"
            placeholder="000000/000000000"
            value={
              scannedTestPanelId
                ? scannedSerialNo
                  ? scannedTestPanelId + "/" + scannedSerialNo
                  : scannedTestPanelId
                : scannedTestPanelId
            }
            onInput={(e) => {
              handleTestPanelInput(e.target.value);
            }}
          />
        </div>
        <label className="inpTxt  !mt-[2.08vh] font-semibold pb-1">
          Test Panel to capture:
        </label>
        <div className="ui input input-bd !min-h-[4.86vh]">
          <span
            className="text-[3.1vh]"
            style={{
              paddingLeft: "10px",
              paddingRight: "10px",
              textTransform: "uppercase",
            }}
          >
            {advSamplesPos[scanningForPos] ? advSamplesPos[scanningForPos] : ""}
          </span>
          <input
            className="!bg-[#EFEFEF]"
            type="text"
            placeholder="000000/000000000"
            value={
              advTestPanelID[scanningForPos]
                ? advTestPanelID[scanningForPos] +
                  "/" +
                  advSerialNo[scanningForPos]
                : ""
            }
            onInput={(e) => {}}
          />
        </div>
      </div>
      {isError && !isExpired && (
        <div
          className="text-[2.78vh] errorleading"
          style={{ color: "#D94444", marginTop: "1em" }}
        >
          <img
            className="w-[2.08vw]"
            src="assets/icons/warning.svg"
            alt="warning"
          ></img>
          Incorrect Test Panel. Please capture Test Panel SN{" "}
          {advTestPanelID[scanningForPos] + "/" + advSerialNo[scanningForPos]}
        </div>
      )}
      {isError && isExpired && (
        <div
          className="text-[2.78vh] errorleading"
          style={{ color: "#D94444", marginTop: "1em" }}
        >
          <img
            className="w-[2.08vw]"
            src="assets/icons/warning.svg"
            alt="warning"
          ></img>
         The item is past the expiry date.
         Please scan a new Test Panel Tag.
        </div>
      )}
      {isTimeoutError && !isDetected && (
        <div
          className="text-[2.78vh] errorleading"
          style={{ color: "#D94444", marginTop: "1em" }}
        >
          <img
            className="w-[2.08vw]"
            src="assets/icons/warning.svg"
            alt="warning"
          ></img>
          No tag detected. A valid test panel REF/SN tag must be visible.
        </div>
      )}
      {isLowTimeoutError && !isDetected && (
        <div
          className="text-[2.78vh] errorleading"
          style={{ color: "#D94444", marginTop: "1em" }}
        >
          <img
            className="w-[2.08vw]"
            src="assets/icons/warning.svg"
            alt="warning"
          ></img>
          Incubation was less than 25 minutes. Use caution interpreting the
          results.
        </div>
      )}
      {hasTimeElapsed && (
        <div
          className="text-[2.78vh]"
          style={{ color: "#D94444", marginTop: "1em" }}
        >
          <img
            className="w-[2.08vw] inline"
            src="assets/icons/warning.svg"
            alt="warning"
          ></img>
          <br />
          <span>
            Incubation time was over 35 minutes. Use caution interpreting the
            results.
          </span>
        </div>
      )}
      {tagMissing && (
        <div
          className="text-[2.78vh]"
          style={{ color: "#D94444", marginTop: "1em" }}
        >
          <img
            className="w-[2.08vw] inline"
            src="assets/icons/warning.svg"
            alt="warning"
          ></img>
          <br />
          <span>
            Test Panel Tag REF/SN required to proceed. Please scan or enter the
            information.
          </span>
        </div>
      )}
    </div>
  );
};
export default React.memo(AdvTestTubeScanner);
