import { useAdvTimerStore } from "../../storeAdv/advTimers";
import { useAdvUiStore } from "../../storeAdv/advUi";
import { useWarningsStore } from "../../store/warnings";
//import { useAdvTestDataStore } from '../../storeAdv/advTestData'
// import { useHeaterStore } from "../../store/heaterStore"
import React, { useCallback, useContext, useEffect } from "react";
import { IncubationContext } from "../../context/incubationTimer";

const CommentForm = ({ scanningForPos }) => {
  const {commentMsg, setCommentMsg, isCommentFlagged, setIsCommentFlagged } =
    useAdvUiStore();
  const { hasTimeElapsed } = useContext(IncubationContext);

  const handleErrorMsg = useCallback(
    (value) => {
      setCommentMsg(value);
    },
    [setCommentMsg]
  );
  const {setSampleFlag, removeFlagWarning, setSampleHeatingtimeExpired, removeHeatingTimeWarning} = useWarningsStore();

  const setCommentFlag = (value) => {
    if(value){
      setSampleFlag(scanningForPos, value);
    }else{
      removeFlagWarning(scanningForPos);
    }
  }

  useEffect(() => {
    if (hasTimeElapsed) {
      handleErrorMsg(
        "Incubation time was over 35 minutes. Use caution interpreting the results."
      );
      setSampleHeatingtimeExpired(scanningForPos, true);
    }else{
      removeHeatingTimeWarning(scanningForPos);
    }
  }, [handleErrorMsg, hasTimeElapsed]);

  useEffect(() => {
    setCommentFlag(isCommentFlagged);
  }, [isCommentFlagged]);


  return (
    <div className="grid h-[100%] self-center justify-self-center">
      <div
        className="self-end"
        style={{ marginTop: "8vh", marginBottom: "4vh" }}
      >
        <div className="flex justify-between w-[27.86vw] !pb-[1.217vh]">
          <h3
            className="!text-[2.43vh] font-bold"
            style={{ alignSelf: "center" }}
          >
            {" "}
            Comments:
          </h3>

          <svg
            id="Icon_flag"
            className="w-[3.47vh]"
            onClick={() => setIsCommentFlagged(!isCommentFlagged)}
            data-name="Icon / flag"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 40 40"
          >
            <g id="MDI_flag" data-name="MDI / flag">
              <g
                id="Boundary"
                fill="#8b8b8b"
                stroke="rgba(0,0,0,0)"
                strokeWidth="1"
                opacity="0"
              >
                <rect width="40" height="40" stroke="none" />
                <rect x="0.5" y="0.5" width="39" height="39" fill="none" />
              </g>
              <path
                id="Path_flag"
                data-name="Path / flag"
                d="M24.427,7.882,23.6,4H5V37H9.133V23.412H20.707l.827,3.882H36V7.882Z"
                fill={`${isCommentFlagged ? `#D94444` : `#8b8b8b`}`}
              />
            </g>
          </svg>
        </div>
        <textarea
          id="commentBeg"
          style={{ width: "100%", resize: "none" }}
          onChange={(event) => handleErrorMsg(event.target.value)}
          rows="10"
          cols="100"
          defaultValue={
            hasTimeElapsed
              ? "Incubation time was over 35 minutes. Use caution interpreting the results."
              : commentMsg
          }
        ></textarea>
        <br />
        {/* <input type="submit"  value="Submit" onClick={handleError} />
                     <input type="submit" className="mx-2" value="Discard" onClick={handleError} /> */}
      </div>
    </div>
  );
};

const SampleDetectedScreen = ({
  handleScannerClose,
  sampleDetectionState,
  sampleId,
  testPanelId,
}) => {
  // const {setStartCamera} = useAdvUiStore()
  //const {begSamples} = useHeaterStore()
  const { incubationTimer } = useAdvTimerStore();
  //old code
  // const handleClose =()=>{
  //     setStartCamera(false)
  // }
  const displayTimerInWords = (v) => {
    return Math.floor(v / 60);
  };
  const renderIcon = (status) => {
    switch (status) {
      case 0:
        return <img id="simg" alt="icon 1" src="images/results detected.png" />;
      case 1:
        return (
          <img id="simg" alt="icon 1" src="images/results not detected.png" />
        );
      case 2:
        return <img id="simg" alt="icon 1" src="images/results_invalid.png" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="grid sampleDetectionBeg h-full h-[67.82vh] border-3rem !text-[3.30vh]">
        <div
          className="font-semibold  self-center justify-self-center absolute !top-[3.47vh]"
          style={{ paddingTop: "2.5vh" }}
        >
          {/*begSamples[sampleId]*/}{" "}
          {testPanelId
            ? testPanelId.split("-")[0] === "100040"
              ? "SARS-CoV-2 Panel"
              : "Skin Infection Viral Test Panel"
            : ""}
        </div>
        <div className="grid grid-cols-2">
          <div className="self-end my-[6.43vh] !ml-[3.75vw] !h-[46.53vh] relative">
            {sampleDetectionState.map(({ sampleName, status }, index) => (
              <React.Fragment key = {index}>
                <div className={`font-semibold  !text-[#292929]`}>
                  {sampleName === "Controls" && index === 0 ? (
                    <>
                      <div id="sampleResult" className="!pb-[1.39vh]">
                        {renderIcon(status)}
                        <div className={`font-semibold !text-[#292929]`}>
                          {"Controls | Invalid"}
                        </div>
                      </div>
                    </>
                  ) : sampleName !== "Controls" && index === 0 ? (
                    <>
                      <div id="sampleResult" className="!pb-[1.39vh]">
                        <img
                          id="simg"
                          alt="icon 1"
                          src="images/results_correct.png"
                        />
                        <div className={`font-semibold !text-[#292929]`}>
                          {"Controls | Valid"}
                        </div>
                      </div>
                      <div id="sampleResult" className="!pb-[1.39vh]">
                        {renderIcon(status)}
                        <div
                          className={`font-semibold  ${
                            status === 0 ? `!text-[#D94444]` : `!text-[#292929]`
                          }`}
                        >
                          {sampleName} |{" "}
                          {status === 2
                            ? "Invalid"
                            : status === 0
                            ? "Detected"
                            : "Not Detected"}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div id="sampleResult" className="!pb-[1.39vh]">
                      {renderIcon(status)}
                      <div
                        className={`font-semibold  ${
                          status === 0 ? `!text-[#D94444]` : `!text-[#292929]`
                        }`}
                      >
                        {sampleName} |{" "}
                        {status === 2
                          ? "Invalid"
                          : status === 0
                          ? "Detected"
                          : "Not Detected"}
                      </div>
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}
            {/*
                    sampleDetectionState.map(({sampleName, status}, index) => (
                       <div id="sampleResult" className="!pb-[1.39vh]" >
                       {renderIcon(status)}
                       <div className={`font-semibold  ${(status == 0)?`!text-[#D94444]`:`!text-[#292929]`}`}>{sampleName} | {(status == 2) ? "Invalid" : ((status == 0) ? "Detected" : "Not Detected")}</div>
                   </div> ))
                */}
            <div className="absolute bottom-[0] !text-[2.43vh] ">
              Incubation time:{" "}
              {!isNaN(displayTimerInWords(incubationTimer[sampleId]))
                ? displayTimerInWords(incubationTimer[sampleId])
                : 0}{" "}
              minutes
            </div>
          </div>
          <CommentForm scanningForPos={sampleId}/>
        </div>
        {/* <Button className="nxtBtn" size="mini" positive onClick={handleScannerClose}>Ok</Button> */}
      </div>
      <div
        id="videoDisc"
        style={{
          minHeight: "15.21vh",
          maxWidth: "54vw",
          alignItems: "flex-end",
          paddingTop: "3.33vh",
          lineHeight: "3.47vh",
        }}
      >
        <div id="stepcount">Results</div>

        <div id="stepname" style={{ padding: "0px" }}>
          Review the results and make notes as needed.
          <br />
          To accept the results and start a new test, press Approve.
        </div>
      </div>
    </>
  );
};

export default SampleDetectedScreen;
