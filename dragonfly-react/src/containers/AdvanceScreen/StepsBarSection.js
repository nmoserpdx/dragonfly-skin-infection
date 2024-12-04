import React, { memo, useState, useEffect } from "react";
import { useAdvHeaterStore } from "../../storeAdv/advHeater";
import { useAdvSampleStore } from "../../storeAdv/advSample";
import { Button, Modal } from "semantic-ui-react";
import StepsProgressBar from "./StepsProgressBar";
import { useAdvTimerStore } from "../../storeAdv/advTimers";
import { AdvanceInstructions } from "../../logic/instructions";
import { secondsToTime } from "../../helpers";
import {
  ADV_TIMER_FOR_SCAN,
  ADV_TIMER_FOR_VOID,
  AT_MAX_TIME,
  INCUBATION_TIME_ALERT_LIMIT,
  EXTRA_TIME,
} from "../../constants";
import { useAdvUiStore } from "../../storeAdv/advUi";
import { useAdvTestDataStore } from "../../storeAdv/advTestData";
import UnloadPopUpWithHeater from "../../components/UnloadPopUpWithHeater";
// import { TEST_PANEL_TYPE } from '../../constants/sample'
import EditPencilButton from "../../components/EditPencilButton";
// import { setUncaughtExceptionCaptureCallback } from 'process'

