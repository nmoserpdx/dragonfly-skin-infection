import React, { useEffect, useRef } from "react";
import { memo, useState } from "react";
import { useAdvTestDataStore } from "../../storeAdv/advTestData";
import { SCAN_ERRORS } from "../../constants/sample";
import ErrorSampleMsg from "../ErrorSampleMsg";
import { useNonPersistentStates } from "../../store/noPersistentState";
import { CalculateDateFromJDay } from "../../helpers";
import { useAdvSampleStore } from "../../storeAdv/advSample";
import { useCurrentAdvTestDataStore } from "../../storeAdv/advCurrentSample";
import { checkForAlphanumeric } from "../../helpers";
import { useSampleStore } from "../../store/samples";
import { useConfigStore } from "../../store/appconfiguration";

const SampleInputAdvScreenSampleAlreadyExist = (
  { currentLotNo, setHeight },
  currentPrepkit,
  currentSerialNo,
  currentTestPanel
) => {
  const {
    setAdvSamplePrepKit,
    setAdvTestPanelID,
    advTestPanelID,
    advSerialNo,
    advSamplePrepKit,
    setAdvSerialNo,
    advLotNo,
    setAdvLotNo,
  } = useAdvTestDataStore();
  const {
    currentAdvSamplePrepKit,
    currentAdvTestPanelID,
    currentAdvSampleID,
    currentAdvSerialNo,
    setCurrentAdvSamplePrepKit,
    setCurrentAdvSerialNo,
    setCurrentAdvTestPanelID,
    setCurrentAdvSampleID,
    currentAdvLotNo,
    setCurrentAdvLotNo,
  } = useCurrentAdvTestDataStore();
  const { allowExpiry } = useSampleStore();

  const { scanningForPos, setAdvSamples, advSamples } = useAdvSampleStore();
  const [textBoxBgColour, settextBoxBgColour] = useState("!bg-[#EFEFEF]");
  const [testPanelBgColour, settestPanelBgColour] = useState("!bg-[#EFEFEF]");
  const [sampleIDBgColour, settestsampleIDBgColour] = useState("!bg-[#EFEFEF]");
  const [currentSampleID, setCurrentSampleID] = useState("");
  const { sample_ids, test_panel_ids } = useConfigStore()
  // const PREP_KIT = JSON.parse(localStorage.getItem('sampleids')).ids
  //                 ? JSON.parse(localStorage.getItem('sampleids')).ids
  //                 : ['100006', '100104', '100350']
  const PREP_KIT = sample_ids
  // const TEST_PANEL = JSON.parse(localStorage.getItem('testpanels')).ids
  //                   ? JSON.parse(localStorage.getItem('testpanels')).ids
  //                   : ['100051','100040', '100069']
  const TEST_PANEL = test_panel_ids

  const useFocus = () => {
    const htmlElRef = useRef(null);
    const setFocus = () => {
      htmlElRef.current && htmlElRef.current.focus();
    };
    return [htmlElRef, setFocus];
  };

  const [sampleInputRef, setSampleInputFocus] = useFocus();
  const [prepKitInputRef, setPrepKitInputFocus] = useFocus();
  const [testPanelInputRef, setTestPanelInputFocus] = useFocus();

  const {
    isWrongSample,
    wrongType,
    isWrongTestSample,
    wrongTestPanelType,
    setWrongTestPanelType,
    sampleIDscanned,
    setsampleIDScanned,
  } = useNonPersistentStates();

  // const {advLotNo, setAdvLotNo} = useAdvTestDataStore()
  useEffect(() => {
    if (currentSampleID === "") {
      setCurrentSampleID(advSamples[scanningForPos]);
    }
    if (!currentAdvLotNo) {
      setCurrentAdvLotNo(advLotNo[scanningForPos]);
    }
    if (!currentAdvSamplePrepKit) {
      setCurrentAdvSamplePrepKit(advSamplePrepKit[scanningForPos]);
    }
    if (!currentAdvTestPanelID) {
      setCurrentAdvTestPanelID(advTestPanelID[scanningForPos]);
    }
    if (!currentAdvSerialNo) {
      setCurrentAdvSerialNo(advSerialNo[scanningForPos]);
    }
    if (!currentAdvSampleID) {
      setCurrentAdvSampleID(advSamples[scanningForPos]);
    }
    if (currentAdvSamplePrepKit && currentAdvLotNo) {
      if (currentAdvSamplePrepKit.length === 6) {
        // + currentAdvLotNo.length REMOVED AS PER NEW REQ
        if (PREP_KIT.indexOf(currentAdvSamplePrepKit) !== -1) {
          if (isWrongSample) {
            if (wrongType === SCAN_ERRORS["NONE"]) {
              settextBoxBgColour("!bg-[#a7e1b7]");
            } else {
              settextBoxBgColour("!bg-[#F2CBCB]");
            }
          } else {
            settextBoxBgColour("!bg-[#a7e1b7]");
          }
        } else {
          settextBoxBgColour("!bg-[#F2CBCB]");
        }
      }
    }
    if (currentAdvTestPanelID && currentAdvSerialNo) {
      if (currentAdvTestPanelID.length + currentAdvSerialNo.length === 15) {
        if (TEST_PANEL.indexOf(currentAdvTestPanelID) !== -1) {
          if (isWrongTestSample) {
            if (wrongTestPanelType === SCAN_ERRORS["NONE"]) {
              settestPanelBgColour("!bg-[#a7e1b7]");
            } else {
              settestPanelBgColour("!bg-[#F2CBCB]");
            }
          } else {
            settestPanelBgColour("!bg-[#a7e1b7]");
          }
        } else {
          settestPanelBgColour("!bg-[#F2CBCB]");
        }
      }
    }

    if (sampleIDscanned || currentAdvSampleID) {
      settestsampleIDBgColour("!bg-[#a7e1b7]");
    }
  }, [
    advLotNo,
    advSamplePrepKit,
    advSerialNo,
    advTestPanelID,
    currentAdvLotNo,
    currentAdvSamplePrepKit,
    currentAdvSerialNo,
    currentAdvTestPanelID,
    isWrongSample,
    isWrongTestSample,
    scanningForPos,
    setCurrentAdvLotNo,
    setCurrentAdvSamplePrepKit,
    setCurrentAdvSerialNo,
    setCurrentAdvTestPanelID,
    wrongTestPanelType,
    wrongType,
    sampleIDscanned,
  ]);

  // useEffect(() => {
  //    setTestPanelHook(serialNo?TestPanel+'/'+serialNo:TestPanel)
  //    console.log(TestPanel)
  //   },[TestPanel,serialNo]);

  const validatePrepInput = () => {
    if (advSamplePrepKit[scanningForPos].length > 0) {
      let samplekit = advSamplePrepKit[scanningForPos].substr(
        0,
        advSamplePrepKit[scanningForPos].indexOf("/")
      );
      if (typeof samplekit != "undefined") {
        if (PREP_KIT.indexOf(samplekit) !== -1) {
          //resetNoPersistentState()
          settextBoxBgColour("!bg-[#a7e1b7]");
          // setTestPanel('')
        } else {
          //setIsWrongSample(true)
          //setWrongMsg("invalid prep kit")
          //setWrongType("invalid")
          settextBoxBgColour("!bg-[#F2CBCB]");
        }
      }
    }
    setHeight(false);
  };

  const handleTestPanelInput = (v) => {
    if (v.length > 6) {
      if (checkForAlphanumeric(v)) {
        setAdvSerialNo(scanningForPos, v.replace(/\//g, "").slice(6));
      }
    } else {
      if (checkForAlphanumeric(v)) {
        setAdvTestPanelID(scanningForPos, v);
      }
      if (!advTestPanelID[scanningForPos]) {
        setAdvSerialNo(scanningForPos, "");
      }
    }
  };

  const checkForExpiry = (date) => {
    // console.log(YYMMDD)
    // return new Date(`20${YYMMDD.slice(0,2)}-${YYMMDD.slice(2,4)}-${YYMMDD.slice(4,6)}`) > new Date()
    if(allowExpiry){
      return true;
    }
    return date > new Date();
  };
  const validateTestPanelInput = () => {
    let testkit = advTestPanelID[scanningForPos]; //.substr(0, advTestPanelID[scanningForPos].indexOf('/'));
    if (typeof testkit !== "undefined") {
      if (TEST_PANEL.indexOf(testkit) !== -1) {
        //resetNoPersistentState()
        settestPanelBgColour("!bg-[#a7e1b7]");
        // setTestPanel('')
      } else {
        //setIsWrongSample(true)
        //setWrongMsg("invalid test panel")
        //setWrongType("invalid")
        settestPanelBgColour("!bg-[#F2CBCB]");
      }
      let serialNo = advSerialNo[scanningForPos];
      if (serialNo) {
        var expiryDate = CalculateDateFromJDay(
          parseInt(serialNo.slice(1, 4)),
          serialNo.slice(0, 1)
        );
        if (checkForExpiry(expiryDate)) {
          console.log("ok");
          settestPanelBgColour("!bg-[#a7e1b7]");
        } else {
          settestPanelBgColour("!bg-[#F2CBCB]");
          //setIsWrongSample(true)
          //setWrongMsg("expired")
          //setWrongType("expired")
        }
      } else {
        //setIsWrongSample(true)
        //setWrongMsg("enter serial no")
        setWrongTestPanelType(SCAN_ERRORS["MISSING_TEST_PANEL"]);
      }
    }
    setHeight(false);
  };

  const handleAdvPrepKitInput = (v) => {
    if (v.length > 6) {
      setCurrentAdvLotNo(v.replace(/\//g, "").slice(6));
      setAdvLotNo(scanningForPos, v.replace(/\//g, "").slice(6));
    } else {
      setCurrentAdvSamplePrepKit(v);
      setAdvSamplePrepKit(scanningForPos, v);
    }
    if (!advSamplePrepKit[scanningForPos]) {
      setCurrentAdvLotNo("");
      setAdvLotNo(scanningForPos, "");
    }
    // if(v.length===6){
    //     validateTestPanelInput()
    //     console.log(TestPanel)
    // }
  };

  const handleSampleInput = (value) => {
    if (value.length >= 0) {
      setCurrentSampleID(value);
      settestsampleIDBgColour("!bg-[#a7e1b7]");
      setsampleIDScanned(true);
    } /*else{
      setAdvSamples(scanningForPos, currentSampleID)
      settestsampleIDBgColour("!bg-[#EFEFEF]")
      setsampleIDScanned(false)
    }*/
  };

  const validateSampleInput = (value) => {
    if (typeof value !== "undefined") {
      if (value.length === 0) {
        setCurrentAdvSampleID(currentSampleID);
        settestsampleIDBgColour("!bg-[#a7e1b7]");
        setsampleIDScanned(true);
      } else {
        setCurrentAdvSampleID(currentSampleID);
        setAdvSamples(scanningForPos, value);
      }
    }
    setHeight(false);
  };

  const clearSampleId = () => {
    setAdvSamples(scanningForPos, "");
    setSampleInputFocus();
    settestsampleIDBgColour("!bg-[#efefef]");
    setsampleIDScanned(false);
  };

  const clearPrepKit = () => {
    setAdvSamplePrepKit(scanningForPos, "");
    setAdvLotNo(scanningForPos, "");
    setPrepKitInputFocus();
  };

  const clearTestPanelTag = () => {
    setAdvTestPanelID(scanningForPos, "");
    setAdvLotNo(scanningForPos, "");
    setTestPanelInputFocus();
  };

  return (
    <div
      className="Adv-detail-cont px-[7.23vw] justify-self-center self-center"
      style={{
        minHeight: "60.34vh",
        maxHeight: "60.34vh",
        maxWidth: "46.51vw",
        minWidth: "46.51vw",
      }}
    >
      <div className="font-bold !text-[2.78vh] max-w-2xl">
        {/* {ErrorSampleMsg} */}
        <ErrorSampleMsg />
        Scan each item to record the following information. <br /> Tap in the
        field for keyboard entry{" "}
      </div>
      <div className="mt-[5.04vh] !max-w-[20.83vw]">
        <div className="inpCont !mt-[2.08vh] flex flex-col ">
          <label className="inpTxt   font-semibold pb-1">Sample ID</label>
          <div className="ui input input-bd !rounded-[8px] !min-h-[4.86vh]">
            <input
              ref={sampleInputRef}
              onBlur={(e) => {
                validateSampleInput(e.target.value);
              }}
              onFocus={() => setHeight(true)}
              className={sampleIDBgColour}
              type="text"
              placeholder="Scan or enter code"
              value={currentSampleID}
              onInput={(e) => {
                handleSampleInput(e.target.value);
              }}
            />
            <div
              className="absolute right-[0.78vw] self-center entrycross"
              onClick={clearSampleId}
            >
              <svg
                width="23"
                height="23"
                viewBox="0 0 70 70"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.1657 0.585276L0.474376 9.2766L26.1208 34.923L0.646396 60.3974L9.33772 69.0887L34.8121 43.6143L60.2249 69.0271L68.9162 60.3358L43.5034 34.923L69.0882 9.33821L60.3969 0.646887L34.8121 26.2317L9.1657 0.585276Z"
                  fill="#8B8B8B"
                />
              </svg>
            </div>
            {/* <div className="absolute right-[0.78vw] self-center">
                <svg id="Icon_pencil" className="!h-[2.7vh]" data-name="Icon / pencil" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 40 40">
                <g id="MDI_pencil" data-name="MDI / pencil">
                <g id="Boundary" fill="#8b8b8b" stroke="rgba(0,0,0,0)" stroke-width="1" opacity="0">
                <rect  stroke="none"/>
                <rect x="0.5" y="0.5" fill="none"/>
                </g>
                <path id="Path_pencil" data-name="Path / pencil" d="M36.45,10.633a1.881,1.881,0,0,0,0-2.663L32.03,3.55a1.881,1.881,0,0,0-2.663,0L25.892,7.006l7.083,7.083M3,29.917V37h7.083l20.89-20.909L23.89,9.008Z" transform="translate(0 0.003)" fill="#8b8b8b"/>
                </g>
                </svg>
              </div> */}
          </div>
        </div>

        <div className="inpCont !mt-[2.08vh] flex flex-col">
          <label className="inpTxt   font-semibold pb-1">
            Sample Preparation Kit REF/LOT
          </label>
          <div className="ui input input-bd !min-h-[4.86vh]">
            <input
              ref={prepKitInputRef}
              onFocus={() => setHeight(true)}
              className={textBoxBgColour}
              placeholder="000000/00000"
              type="text"
              onBlur={validatePrepInput}
              value={
                advSamplePrepKit[scanningForPos]
                  ? advLotNo[scanningForPos]
                    ? advSamplePrepKit[scanningForPos] +
                      "/" +
                      advLotNo[scanningForPos]
                    : advSamplePrepKit[scanningForPos]
                  : advSamplePrepKit[scanningForPos]
              }
              onInput={(e) => {
                handleAdvPrepKitInput(e.target.value);
              }}
            />
            <div
              className="absolute right-[0.78vw] self-center"
              onClick={clearPrepKit}
            >
              <svg
                width="23"
                height="23"
                viewBox="0 0 70 70"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.1657 0.585276L0.474376 9.2766L26.1208 34.923L0.646396 60.3974L9.33772 69.0887L34.8121 43.6143L60.2249 69.0271L68.9162 60.3358L43.5034 34.923L69.0882 9.33821L60.3969 0.646887L34.8121 26.2317L9.1657 0.585276Z"
                  fill="#8B8B8B"
                />
              </svg>
            </div>
            {/* <div className="absolute right-[0.78vw] self-center">
                <svg id="Icon_pencil" className="!h-[2.7vh]" data-name="Icon / pencil" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 40 40">
                  <g id="MDI_pencil" data-name="MDI / pencil">
                  <g id="Boundary" fill="#8b8b8b" stroke="rgba(0,0,0,0)" stroke-width="1" opacity="0">
                  <rect  stroke="none"/>
                  <rect x="0.5" y="0.5" fill="none"/>
                  </g>
                    <path id="Path_pencil" data-name="Path / pencil" d="M36.45,10.633a1.881,1.881,0,0,0,0-2.663L32.03,3.55a1.881,1.881,0,0,0-2.663,0L25.892,7.006l7.083,7.083M3,29.917V37h7.083l20.89-20.909L23.89,9.008Z" transform="translate(0 0.003)" fill="#8b8b8b"/>
                  </g>
                </svg>
              </div> */}
          </div>
        </div>

        <div className="inpCont !mt-[2.08vh] flex flex-col">
          <label className="inpTxt   font-semibold pb-1">
            Test Panel Tag REF / SN
          </label>
          <div className="ui input input-bd !min-h-[4.86vh]">
            <input
              ref={testPanelInputRef}
              onFocus={() => setHeight(true)}
              className={testPanelBgColour}
              type="text"
              placeholder="000000/000000000"
              onBlur={validateTestPanelInput}
              value={
                advTestPanelID[scanningForPos]
                  ? advSerialNo[scanningForPos]
                    ? advTestPanelID[scanningForPos] +
                      "/" +
                      advSerialNo[scanningForPos]
                    : advTestPanelID[scanningForPos]
                  : advTestPanelID[scanningForPos]
              }
              onInput={(e) => {
                handleTestPanelInput(e.target.value);
              }}
            />
            <div
              className="absolute right-[0.78vw] self-center"
              onClick={clearTestPanelTag}
            >
              <svg
                width="23"
                height="23"
                viewBox="0 0 70 70"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.1657 0.585276L0.474376 9.2766L26.1208 34.923L0.646396 60.3974L9.33772 69.0887L34.8121 43.6143L60.2249 69.0271L68.9162 60.3358L43.5034 34.923L69.0882 9.33821L60.3969 0.646887L34.8121 26.2317L9.1657 0.585276Z"
                  fill="#8B8B8B"
                />
              </svg>
            </div>
            {/* <div className="absolute right-[0.78vw] self-center">
                <svg id="Icon_pencil" className="!h-[2.7vh]" data-name="Icon / pencil" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 40 40">
                <g id="MDI_pencil" data-name="MDI / pencil">
                <g id="Boundary" fill="#8b8b8b" stroke="rgba(0,0,0,0)" stroke-width="1" opacity="0">
                <rect  stroke="none"/>
                <rect x="0.5" y="0.5" fill="none"/>
                </g>
                <path id="Path_pencil" data-name="Path / pencil" d="M36.45,10.633a1.881,1.881,0,0,0,0-2.663L32.03,3.55a1.881,1.881,0,0,0-2.663,0L25.892,7.006l7.083,7.083M3,29.917V37h7.083l20.89-20.909L23.89,9.008Z" transform="translate(0 0.003)" fill="#8b8b8b"/>
                </g>
                </svg>
              </div> */}
          </div>
        </div>
      </div>
      <ErrorSampleMsg />
    </div>
  );
};

export default memo(SampleInputAdvScreenSampleAlreadyExist);
