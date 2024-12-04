import React, { useEffect } from "react";
import { memo, useState, useRef } from "react";
import { useTestDataStore } from "../../store/testData";
import { useSampleStore } from "../../store/samples";
import { SCAN_ERRORS } from "../../constants/sample";
import ErrorSampleMsg from "../../components/ErrorSampleMsg";
import { useNonPersistentStates } from "../../store/noPersistentState";
import { CalculateDateFromJDay, checkForAlphanumeric } from "../../helpers";
import { useConfigStore } from "../../store/appconfiguration";

const SampleInputGuidedScreen = () => {
  const sampleState = useSampleStore();
  const { currentSample, setCurrentSample, allowExpiry } = sampleState;
  const testDataState = useTestDataStore();
  const [textBoxBgColour, settextBoxBgColour] = useState("!bg-[#EFEFEF]");
  const [testPanelBgColour, settestPanelBgColour] = useState("!bg-[#EFEFEF]");
  const [sampleIDBgColour, settestsampleIDBgColour] = useState("!bg-[#EFEFEF]");

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

  const {
    samplePrepKit,
    TestPanel,
    setSamplePrepKit,
    setTestPanel,
    serialNo,
    setSerialNo,
    lotNo,
    setLotNo,
  } = testDataState;
  const {
    isWrongSample,
    setIsWrongSample,
    setWrongMsg,
    wrongType,
    setWrongType,
    resetNoPersistentState,
    setIsWrongTestSample,
    setWrongTestPanelMsg,
    setWrongTestPanelType,
    wrongTestPanelType,
    isWrongTestSample,
    sampleIDscanned,
    setsampleIDScanned,
  } = useNonPersistentStates();
  // const [testPanelHook,setTestPanelHook] = useState(serialNo?TestPanel+'/'+serialNo:TestPanel)

  const [sampleInputRef, setSampleInputFocus] = useFocus();
  const [prepKitInputRef, setPrepKitInputFocus] = useFocus();
  const [testPanelInputRef, setTestPanelInputFocus] = useFocus();

  //old code below
  /*
    const checkForExpiryYYMMDD = (YYMMDD) => {
        //console.log(new Date(`20${YYMMDD.slice(0,2)}-${YYMMDD.slice(2,4)}-${YYMMDD.slice(4,6)}`) )
        return new Date(`20${YYMMDD.slice(0,2)}-${YYMMDD.slice(2,4)}-${YYMMDD.slice(4,6)}`) >= new Date()
    }*/

  useEffect(() => {
    if (samplePrepKit && lotNo) {
      if (samplePrepKit.length === 6) {
        // + lotNo.length REMOVED AS PER NEW REQ
        if (PREP_KIT.indexOf(samplePrepKit) !== -1) {
          if (isWrongSample) {
            if (wrongType !== SCAN_ERRORS["NONE"]) {
              settextBoxBgColour("!bg-[#F2CBCB]");
              // alert("firstpp" + wrongType)
            } else {
              settextBoxBgColour("!bg-[#a7e1b7]");
              // alert("secondpp" + wrongType)
            }
          } else {
            settextBoxBgColour("!bg-[#a7e1b7]");
            // alert("thirdpp" + wrongType)
          }
        } else {
          settextBoxBgColour("!bg-[#F2CBCB]");
          // alert("fourthpp" + wrongType)
        }
      } /*else{
             settextBoxBgColour("!bg-[#EFEFEF]")
           }*/
      // alert("fifthpp" + wrongType)
    }
    // alert(TestPanel + " " + serialNo)
    if (TestPanel && serialNo) {
      if (TestPanel.length + serialNo.length === 15) {
        if (TEST_PANEL.indexOf(TestPanel) !== -1) {
          if (isWrongTestSample) {
            if (wrongTestPanelType !== SCAN_ERRORS["NONE"]) {
              settestPanelBgColour("!bg-[#F2CBCB]");
              // alert("first" + wrongTestPanelType)
            } else {
              // alert("second" + wrongTestPanelType)
              settestPanelBgColour("!bg-[#a7e1b7]");
            }
          } else {
            // alert("third" + wrongTestPanelType)
            settestPanelBgColour("!bg-[#a7e1b7]");
          }
        } else {
          // alert("fourth" + wrongTestPanelType)
          settestPanelBgColour("!bg-[#F2CBCB]");
        }
      } /*else{
             settestPanelBgColour("!bg-[#F2CBCB]")
           }*/
      // alert("fifth" + wrongTestPanelType)
    }
    if (sampleIDscanned) {
      settestsampleIDBgColour("!bg-[#a7e1b7]");
    }
    //Error check here
    // if(isWrongSample){
    //   if(wrongMsg == "Expired Test Panel"){
    //     settestPanelBgColour("!bg-[#F2CBCB]")
    //   }else if(wrongMsg == "Expired Prep Kit"){
    //     settextBoxBgColour("!bg-[#F2CBCB]")
    //   }
    // }
    return () => {
      // will run on every unmount.
      // console.log("component is unmounting");
    };
  }, [
    TestPanel,
    serialNo,
    isWrongTestSample,
    wrongTestPanelType,
    samplePrepKit,
    lotNo,
    isWrongSample,
    wrongType,
    sampleIDscanned,
  ]);

  const handleInput = (v) => {
    if (v.length > 6) {
      if (checkForAlphanumeric(v)) {
        setSerialNo(v.replace(/\//g, "").slice(6));
      }
    } else {
      if (checkForAlphanumeric(v)) {
        setTestPanel(v);
      }
      if (!TestPanel) {
        setSerialNo("");
      }
    }
  };

  const handlePrepKitInput = (v) => {
    // setTestPanelHook(v.replace(/\//g,""))
    if (v.length > 6) {
      setLotNo(v.replace(/\//g, "").slice(6));
    } else {
      setSamplePrepKit(v);
      if (!samplePrepKit) {
        setLotNo("");
      }
    }
    // if(v.length===6){
    //     validateTestPanelInput()
    //     console.log(TestPanel)
    // }
  };

  const validatePrepInput = () => {
    if (samplePrepKit.length > 0) {
      if (PREP_KIT.indexOf(samplePrepKit) !== -1) {
        resetNoPersistentState();
        settextBoxBgColour("!bg-[#a7e1b7]");
        // setTestPanel('')
      } else {
        setIsWrongSample(true);
        setWrongMsg("Invalid prep kit");
        setWrongType(SCAN_ERRORS["INVALID_PREP_KIT"]);
        settextBoxBgColour("!bg-[#F2CBCB]");
      }
    } else {
      settextBoxBgColour("!bg-[#EFEFEF]");
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
    if (TEST_PANEL.indexOf(TestPanel) !== -1) {
      resetNoPersistentState();
      settestPanelBgColour("!bg-[#a7e1b7]");
      // setTestPanel('')
    } else {
      setIsWrongTestSample(true);
      setWrongTestPanelType(SCAN_ERRORS["INVALID_TEST_PANEL"]);
      setWrongTestPanelMsg(`Test panel id is Invalid`);
      settestPanelBgColour("!bg-[#F2CBCB]");
    }

    if (serialNo) {
      if (serialNo.length !== 9) {
        setIsWrongTestSample(true);
        setWrongTestPanelMsg(
          "The length of the serial number should be 9 digits."
        );
        setWrongTestPanelType(SCAN_ERRORS["INVALID_TEST_PANEL"]);
        settestPanelBgColour("!bg-[#F2CBCB]");
      } else {
        var expiryDate = CalculateDateFromJDay(
          parseInt(serialNo.slice(1, 4)),
          serialNo.slice(0, 1)
        );
        if (checkForExpiry(expiryDate)) {
          settestPanelBgColour("!bg-[#a7e1b7]");
        } else {
          setIsWrongTestSample(true);
          setWrongTestPanelMsg(
            `The item is past the expiry date.\n
             Please scan a new Test Panel Tag.`
          );
          setWrongTestPanelType(SCAN_ERRORS["EXPIRED_TEST_PANEL"]);
          settestPanelBgColour("!bg-[#F2CBCB]");
        }
      }
    } else {
      setIsWrongTestSample(true);
      setWrongTestPanelMsg("Serial Number is missing");
      setWrongTestPanelType(SCAN_ERRORS["MISSING_TEST_PANEL"]);
    }
  };

  const handleSampleInput = (value) => {
    setCurrentSample({ id: value });
    if (value.length > 0) {
      settestsampleIDBgColour("!bg-[#a7e1b7]");
      setsampleIDScanned(true);
    } else {
      settestsampleIDBgColour("!bg-[#EFEFEF]");
      setsampleIDScanned(false);
    }
  };

  const validateSampleInput = (value) => {
    if (typeof value !== "undefined") {
      if (value.length === 0) {
        //if empty generate new id
        const sampleId = Math.floor(new Date().getTime() / 100);
        setCurrentSample({ id: sampleId });
        settestsampleIDBgColour("!bg-[#a7e1b7]");
        setsampleIDScanned(true);
      }
    }
  };

  const clearSampleId = () => {
    setCurrentSample({
      id: "",
    });
    setSampleInputFocus();
    setsampleIDScanned(false);
  };

  const clearPrepKit = () => {
    setSamplePrepKit("");
    setLotNo("");
    setPrepKitInputFocus();
  };

  const clearTestPanelTag = () => {
    setTestPanel("");
    setSerialNo("");
    setTestPanelInputFocus();
  };
  return (
    <div
      style={{
        minHeight: "61.4vh",
        display: "flex",
        justifyContent: "right",
        flexDirection: "column",
        paddingLeft: "2.5vw",
      }}
    >
      <div className="detail-cont flex">
        <div className="inpCont  flex flex-col">
          <label className="inpTxt   font-semibold pb-1">Sample ID</label>
          <div className="ui input input-bd !rounded-[8px]">
            <input
              ref={sampleInputRef}
              className={sampleIDBgColour}
              type="text"
              onBlur={(e) => {
                validateSampleInput(e.target.value);
              }}
              placeholder="Scan or enter code"
              value={currentSample.id}
              onInput={(e) => {
                handleSampleInput(e.target.value);
              }}
            />
            <button
              className="absolute right-[0.78vw] self-center"
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
              {/* <svg id="Icon_pencil" className="!h-[2.7vh]" data-name="Icon / pencil" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 40 40">
                <g id="MDI_pencil" data-name="MDI / pencil">
                    <g id="Boundary" fill="#8b8b8b" stroke="rgba(0,0,0,0)" stroke-width="1" opacity="0">
                    <rect  stroke="none"/>
                    <rect x="0.5" y="0.5" fill="none"/>
                    </g>
                    <path id="Path_pencil" data-name="Path / pencil" d="M36.45,10.633a1.881,1.881,0,0,0,0-2.663L32.03,3.55a1.881,1.881,0,0,0-2.663,0L25.892,7.006l7.083,7.083M3,29.917V37h7.083l20.89-20.909L23.89,9.008Z" transform="translate(0 0.003)" fill="#8b8b8b"/>
                </g>
                </svg> */}
            </button>
          </div>
        </div>
        <div className="inpCont mt-[2.08vh] flex flex-col">
          <label className="inpTxt   font-semibold pb-1">
            Sample Preparation Kit REF / LOT
          </label>
          <div className="ui input input-bd">
            <input
              className={textBoxBgColour}
              ref={prepKitInputRef}
              placeholder="000000/00000"
              type="text"
              onBlur={validatePrepInput}
              value={
                samplePrepKit
                  ? lotNo
                    ? `${samplePrepKit + "/" + lotNo}`
                    : samplePrepKit
                  : samplePrepKit
              }
              onInput={(e) => handlePrepKitInput(e.target.value)}
            />
            <button
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
              {/* <svg id="Icon_pencil" className="!h-[2.7vh]" data-name="Icon / pencil" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 40 40">
                    <g id="MDI_pencil" data-name="MDI / pencil">
                        <g id="Boundary" fill="#8b8b8b" stroke="rgba(0,0,0,0)" stroke-width="1" opacity="0">
                        <rect  stroke="none"/>
                        <rect x="0.5" y="0.5" fill="none"/>
                        </g>
                        <path id="Path_pencil" data-name="Path / pencil" d="M36.45,10.633a1.881,1.881,0,0,0,0-2.663L32.03,3.55a1.881,1.881,0,0,0-2.663,0L25.892,7.006l7.083,7.083M3,29.917V37h7.083l20.89-20.909L23.89,9.008Z" transform="translate(0 0.003)" fill="#8b8b8b"/>
                    </g>
                    </svg> */}
            </button>
          </div>
        </div>
        <div className="inpCont mt-[2.08vh] flex flex-col">
          <label className="inpTxt   font-semibold pb-1">
            Test Panel Tag REF / SN
          </label>
          <div className="ui input input-bd">
            <input
              className={testPanelBgColour}
              ref={testPanelInputRef}
              type="text"
              placeholder="000000/000000000"
              onBlur={validateTestPanelInput}
              value={
                TestPanel
                  ? serialNo
                    ? `${TestPanel + "/" + serialNo}`
                    : TestPanel
                  : TestPanel
              }
              onInput={(e) => handleInput(e.target.value)}
            />
            <button
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
              {/* <svg id="Icon_pencil" className="!h-[2.7vh]" data-name="Icon / pencil" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 40 40">
                    <g id="MDI_pencil" data-name="MDI / pencil">
                        <g id="Boundary" fill="#8b8b8b" stroke="rgba(0,0,0,0)" stroke-width="1" opacity="0">
                        <rect  stroke="none"/>
                        <rect x="0.5" y="0.5" fill="none"/>
                        </g>
                        <path id="Path_pencil" data-name="Path / pencil" d="M36.45,10.633a1.881,1.881,0,0,0,0-2.663L32.03,3.55a1.881,1.881,0,0,0-2.663,0L25.892,7.006l7.083,7.083M3,29.917V37h7.083l20.89-20.909L23.89,9.008Z" transform="translate(0 0.003)" fill="#8b8b8b"/>
                    </g>
                    </svg> */}
            </button>
          </div>
        </div>
      </div>
      <ErrorSampleMsg />
    </div>
  );
};

export default memo(SampleInputGuidedScreen);
