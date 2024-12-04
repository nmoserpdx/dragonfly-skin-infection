import React, { useEffect } from "react";
import { memo, useState, useRef } from "react";
import { SCAN_ERRORS } from "../../constants/sample";
import { useNonPersistentStates } from "../../store/noPersistentState";
import { useCurrentAdvTestDataStore } from "../../storeAdv/advCurrentSample";
import { checkForAlphanumeric, CalculateDateFromJDay } from "../../helpers";
import { useSampleStore } from "../../store/samples";
import { useConfigStore } from "../../store/appconfiguration";

const SampleInputAdvScreen = ({ setHeight }) => {
  const {
    currentAdvSamplePrepKit,
    currentAdvTestPanelID,
    currentAdvSampleID,
    currentAdvSerialNo,
    setCurrentAdvSamplePrepKit,
    setCurrentAdvSerialNo,
    currentAdvLotNo,
    setCurrentAdvLotNo,
    setCurrentAdvTestPanelID,
    setCurrentAdvSampleID,
  } = useCurrentAdvTestDataStore();
  const {
    isWrongSample,
    wrongMsg,
    wrongType,
    resetNoPersistentState,
    setIsWrongTestSample,
    wrongTestPanelMsg,
    setWrongTestPanelMsg,
    setWrongTestPanelType,
    wrongTestPanelType,
    isWrongTestSample,
    sampleIDscanned,
    setsampleIDScanned,
  } = useNonPersistentStates();

  const useFocus = () => {
    const htmlElRef = useRef(null);
    const setFocus = () => {
      htmlElRef.current && htmlElRef.current.focus();
    };
    return [htmlElRef, setFocus];
  };

  const [textBoxBgColour, settextBoxBgColour] = useState("!bg-[#EFEFEF]");
  const [testPanelBgColour, settestPanelBgColour] = useState("!bg-[#EFEFEF]");
  const [sampleIDBgColour, settestsampleIDBgColour] = useState("!bg-[#EFEFEF]");
  const [sampleInputRef, setSampleInputFocus] = useFocus();
  const [prepKitInputRef, setPrepKitInputFocus] = useFocus();
  const [testPanelInputRef, setTestPanelInputFocus] = useFocus();
  const { allowExpiry } = useSampleStore();
  const { sample_ids, test_panel_ids } = useConfigStore()
  // const PREP_KIT = JSON.parse(localStorage.getItem('sampleids')).ids
  //                 ? JSON.parse(localStorage.getItem('sampleids')).ids
  //                 : ['100006', '100104', '100350']
  const PREP_KIT = sample_ids
  // const TEST_PANEL = JSON.parse(localStorage.getItem('testpanels')).ids
  //                   ? JSON.parse(localStorage.getItem('testpanels')).ids
  //                   : ['100051','100040', '100069']
  const TEST_PANEL = test_panel_ids

  useEffect(() => {
    if (currentAdvSamplePrepKit && currentAdvLotNo) {
      if (currentAdvSamplePrepKit.length === 6) {
        //  + currentAdvLotNo.length REMOVED AS PER NEW REQ
        if (PREP_KIT.indexOf(currentAdvSamplePrepKit) !== -1) {
          if (isWrongSample) {
            if (wrongType !== SCAN_ERRORS["NONE"]) {
              settextBoxBgColour("!bg-[#F2CBCB]");
            } else {
              settextBoxBgColour("!bg-[#a7e1b7]");
            }
          } else {
            settextBoxBgColour("!bg-[#a7e1b7]");
          }
        } else {
          settextBoxBgColour("!bg-[#F2CBCB]");
        }
      } else {
        settextBoxBgColour("!bg-[#F2CBCB]");
      }
    }
    if (currentAdvTestPanelID && currentAdvSerialNo) {
      if (currentAdvTestPanelID.length + currentAdvSerialNo.length === 15) {
        if (TEST_PANEL.indexOf(currentAdvTestPanelID) !== -1) {
          if (isWrongTestSample) {
            if (wrongTestPanelType !== SCAN_ERRORS["NONE"]) {
              settestPanelBgColour("!bg-[#F2CBCB]");
            } else {
              settestPanelBgColour("!bg-[#a7e1b7]");
            }
          } else {
            settestPanelBgColour("!bg-[#a7e1b7]");
          }
        } else {
          settestPanelBgColour("!bg-[#F2CBCB]");
        }
      } else {
        settestPanelBgColour("!bg-[#F2CBCB]");
      }
    }

    if (sampleIDscanned) {
      settestsampleIDBgColour("!bg-[#a7e1b7]");
    }
  }, [
    currentAdvLotNo,
    currentAdvSamplePrepKit,
    currentAdvSerialNo,
    currentAdvTestPanelID,
    isWrongSample,
    isWrongTestSample,
    wrongTestPanelType,
    wrongType,
    sampleIDscanned,
  ]);

  // useEffect(() => {
  //    setTestPanelHook(serialNo?TestPanel+'/'+serialNo:TestPanel)
  //    console.log(TestPanel)
  //   },[TestPanel,serialNo]);
  const handleTestPanelInput = (v) => {
    // setTestPanelHook(v.replace(/\//g,""))
    if (v.length > 6) {
      if (checkForAlphanumeric(v)) {
        setCurrentAdvSerialNo(v.replace(/\//g, "").slice(6));
      }
    } else {
      if (checkForAlphanumeric(v)) {
        setCurrentAdvTestPanelID(v);
      }
      if (!currentAdvTestPanelID) {
        setCurrentAdvSerialNo("");
      }
    }
  };

  const validatePrepInput = (e) => {
    if (currentAdvSamplePrepKit) {
      if (currentAdvSamplePrepKit.length > 0) {
        let samplekit = currentAdvSamplePrepKit; //[scanningForPos].substr(0, currentAdvSamplePrepKit[scanningForPos].indexOf('/'));
        if (typeof samplekit !== "undefined") {
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
    }
    setHeight(false);
  };

  const checkForExpiry = (date) => {
    if(allowExpiry){
      return true;
    }
    return date > new Date();
  };

  const validateTestPanelInput = () => {
    if (TEST_PANEL.indexOf(currentAdvTestPanelID) !== -1) {
      resetNoPersistentState();
      settestPanelBgColour("!bg-[#a7e1b7]");
      // setTestPanel('')
    } else {
      setIsWrongTestSample(true);
      setWrongTestPanelType(SCAN_ERRORS["INVALID_TEST_PANEL"]);
      setWrongTestPanelMsg(`Test panel id is Invalid`);
      settestPanelBgColour("!bg-[#F2CBCB]");
    }

    if (currentAdvSerialNo) {
      if (currentAdvSerialNo.length !== 9) {
        setIsWrongTestSample(true);
        setWrongTestPanelMsg(
          "The length of the serial number should be 9 digits."
        );
        setWrongTestPanelType(SCAN_ERRORS["INVALID_TEST_PANEL"]);
        settestPanelBgColour("!bg-[#F2CBCB]");
      } else {
        var expiryDate = CalculateDateFromJDay(
          parseInt(currentAdvSerialNo.slice(1, 4)),
          currentAdvSerialNo.slice(0, 1)
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
    setHeight(false);
  };

  const handleAdvPrepKitInput = (v) => {
    if (v.length > 6) {
      setCurrentAdvLotNo(v.replace(/\//g, "").slice(6));
      //setAdvLotNo(scanningForPos, v.replace(/\//g,"").slice(6))
    } else {
      setCurrentAdvSamplePrepKit(v);
    }
    if (!currentAdvSamplePrepKit) {
      setCurrentAdvLotNo("");
    }
    // if(v.length===6){
    //     validateTestPanelInput()
    //     console.log(TestPanel)
    // }
  };

  const handleSampleInput = (value) => {
    setCurrentAdvSampleID(value);
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
        setCurrentAdvSampleID(sampleId);
        settestsampleIDBgColour("!bg-[#a7e1b7]");
        setsampleIDScanned(true);
      }
    }
    setHeight(false);
  };

  const clearSampleId = () => {
    setCurrentAdvSampleID("");
    setSampleInputFocus();
    settestsampleIDBgColour("!bg-[#efefef]");
    setsampleIDScanned(false);
  };

  const clearPrepKit = () => {
    setCurrentAdvSamplePrepKit("");
    setCurrentAdvLotNo("");
    setPrepKitInputFocus();
  };

  const clearTestPanelTag = () => {
    setCurrentAdvTestPanelID("");
    setCurrentAdvSerialNo("");
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
        Scan each item to record the following information. <br /> Tap in the
        field for keyboard entry{" "}
      </div>
      <div className="mt-[5.04vh] !max-w-[20.83vw]">
        <div className="inpCont !mt-[2.08vh] flex flex-col ">
          <label className="inpTxt   font-semibold pb-1">Sample ID</label>
          <div className="ui input input-bd !rounded-[8px] !min-h-[4.86vh]">
            <input
              ref={sampleInputRef}
              className={sampleIDBgColour}
              type="text"
              onBlur={(e) => {
                validateSampleInput(e.target.value);
              }}
              onFocus={() => setHeight(true)}
              placeholder="Scan or enter code"
              value={currentAdvSampleID}
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
              {/* <svg
								id='Icon_pencil'
								className='!h-[2.7vh]'
								data-name='Icon / pencil'
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 40 40'
							>
								<g id='MDI_pencil' data-name='MDI / pencil'>
									<g
										id='Boundary'
										fill='#8b8b8b'
										stroke='rgba(0,0,0,0)'
										stroke-width='1'
										opacity='0'
									>
										<rect stroke='none' />
										<rect x='0.5' y='0.5' fill='none' />
									</g>
									<path
										id='Path_pencil'
										data-name='Path / pencil'
										d='M36.45,10.633a1.881,1.881,0,0,0,0-2.663L32.03,3.55a1.881,1.881,0,0,0-2.663,0L25.892,7.006l7.083,7.083M3,29.917V37h7.083l20.89-20.909L23.89,9.008Z'
										transform='translate(0 0.003)'
										fill='#8b8b8b'
									/>
								</g>
							</svg> */}
            </div>
          </div>
        </div>
        <div className="inpCont !mt-[2.08vh] flex flex-col">
          <label className="inpTxt   font-semibold pb-1">
            Sample Preparation Kit REF / LOT
          </label>
          <div className="ui input input-bd !min-h-[4.86vh]">
            <input
              ref={prepKitInputRef}
              className={textBoxBgColour}
              placeholder="000000/00000"
              type="text"
              onBlur={validatePrepInput}
              onFocus={() => setHeight(true)}
              // value={currentAdvSamplePrepKit}
              value={
                currentAdvSamplePrepKit
                  ? currentAdvLotNo
                    ? `${currentAdvSamplePrepKit + "/" + currentAdvLotNo}`
                    : currentAdvSamplePrepKit
                  : currentAdvSamplePrepKit
              }
              // onInput={e => {
              // 	setCurrentAdvSamplePrepKit(e.target.value)
              // }}
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
              {/*<svg
								id='Icon_pencil'
								className='!h-[2.7vh]'
								data-name='Icon / pencil'
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 40 40'
							>
								<g id='MDI_pencil' data-name='MDI / pencil'>
									<g
										id='Boundary'
										fill='#8b8b8b'
										stroke='rgba(0,0,0,0)'
										stroke-width='1'
										opacity='0'
									>
										<rect stroke='none' />
										<rect x='0.5' y='0.5' fill='none' />
									</g>
									<path
										id='Path_pencil'
										data-name='Path / pencil'
										d='M36.45,10.633a1.881,1.881,0,0,0,0-2.663L32.03,3.55a1.881,1.881,0,0,0-2.663,0L25.892,7.006l7.083,7.083M3,29.917V37h7.083l20.89-20.909L23.89,9.008Z'
										transform='translate(0 0.003)'
										fill='#8b8b8b'
									/>
								</g>
							</svg> */}
            </div>
          </div>
        </div>
        <div className="inpCont !mt-[2.08vh] flex flex-col">
          <label className="inpTxt   font-semibold pb-1">
            Test Panel Tag REF / SN
          </label>
          <div className="ui input input-bd !min-h-[4.86vh]">
            <input
              ref={testPanelInputRef}
              className={testPanelBgColour}
              type="text"
              placeholder="000000/000000000"
              onBlur={validateTestPanelInput}
              onFocus={() => setHeight(true)}
              value={
                currentAdvTestPanelID
                  ? currentAdvSerialNo
                    ? currentAdvTestPanelID + "/" + currentAdvSerialNo
                    : currentAdvTestPanelID
                  : currentAdvTestPanelID
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
              {/* <svg
								id='Icon_pencil'
								className='!h-[2.7vh]'
								data-name='Icon / pencil'
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 40 40'
							>
								<g id='MDI_pencil' data-name='MDI / pencil'>
									<g
										id='Boundary'
										fill='#8b8b8b'
										stroke='rgba(0,0,0,0)'
										stroke-width='1'
										opacity='0'
									>
										<rect stroke='none' />
										<rect x='0.5' y='0.5' fill='none' />
									</g>
									<path
										id='Path_pencil'
										data-name='Path / pencil'
										d='M36.45,10.633a1.881,1.881,0,0,0,0-2.663L32.03,3.55a1.881,1.881,0,0,0-2.663,0L25.892,7.006l7.083,7.083M3,29.917V37h7.083l20.89-20.909L23.89,9.008Z'
										transform='translate(0 0.003)'
										fill='#8b8b8b'
									/>
								</g>
							</svg> */}
            </div>
          </div>
        </div>
      </div>
      {(isWrongSample || isWrongTestSample) && (
        <ErrorSampleMsgAdv
          type={wrongType === 0 ? wrongTestPanelType : wrongType}
          msg={wrongMsg === "" ? wrongTestPanelMsg : wrongMsg}
        />
      )}
    </div>
  );
};

export default memo(SampleInputAdvScreen);

const ErrorSampleMsgAdv = ({ type, msg }) => {
  return (
    <div
      className="!text-[2.58vh] pt-[2vh] text-[#D94444] errorleading errorNewLine"
      style={{ maxWidth: "600px" }}
    >
      <img
        className="w-[2.08vw]"
        src="assets/icons/warning.svg"
        alt="warning"
      />
      {msg}
    </div>
  );
};