const ErrorForm = ({ sampleNo, handleError }) => {
  const [errorName, setErrorName] = useState([]);
  // const [errorMsg, setErrorMsg] = useState('')
  const handleErrorName = (name) => {
    if (errorName.includes(name)) {
      setErrorName(errorName.filter((prev) => prev !== name));
    } else {
      setErrorName([...errorName, name]);
    }
  };

  //old code below
  /*
	const handleErrorMsg = value => {
		setErrorMsg(value)
	}*/

  return (
    <div className="ErrorForms">
      <div className="arrow-up"></div>
      <div className="Error">
        <p>select step from dropdown </p>
        <div
          style={{
            display: "flex",
            flexFlow: "row",
            columnGap: "10px",
          }}
        >
          <div>
            <input
              type="checkbox"
              onChange={(event) => handleErrorName(event.target.name)}
              defaultChecked={errorName.includes("scan")}
              id="Scan"
              name="Scan"
              value="Scan"
            />
            <label for="Scan"> Scan</label>
            <br />
            <input
              type="checkbox"
              onChange={(event) => handleErrorName(event.target.name)}
              id="Lyse"
              name="Lyse"
              value="Lyse"
            />
            <label for="Lyse"> Lyse</label>
            <br />
            <input
              type="checkbox"
              onChange={(event) => handleErrorName(event.target.name)}
              id="Wash"
              name="Wash"
              value="Wash"
            />
            <label for="Wash"> Wash</label>
            <br />
            <input
              type="checkbox"
              onChange={(event) => handleErrorName(event.target.name)}
              id="Dry"
              name="Dry"
              value="Dry"
            />
            <label for="Dry"> Dry</label>
            <br />
          </div>
          <div>
            <input
              type="checkbox"
              onChange={(event) => handleErrorName(event.target.name)}
              id="Elute"
              name="Elute"
              value="Elute"
            />
            <label for="Elute"> Elute</label>
            <br />
            <input
              type="checkbox"
              onChange={(event) => handleErrorName(event.target.name)}
              id="Load"
              name="Load"
              value="Load"
            />
            <label for="Load"> Load</label>
            <br />
            <input
              type="checkbox"
              onChange={(event) => handleErrorName(event.target.name)}
              id="Heat"
              name="Heat"
              value="Heat"
            />
            <label for="Heat"> Heat</label>
            <br />
            <input
              type="checkbox"
              onChange={(event) => handleErrorName(event.target.name)}
              id="Result"
              name="Result"
              value="Result"
            />
            <label for="Result"> Result</label>
            <br />
          </div>
        </div>
        {/* <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" />
                     <label for="vehicle1"> I have a bike</label>
                     <input type="checkbox" id="vehicle2" name="vehicle2" value="Car" />
                     <label for="vehicle2"> I have a car</label>
                     <input type="checkbox" id="vehicle3" name="vehicle3" value="Boat" />
                     <label for="vehicle3"> I have a boat</label> */}
        <p>desribe Error</p>
        {/* <textarea id="errortext" onChange={(event) => handleErrorMsg(event.target.value)} rows="2" cols="50">

                     </textarea> */}
        <br />
        <input type="submit" value="Submit" onClick={handleError} />
        <input
          type="submit"
          className="mx-2"
          value="Discard"
          onClick={handleError}
        />
      </div>
    </div>
  );
};
const StepsBarSection = ({
  sampleNo,
  handleConfirmHeater,
  removeThisHeater,
  removeThisSample,
  setHeight,
  scrollToDiv,
}) => {
  const [errorForm, SetErrorForm] = useState(false);
  const [isSampleIdInputDisabled, setIsSampleIdInputDisabled] = useState(true);
  const {
    setScanningForPos,
    setCurrentAdvSampleNo,
    advSamples,
    setAdvSamples,
    advSampleCompletedStep,
    setAdvSampleCompletedStep,
    advSamplesPos,
    setSamplesReadyForCapture,
    samplesReadyForCapture,
  } = useAdvSampleStore();
  const { setIsAdvScanning, setIsDirectResultCapture, isUnload } =
    useAdvUiStore();
  const {
    activeTimer,
    timerForSamplePos,
    removeTimerForSamplePos,
    pauseTimer,
    setIncubationTimer,
    incubationTimer,
    advPopUp,
    addToAdvPopUp,
    removeFromAdvPopUp,
    advPopUpExpiry,
  } = useAdvTimerStore();
  const {
    isHeaterModal,
    setIsHeaterModal,
    setIsHeaterButtonsEnable,
    isHeaterButtonsEnable,
  } = useAdvHeaterStore();
  const { setLoad } = useAdvHeaterStore();
  const [timeGapBetweenPopUp, setTimeGapBetweenPopUp] = useState(false);
  const { advTestPanelID, setAdvSampleID } = useAdvTestDataStore();
  const [showUnloadPopupWithHeater, setShowUnloadPopupWithHeater] =
    useState(false);
  //const [confirmPopUp, setConfirmPopup] = useState(false)
  const handleError = () => {
    SetErrorForm(!errorForm);
  };
  const { setIsAdvQRcode, setIsCancelMsgModal } = useAdvUiStore();
  const [completed, setcompleted] = useState([]);
  // const [popUp, setPopUp] = useState('')
  const [unloadPopUp, setUnloadPopUp] = useState(false);
  // const pos = advSamplesPos[sampleNo]
  // 	? advSamplesPos[sampleNo].slice(1, 2)
  // 	: '0'
  const [confirmUnloadPopUp, setConfirmUnloadPopUp] = useState(false);
  const displayTimer = (v) => {
    let timer = secondsToTime(v);

    return timer.h !== "00"
      ? `${timer.h}:${timer.m}:${timer.s}`
      : `${timer.m}:${timer.s}`;
  };
  //old code below
  /*
	const displayTimerInWords = val => {
		let timer = secondsToTime(val)

		return timer.m !== '00'
			? `${timer.m} mins, ${timer.s} secs`
			: `${timer.s}secs `
	} */
  useEffect(() => {
    if (timerForSamplePos[sampleNo]) {
      if (!timerForSamplePos[sampleNo].isPaused) {
        if (
          timerForSamplePos[sampleNo].heaterTimerEndsAt &&
          timerForSamplePos[sampleNo].heaterTimerEndsAt - activeTimer >= 0
        ) {
        } else if (
          timerForSamplePos[sampleNo].heaterTimerEndsAt &&
          timerForSamplePos[sampleNo].heaterTimerEndsAt - activeTimer < 0 &&
          !samplesReadyForCapture.includes(sampleNo)
        ) {
          // setIncubationTimer(sampleNo,displayTimer(0))

          setSamplesReadyForCapture([...samplesReadyForCapture, sampleNo]);
          // pauseTimer(sampleNo,activeTimer)

          addToAdvPopUp([...advPopUp, sampleNo]);
        }
        if (
          advPopUpExpiry &&
          advPopUpExpiry[sampleNo] < incubationTimer[sampleNo] &&
          !advPopUp.includes(sampleNo)
        ) {
          // console.log(advPopUpExpiry[sampleNo], "c", incubationTimer[sampleNo]);
          // pauseTimer(sampleNo,activeTimer)

          addToAdvPopUp([...advPopUp, sampleNo]);
        }

        setIncubationTimer(
          sampleNo,
          activeTimer -
            timerForSamplePos[sampleNo].heaterTimerEndsAt +
            ADV_TIMER_FOR_SCAN
        );
      }
    }
  }, [activeTimer]);

  const handleRemove = () => {
    // console.log(typeof advSamples[sampleNo]==="undefined")
    //samplesReadyForCapture.includes(sampleNo)||(typeof advSamples[sampleNo]==="undefined")?removeThisSampleChild():
    setIsCancelMsgModal(true, sampleNo);
  };

  const handleComplete = (value) => {
    setcompleted((prevComplete) => {
      return [...prevComplete, value];
    });
  };
  const handleScan = (value) => {
    setLoad(null, null);
    setScanningForPos(sampleNo);
    if (!advSampleCompletedStep[sampleNo].includes("scan")) {
      setAdvSampleCompletedStep(sampleNo, "scan");
    }
    setIsAdvScanning(true);

    if (!advSamples[sampleNo]) {
      createSample();
    }
  };
  const createSample = () => {
    const epoch = Math.floor(new Date().getTime() / 100);
    // console.log(setAdvSamples, setAdvSampleID);
    setAdvSamples(sampleNo, epoch.toString());
    setAdvSampleID(sampleNo, epoch.toString());
  };

  const handlePauseTimer = () => {
    // This is for old advanced unloading flow --> Not being used right now
    pauseTimer(sampleNo, activeTimer);

    //Commenting the below code as it is not required
    //setIsUnloadScreen(true, sampleNo)
    //setPopUp(false)
    // console.log(timerForSamplePos[sampleNo])
  };

  const handleUnload = () => {
    setShowUnloadPopupWithHeater(true);
  };

  useEffect(() => {
    let timer1 = setTimeout(() => setTimeGapBetweenPopUp(false), 1000);

    return () => {
      clearTimeout(timer1);
    };
  }, [timeGapBetweenPopUp]);

  //old code below
  /*
	const popUpUnloadHeater = () => {
		pauseTimer(sampleNo, activeTimer)

		removeThisHeater(sampleNo)
		removeFromAdvPopUp(sampleNo, activeTimer)
	}
	const handleResumeTimer = () => {
		handleHeaterModal()
		// resumeTimer(sampleNo,activeTimer+(timerForSamplePos[sampleNo].heaterTimerEndsAt - timerForSamplePos[sampleNo].pausedAt))
		// console.log(activeTimer,timerForSamplePos[sampleNo].pausedAt,timerForSamplePos[sampleNo].timerInsertedAt)
	}*/
  const handleResultScan = () => {
    setScanningForPos(sampleNo);
    setIsAdvQRcode(true);
    setIsAdvScanning(true);
  };
  const handleLoadScan = () => {
    if (advTestPanelID[sampleNo]) {
      handleResultScan();
    } else {
      setIsDirectResultCapture(true);
      handleScan();
    }
    // advSamples[sampleNo]?
    // handleResultScan():
    // handleScan()
  };
  const openScanScreen = () => handleResultScan();

  const popUpScan = () => {
    // resumeTimer(sampleNo,activeTimer+(timerForSamplePos[sampleNo].heaterTimerEndsAt - timerForSamplePos[sampleNo].pausedAt))
    handleLoadScan();
    removeFromAdvPopUp(sampleNo);
  };
  const handleHeaterModal = () => {
    setLoad(null, null);
    setCurrentAdvSampleNo(sampleNo);
    setIsHeaterModal(!isHeaterModal);
    setIsHeaterButtonsEnable(!isHeaterButtonsEnable);
  };
  const removeThisSampleChild = () => {
    setConfirmUnloadPopUp(false);
    setUnloadPopUp(false);
    setLoad(null, null);
    if (timerForSamplePos[sampleNo]) {
      removeTimerForSamplePos(sampleNo);
    }
    removeThisSample(sampleNo);
  };
  const handleUnloadHeaterClose = (id, val) => {
    setTimeGapBetweenPopUp(true);
    val ? setUnloadPopUp(false) : setUnloadPopUp(true);
  };
  const addExtraTime = () => {
    if (incubationTimer[sampleNo] > INCUBATION_TIME_ALERT_LIMIT) {
      removeFromAdvPopUp(sampleNo);
      setTimeGapBetweenPopUp(true);
      return;
    }
    setTimeGapBetweenPopUp(true);
    var extra = EXTRA_TIME;
    if (incubationTimer[sampleNo] < ADV_TIMER_FOR_SCAN + ADV_TIMER_FOR_VOID) {
      //30 mins
      extra =
        ADV_TIMER_FOR_SCAN + ADV_TIMER_FOR_VOID - incubationTimer[sampleNo];
    } else if (
      incubationTimer[sampleNo] <
      ADV_TIMER_FOR_SCAN + ADV_TIMER_FOR_VOID + ADV_TIMER_FOR_VOID
    ) {
      //35 mins
      extra =
        ADV_TIMER_FOR_SCAN +
        ADV_TIMER_FOR_VOID +
        ADV_TIMER_FOR_VOID -
        incubationTimer[sampleNo];
    }

    // resumeTimer(sampleNo,activeTimer+(timerForSamplePos[sampleNo].heaterTimerEndsAt - timerForSamplePos[sampleNo].pausedAt))
    removeFromAdvPopUp(advPopUp[0], incubationTimer[sampleNo], extra);
  };
  const perc = Math.trunc(
    (+incubationTimer[sampleNo] / (ADV_TIMER_FOR_SCAN + ADV_TIMER_FOR_VOID)) *
      100
  );

  const handleBlur = () => {
    setHeight(false);
  };
  const handleFocus = () => {
    scrollToDiv(sampleNo);
  };

  return (
    <>
      <>
        {/*console.log(advPopUpExpiry,advPopUp,incubationTimer)*/}
        {advPopUp[0] === sampleNo &&
          !timeGapBetweenPopUp &&
          !isHeaterModal &&
          !isUnload &&
          advSamplesPos[sampleNo] && (
            <UnloadPopUpWithHeater
              id={advSamples[sampleNo]}
              sampleNo={sampleNo}
              pos={advSamplesPos[sampleNo].toString().slice(1, 2)}
              heaterNo={advSamplesPos[sampleNo].toString().slice(0, 1)}
              closeModal={addExtraTime}
              confirmPopUp={setConfirmUnloadPopUp}
              handleScan={popUpScan}
              isIncubationLimitExceded={incubationTimer[sampleNo] > AT_MAX_TIME}
              disableSound={timeGapBetweenPopUp}
              pauseTimer={handlePauseTimer}
            />
          )}
        {showUnloadPopupWithHeater && (
          <UnloadPopUpWithHeater
            id={advSamples[sampleNo]}
            sampleNo={sampleNo}
            pos={advSamplesPos[sampleNo].toString().slice(1, 2)}
            heaterNo={advSamplesPos[sampleNo].toString().slice(0, 1)}
            closeModal={() => setShowUnloadPopupWithHeater(false)}
            disableSound
            confirmPopUp={setConfirmUnloadPopUp}
            handleScan={openScanScreen}
            pauseTimer={handlePauseTimer}
          />
        )}
        {confirmUnloadPopUp && (
          <Modal
            open={true}
            className="!relative !w-[39.5vw] !h-[45vh] cancelModalBeg "
          >
            <div className="font-extrabold text-[2.78vh]  mb-[4.86vh]">
              Confirm test {advSamples[sampleNo]} in row{" "}
              <span style={{ textTransform: "uppercase" }}>
                {" "}
                {advSamplesPos[sampleNo]}
              </span>{" "}
              was removed from Heat Block.
              <br /> <br />
              Position{" "}
              <span style={{ textTransform: "uppercase" }}>
                {" "}
                {advSamplesPos[sampleNo]}
              </span>{" "}
              will be available for a new test.
            </div>
            <Modal.Actions className="!border-[0px] ">
              <Button
                className="backbtn confirmBtn m-0 modalBtnLeft !w-[11.97vw] !h-[5.04vh]"
                onClick={() => setConfirmUnloadPopUp(false)}
              >
                Dismiss
              </Button>

              <Button
                className="confirmBtn modalBtnRight !w-[11.97vw] !h-[5.04vh] "
                onClick={() => removeThisSampleChild()}
              >
                Confirm
              </Button>
            </Modal.Actions>
          </Modal>
        )}
        {unloadPopUp && (
          <UnloadPopUpWithHeater
            id={advSamples[sampleNo]}
            sampleNo={sampleNo}
            pos={advSamplesPos[sampleNo].toString().slice(1, 2)}
            heaterNo={advSamplesPos[sampleNo].toString().slice(0, 1)}
            closeModal={handleUnloadHeaterClose}
            confirmPopUp={setConfirmUnloadPopUp}
          />
        )}
        <div className="stepsBarContainer" id={`${sampleNo}`}>
          {/* {timerForSamplePos[sampleNo]?<><Button onClick={!timerForSamplePos[sampleNo].isPaused?handlePauseTimer:handleResumeTimer}>Pause</ Button>
            {displayTimer(activeTimer-timerForSamplePos[sampleNo].timerInsertedAt)}
            <br />
            {timerForSamplePos[sampleNo].isPaused?displayTimer(timerForSamplePos[sampleNo].pausedAt-timerForSamplePos[sampleNo].timerInsertedAt):displayTimer(ADV_TIMER_FOR_SCAN -(timerForSamplePos[sampleNo].pausedAt-timerForSamplePos[sampleNo].timerInsertedAt))}
            <br />{displayTimer(timerForSamplePos[sampleNo].heaterTimerEndsAt-activeTimer)}</>:""} */}
          <div className="stepsBarInputSampleContainer ">
            <button className="scanbtn " onClick={handleScan} name="scan">
              <img
                className="!min-w-[1.875vw]"
                src="assets/icons/QRscan.svg"
                alt="qrscan"
              />
            </button>

            {typeof advSamples[sampleNo] !== "undefined" ? (
              <div
                className={`sampleType ml-[2.6vw] px-2 !'text-[#292929] flex items-center border-2 ${
                  !isSampleIdInputDisabled
                    ? "border-blue-700"
                    : "border-stone-500"
                }`}
              >
                {/* {advSamples[sampleNo]}{' '}
								{advTestPanelID[sampleNo] &&
								typeof TEST_PANEL_TYPE[
									advTestPanelID[sampleNo]
								] !== 'undefined'
									? `| ${
											TEST_PANEL_TYPE[
												advTestPanelID[sampleNo]
											]
									  } `
									: ''} */}
                {/* <div> */}
                <div className="relative">
                  <input
                    type="text"
                    className="sampleType relative bg-transparent w-[17.55vw] h-[4.17vh] px-[0.36vw]"
                    style={{ zIndex: "+5" }}
                    value={advSamples[sampleNo]}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={(e) => {
                      setAdvSamples(sampleNo, e.target.value);
                    }}
                  />
                  {/*<div className="absolute right-[0.78vw] self-center flex items-center">
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
                {/* <input
									type='text'
									className='sampleType bg-transparent relative w-[17.55vw] h-[4.17vh] px-[0.36vw]'
									style={{ zIndex: '+5', outline: 'none' }}
									value={advSamples[sampleNo]}
									onChange={e => {
										setAdvSamples(sampleNo, e.target.value)
									}}
									disabled={isSampleIdInputDisabled}
									onBlur={() =>
										setIsSampleIdInputDisabled(true)
									}
								/> */}
                <div className="pl-2">
                  <EditPencilButton
                    onClick={() => setIsSampleIdInputDisabled(false)}
                  />
                </div>
                {/* </div> */}
              </div>
            ) : (
              <div className="sampleType ml-[2.6vw] !text-[#8B8B8B] min-w-[23.43vw]">
                Scan sample, prep kit and test panel
              </div>
            )}
            <div className="AdvError">
              {/* <button
								id='AdvError'
								className='mr-[3.22vw]'
								onClick={handleError}
								disabled={!advSamples[sampleNo]}
								name={sampleNo}
							>
								{' '}
								<img
									className='!min-w-[1.78vw]'
									src='assets/icons/comment.svg'
								/>
							</button> */}

              <button
                id="AdvError"
                className="removeSample"
                name={sampleNo}
                onClick={handleRemove}
              >
                <img
                  className="!min-w-[2.083vw]"
                  src="assets/icons/close.svg"
                  alt="close"
                />
              </button>
            </div>
          </div>

          <div className="stepContainer font-2rem">
            {errorForm && (
              <ErrorForm handleError={handleError} sampleNo={sampleNo} />
            )}

            {timerForSamplePos[sampleNo] ? (
              <>
                <div className="heaterNo uppercase !text-[#292929] font-bold text-[4.34vh]">
                  <span id="heaterNo">
                    {advSamplesPos[sampleNo] && advSamplesPos[sampleNo] !== 0
                      ? advSamplesPos[sampleNo]
                      : "?"}
                  </span>
                </div>
                <div>
                  <div className="stepBar bg-white !w-[70vw] !h-[5.56vh]">
                    <Button className="stepBarButtonTimer !text-[#292929] relative !bg-white !justify-between font-2rem tabular text-[#292929]">
                      <span>Heating</span>

                      <div>
                        {" "}
                        {incubationTimer[sampleNo] < ADV_TIMER_FOR_SCAN
                          ? "Remaining time: "
                          : "Elapsed time: "}
                        <span
                          className={` ${
                            !timerForSamplePos[sampleNo].isPaused &&
                            incubationTimer[sampleNo] >=
                              ADV_TIMER_FOR_SCAN + ADV_TIMER_FOR_VOID &&
                            `text-[#D94444]`
                          }`}
                        >
                          {incubationTimer[sampleNo] < ADV_TIMER_FOR_SCAN
                            ? displayTimer(
                                ADV_TIMER_FOR_SCAN - incubationTimer[sampleNo]
                              )
                            : displayTimer(incubationTimer[sampleNo])}
                        </span>
                      </div>
                      <div
                        style={{ width: `${perc}%` }}
                        className={`buttonabbtimer  !max-w-[70vw] ${
                          timerForSamplePos[sampleNo].isPaused &&
                          `!bg-[#8B8B8B]`
                        } ${
                          !timerForSamplePos[sampleNo].isPaused &&
                          incubationTimer[sampleNo] >= ADV_TIMER_FOR_SCAN &&
                          incubationTimer[sampleNo] <
                            ADV_TIMER_FOR_SCAN + ADV_TIMER_FOR_VOID &&
                          `!bg-[#F9C241]`
                        } ${
                          !timerForSamplePos[sampleNo].isPaused &&
                          incubationTimer[sampleNo] >=
                            ADV_TIMER_FOR_SCAN + ADV_TIMER_FOR_VOID &&
                          `!bg-[#D94444]`
                        }`}
                      />
                      {/* {activeTimer-timerForSamplePos[sampleNo].timerInsertedAt>0?displayTimer(activeTimer-timerForSamplePos[sampleNo].timerInsertedAt):""} */}
                    </Button>
                  </div>
                </div>
                {/*timerForSamplePos[sampleNo].isPaused && (
									<div>
										<div className='stepBar !bg-white !h-[5.56vh]'>
											<Button
												className={`stepBarButtonTimer !text-[#292929] !px-[0] font-2rem ${
													activeTimer -
														timerForSamplePos[
															sampleNo
														].heaterTimerEndsAt +
														ADV_TIMER_FOR_SCAN >
													100
														? `bg-red`
														: ''
												}`}
												onClick={handleResumeTimer}
											>
												load heater */}
                {/* {!timerForSamplePos[sampleNo].isPaused?displayTimer(timerForSamplePos[sampleNo].heaterTimerEndsAt-activeTimer)} */}
                {/* {samplesReadyForCapture.includes(sampleNo)?"":incubationTimer[sampleNo]} */}
                {/* </Button>
										</div>
									</div>
								) */}
              </>
            ) : (
              <>
                  {/* {console.log(AdvanceInstructions.step)} */}
                  {
                    AdvanceInstructions.steps.map((step,index) => (
                  <React.Fragment key={index}>
                      <StepsProgressBar
                      sampleNo={sampleNo}
                      step={step}
                      handleComplete={handleComplete}
                      completed={completed}
                    />
                  </React.Fragment>
                ))}

                <div className="stepBar bg-white ">
                  <Button
                    className="stepBarButtonTimer !text-[#292929] !bg-white font-2rem"
                    disabled={!advSamples[sampleNo]}
                    onClick={
                      timerForSamplePos[sampleNo] ? "" : handleHeaterModal
                    }
                  >
                    <div>Load</div>
                    <div className="buttonabb" />
                  </Button>
                </div>
              </>
            )}

            <div
              className={`stepBar !bg-white ${
                incubationTimer[sampleNo] > ADV_TIMER_FOR_SCAN &&
                incubationTimer[sampleNo] <
                  ADV_TIMER_FOR_SCAN + ADV_TIMER_FOR_VOID &&
                `!bg-[#F9C241]`
              } ${
                incubationTimer[sampleNo] >=
                  ADV_TIMER_FOR_SCAN + ADV_TIMER_FOR_VOID &&
                `!bg-[rgb(233,188,188)]`
              }
							  ${
                  advSamplesPos[sampleNo] && timerForSamplePos[sampleNo]
                    ? `stepBarButtonTimerUnload`
                    : ``
                }
							`}
              style={{ width: "17vw !important" }}
            >
              {advSamplesPos[sampleNo] && timerForSamplePos[sampleNo] ? (
                <Button
                  className={`stepBarButtonTimer !text-[#292929] !p-[0] font-2rem`}
                  onClick={handleUnload}
                  name="Heat"
                >
                  <div>Unload + Capture</div>
                </Button>
              ) : (
                <Button
                  className={`stepBarButtonTimer !text-[#292929] !p-[0] font-2rem`}
                  onClick={openScanScreen}
                  name="Heat"
                >
                  <div>Capture</div>
                </Button>
              )}
              {/* <Button  className="stepBarButton" disabled={!advSamples[sampleNo] && !advSampleCompletedStep[sampleNo].includes("Elute")} onClick={handleHeaterModal} name="Load">
        "Load"
       </Button> */}
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default memo(StepsBarSection);
