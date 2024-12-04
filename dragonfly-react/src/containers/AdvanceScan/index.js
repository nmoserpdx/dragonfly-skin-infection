import React, { useState, useCallback, useEffect } from "react";
import shortid from "shortid";
import { useAdvSampleStore } from "../../storeAdv/advSample";
import { useAdvUiStore } from "../../storeAdv/advUi";
import { useAdvTestDataStore } from "../../storeAdv/advTestData";
import axios from "axios";
import AdvScanSample from "./advScanner";
import { useSelector } from "react-redux";
// import { useDashboard } from '../../store/dashboard';
import { Dummy_Token } from "../../constants";
import SampleInputAdvScreen from "../../components/SampleInputAdvScreen";
import AdvTestTubeScanner from "./advTestTubeScanner";
import { useCurrentAdvTestDataStore } from "../../storeAdv/advCurrentSample";
// import { useNonPersistentStates } from '../../store/noPersistentState';
import SampleInputAdvScreenSampleAlreadyExist from "../../components/SampleInputAdvScreenSampleAlreadyExist";
import { useAdvSampleTimerStore } from "../../storeAdv/advSampleTimer";
import { AdvanceInstructions } from "../../logic/instructions";
import useSound from "use-sound";
import beebeepala_30sec_alarmnorepeat from "../../Sounds/beebeepala_30sec_alarmnorepeat.mp3";

export default function AdvanceScan({
  transferCurrentStateToMainState,
  handleClose,
  samplesNo,
}) {
  //const heatersNo = ["1", "2", "3", "4"];
  //const [isManualScreen , setIsManualScreen] = useState(false)
  const { setCommentMsg, commentMsg, isCommentFlagged } = useAdvUiStore();
  // const [wrongSample,setWrongSample]=useState(false)
  const { scanningForPos, advSamples } = useAdvSampleStore();
  const { isAdvQRcode } = useAdvUiStore();
  const {
    setAdvSamplePrepKit,
    setAdvTestPanelID,
    setAdvSerialNo,
    advLotNo,
    setAdvLotNo,
    setAdvPrepKitExpDate,
    setAdvTestPanelExpDate
  } = useAdvTestDataStore();
  const {
    currentAdvSamplePrepKit,
    currentAdvTestPanelID,
    currentAdvSampleID,
    currentAdvSerialNo,
    currentAdvLotNo,
    currentPrepKitExpDate,
    currentTestPanelExpDate
  } = useCurrentAdvTestDataStore();

  const [height, setHeight] = useState(false); //for handling scroll manually

  //const {OffResultSave,setOffResultSave} = useDashboard()
  //old code below
  /*
    const createSample = useCallback(() => {
        const epoch =  Math.floor(new Date().getTime() / 100)
        setAdvSamples(scanningForPos,epoch.toString())
    }, [])
    */
  const capture = useCallback(() => {
    // createSample()
    handleClose();
  }, []);

  useEffect(() => {
    if (height) {
      var objDiv = document.getElementById("advScanPanel");
      objDiv.scrollTop = objDiv.scrollHeight;
    }
    // return() => {
    //   setHeight(false)
    // }
  }, [height]);

  const { AdvSampleTimerPos } = useAdvSampleTimerStore();

  const [play] = useSound(beebeepala_30sec_alarmnorepeat, {
    volume: 0.5,
    interrupt: false,
  });

  const [show, setShow] = useState(false);
  const tempTime = 501;
  useEffect(() => {
    const interval = setInterval(() => {
      // console.log("you spend one second")
      // console.log(samplesNo)
      if (samplesNo !== undefined) {
        samplesNo.map((sampleNo) => (
          AdvanceInstructions.steps.map((step) => {
            if (AdvSampleTimerPos[sampleNo][step.timerId].isPlaying) {
              AdvSampleTimerPos[sampleNo][step.timerId].timer -= 1;
              // console.log(AdvSampleTimerPos);
              if (AdvSampleTimerPos[sampleNo][step.timerId].timer === 0) {
                AdvSampleTimerPos[sampleNo][step.timerId].isPlaying = false;
                setShow(true);
                //  console.log("PLAY")
              }
              // console.log(show)
            }
            return null;
          })
        ));
      }
    }, tempTime);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (show) {
      play();
    }
    setShow(false);
    return setShow(false);
  }, [show]);

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
        setCurrentAdvSerialNo(sn)
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

    const checkForExpiry = (date) => {
        // console.log(YYMMDD)
        // return new Date(`20${YYMMDD.slice(0,2)}-${YYMMDD.slice(2,4)}-${YYMMDD.slice(4,6)}`) > new Date()
        return date > new Date()
    }*/

  const { userInfo } = useSelector((state) => state.logIn);
  const submitDataToApi = (data) => {
    let comment_msg = commentMsg.replace(/(\r\n|\n|\r)/gm, " "); //replacing new line in text area

    comment_msg = comment_msg.replace(",", ";");

    var datas = {
      ...data,
      comments: comment_msg,
      error: isCommentFlagged,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-AuthorityToken": "auth-wpf-desktop",
        "X-AccessToken": userInfo ? userInfo.auth0_access_token : Dummy_Token,
      },
    };
    // console.log(datas)
    handleClose();
    axios
      .post(process.env.REACT_APP_SERVER_BASE_URL + "/addresult", datas, config)
      .then((response) => console.log(response))
      .catch(function (error) {
        if (error.toJSON().message === "Network Error") {
          console.log("Network error happend");
        }

        if (window.NativeDevice) {
          window.NativeDevice.insertDataToDb(JSON.stringify({ data, config }));
        }
      });
    setCommentMsg("");
  };
  const handleTransferCurrentState = (id) => {
    var uid = shortid.generate();
    setAdvTestPanelID(uid, currentAdvTestPanelID);
    setAdvSamplePrepKit(uid, currentAdvSamplePrepKit);
    setAdvPrepKitExpDate(uid, currentPrepKitExpDate);
    setAdvTestPanelExpDate(uid, currentTestPanelExpDate);
    setAdvSerialNo(uid, currentAdvSerialNo);
    setAdvLotNo(uid, currentAdvLotNo);
    transferCurrentStateToMainState(uid, currentAdvSampleID);
  };

  // {
  //   /* `${height?`h-[120vh] items-start`:`h-[80vh] items-center` */
  // }
  return (
    <div
      id="advScanPanel"
      className={`${
        height ? `pb-[45vh] items-start` : `items-center`
      } advScanContainer flex h-full w-full`}
      style={{ overflowY: "scroll" }}
    >
      {isAdvQRcode ? (
        <div className={"flex "} style={{ flexGrow: "1" }}>
          <AdvTestTubeScanner
            isQRCode={false}
            handleOpenScanner={handleClose}
            submitDataToApi={submitDataToApi}
            setHeight={setHeight}
          />
        </div>
      ) : (
        <>
          <div
            className={"flex "}
            style={{ flexGrow: "1", justifyContent: "center" }}
          >
            <AdvScanSample
              isQRCode={true}
              transferState={handleTransferCurrentState}
              capture={capture}
              handleOpenScanner={handleClose}
              setHeight={setHeight}
            />
            {advSamples[scanningForPos] ? (
              <SampleInputAdvScreenSampleAlreadyExist
                currentLotNo={advLotNo[scanningForPos]}
                setHeight={setHeight}
              />
            ) : (
              <SampleInputAdvScreen setHeight={setHeight} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
