import { useAdvTimerStore } from "../../storeAdv/advTimers";
import { useAdvUiStore } from "../../storeAdv/advUi";
import { useAdvTestDataStore } from "../../storeAdv/advTestData";
import { useAdvSampleStore } from "../../storeAdv/advSample";
import { useTestDataStore } from "../../store/testData";
import { useWarningsStore } from "../../store/warnings";
import { useCallback, useContext, useEffect } from "react";
import { IncubationContext } from "../../context/incubationTimer";

export const CommentForm = ({ scanningForPos }) => {
  const { commentMsg, setCommentMsg, isCommentFlagged, setIsCommentFlagged } =
    useAdvUiStore();
  const {setSampleFlag, removeFlagWarning} = useWarningsStore();
  const { hasTimeElapsed } = useContext(IncubationContext);

  const handleErrorMsg = useCallback(
    (value) => {
      setCommentMsg(value);
    },
    [setCommentMsg]
  );

  const setCommentFlag = (value) => {
    if(value){
      setSampleFlag(scanningForPos, value);
    }else{
      removeFlagWarning(scanningForPos);
    }
  }

  useEffect(() => {
    setCommentFlag(isCommentFlagged);
  }, [isCommentFlagged]);

  useEffect(() => {
    if (hasTimeElapsed) {
      handleErrorMsg(
        "Incubation time was over 35 minutes. Use caution interpreting the results."
      );
    }
  }, [handleErrorMsg, hasTimeElapsed]);

  return (
    <>
      <div className="flex h-[100%] self-center">
        <div
          className="self-start"
          style={{ marginLeft: "15%", marginTop: "28%" }}
        >
          <div className="flex justify-between w-[32.68vw] pb-1">
            <h3 className="!text-[2.43vh] font-bold"> Comments:</h3>

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
            id="comment"
            style={{ padding: "2%" }}
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
        </div>
        {/* <input type="submit"  value="Submit" onClick={handleError} />
                     <input type="submit" className="mx-2" value="Discard" onClick={handleError} /> */}
      </div>
    </>
  );
};

const AdvSampleDetectedScreen = ({
  handleScannerClose,
  setIsManualScreen,
  scanningForPos,
  sampleDetectionState,
  SampleId,
  testPanel,
}) => {
  // const { hasTimerElapsed } = useContext(IncubationContext);
  const { advTestPanelID, advSerialNo } = useAdvTestDataStore();
  const { advSamples } = useAdvSampleStore();
  const { incubationTimer } = useAdvTimerStore();
  const displayTimerInWords = (v) => {
    return Math.floor(v / 60);
  };

  const testDataState = useTestDataStore();
  const { scannedSerialNo, scannedTestPanelId } = testDataState;

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
      <div className="flex relative Advdetectionscreen bg-[rgb(242,242,242)] h-[67.95vh] justify-self-center pb-[6.43vh] w-[72.65vw] border-3rem">
        <div
          className="flex flex-col h-full  relative pl-[4.06vw]"
          style={{ paddingTop: "16%", width: "46%" }}
        >
          <div>
            {sampleDetectionState.map(({ sampleName, status }, index) => (
              <div
                key={index}
                className={`font-semibold  !text-[#292929] !text-[3.21vh]`}
              >
                {sampleName === "Controls" && index === 0 ? (
                  <>
                    <div id="sampleResult">
                      {renderIcon(status)}
                      <div className={`font-semibold !text-[#292929]`}>
                        {"Controls | Invalid"}
                      </div>
                    </div>
                  </>
                ) : sampleName !== "Controls" && index === 0 ? (
                  <>
                    <div id="sampleResult">
                      <img
                        id="simg"
                        alt="icon 1"
                        src="images/results_correct.png"
                      />
                      <div className={`font-semibold !text-[#292929]`}>
                        {"Controls | Valid"}
                      </div>
                    </div>
                    <div id="sampleResult">
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
                  <div id="sampleResult">
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
            ))}
            {/*
            sampleDetectionState.map(({ sampleName, status }) => (
              <div id="sampleResult" >

               {status ? <img id="simg" src="images/results detected.png" /> : <img id="simg" src="images/results not detected.png" />}  <div className=" font-semibold  !text-[3.21vh]">{sampleName} | {status ? "Detected" : "Not Detected"}</div>
              </div>))
          */}
          </div>
          <div className="absolute bottom-[0] text-[2.43vh]">
            Incubation time:{" "}
            {!isNaN(displayTimerInWords(incubationTimer[scanningForPos]))
              ? displayTimerInWords(incubationTimer[scanningForPos])
              : 0}{" "}
            minutes
          </div>

          {/* <Button className="nxtBtn" size="mini" positive onClick={handleScannerClose}>Ok</Button> */}
        </div>
        <CommentForm scanningForPos={scanningForPos} />
      </div>
      <div style={{ paddingLeft: "20px" }}>
        <div className="inpCont !mt-[2.08vh] flex flex-col">
          <label className="inpTxt   font-semibold pb-1">Sample ID</label>
          <div className="ui input input-bd !min-h-[4.86vh]">
            <input
              className="!bg-[#CBEFD5]"
              placeholder="000000/00000"
              type="text"
              value={advSamples[scanningForPos]}
              onInput={(e) => {}}
            />
            {/*<div className="absolute right-[0.78vw] self-center">
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
              className="!bg-[#CBEFD5]"
              type="text"
              placeholder="000000/000000000"
              value={
                scannedSerialNo
                  ? scannedTestPanelId + "/" + scannedSerialNo
                  : advSerialNo[scanningForPos]
                  ? advTestPanelID[scanningForPos] +
                    "/" +
                    advSerialNo[scanningForPos]
                  : advTestPanelID[scanningForPos]
              }
              onInput={(e) => {}}
            />
            {/*<div className="absolute right-[0.78vw] self-center">
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
    </>
  );
};

export default AdvSampleDetectedScreen;
