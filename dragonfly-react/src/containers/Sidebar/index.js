import React, { useContext } from "react";
import { memo } from "react";
import Heater from "../../components/Heater";
import { useUIStore } from "../../store/ui";
import { useTestDataStore } from "../../store/testData";
import StepsBar from "../../components/StepsBar";
import { useSampleStore } from "../../store/samples";
import { useAdvTestDataStore } from "../../storeAdv/advTestData";
import ErrorSampleMsg from "../../components/ErrorSampleMsg";
import SampleInputGuidedScreen from "../../components/SampleInputGuidedScreen";
import { useHeaterStore } from "../../store/heaterStore";
import { IncubationContext } from "../../context/incubationTimer";

const Sidebar = ({ setStartProcessForSamplePreparation }) => {
  const uiState = useUIStore();
  const {
    hasSamplePreparationStarted,
    isScanning,
    startProcessForSamplePreparation,
    hasCaptureSampleScreen,
    isWrongSample,
  } = uiState;
  const { advTestPanelID, advSerialNo } = useAdvTestDataStore();
  const { scanningId } = useSampleStore();
  const testDataState = useTestDataStore();
  const { begSamples, heater } = useHeaterStore();

  const { scannedSerialNo, scannedTestPanelId } = testDataState;

  //const [testPanelHook, setTestPanelHook] = useState(serialNo ? TestPanel + '/' + serialNo : TestPanel)

  // useEffect(() => {
  //    setTestPanelHook(serialNo?TestPanel+'/'+serialNo:TestPanel)
  //    console.log(TestPanel)
  //   },[TestPanel,serialNo]);

  //old code below
  /*
    const handleInput = (v) => {
        setTestPanelHook(v.replace(/\//g, ""))
        if (v.length > 6) {
            setSerialNo(v.replace(/\//g, "").slice(6))
        } else {
            setTestPanel(v)

        }
        if (v.length === 6) {
            validateTestPanelInput()
        }
        console.log(TestPanel, serialNo)
    }

    const validatePrepInput = () => {
        if (samplePrepKit.length > 0) {
            if (PREP_KIT.indexOf(samplePrepKit !== -1)) {
            }
        }
    }*/

  //old code below
  /*
    const validateTestPanelInput = () => {
        if (testPanelHook.length > 0) {
            if (TEST_PANEL.indexOf(TestPanel !== -1)) {
                setIsWrongSample(true)
                // setTestPanel('')
            }
        }
        // if(samplePrepKit.length>0){
        //     if(PREP_KIT.indexOf(samplePrepKit!==-1)){
        //         console.log("wrongprepkit")
        //         setSamplePrepKit('')
        //     }
        // }
    }*/

  const { hasTimeElapsed, unloadBeforeTime, noScannedImage } =
    useContext(IncubationContext);
  const getHeaterRowValue = () => {
    for (var key in heater) {
      if (heater[key] === scanningId) {
        return "A" + key;
      }
    }
    return "";
  };

  return (
    <div
      className="flex flex-col"
      style={{ minHeight: "100%", minWidth: "23.38vw" }}
    >
      {!isScanning ? (
        !startProcessForSamplePreparation && hasSamplePreparationStarted ? (
          <>
            <SampleInputGuidedScreen />
          </>
        ) : (
          <>
            <StepsBar />
          </>
        )
      ) : (
        <>
          {hasCaptureSampleScreen ? (
            <StepsBar hasStepsCompleted={true} />
          ) : (
            <div
              style={{
                minHeight: "61.4vh",
                display: "flex",
                justifyContent: "right",
                flexDirection: "column",
                paddingLeft: "2.5vw",
              }}
            >
              <div className="detail-cont flex flex-col">
                <div className="inpCont  flex flex-col">
                  <label className="inpTxt   font-semibold pb-1">
                    Sample ID
                  </label>
                  <div className={`ui input w-[20.83vw] input-scan`}>
                    <input
                      className={` !bg-[#CBEFD5] !p-[0px] text-black`}
                      type="text"
                      placeholder="Sample ID"
                      defaultValue={begSamples[scanningId]}
                    />
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
                  <label className="inpTxt mt-[2.08vh]  font-semibold pb-1">
                  Test Panel Tag REF / SN
                  </label>
                  <div
                    className={`ui input w-[20.83vw] input-scan ${
                      isWrongSample ? `shake` : ``
                    }`}
                  >
                    <input
                      className={`${
                        isWrongSample ? `!bg-[#F2CBCB]` : `!bg-[#CBEFD5]`
                      } !p-[0px] text-black`}
                      type="text"
                      placeholder="000000/000000000"
                      defaultValue={
                        scannedSerialNo
                          ? scannedTestPanelId + "/" + scannedSerialNo
                          // : advTestPanelID[scanningId] +
                          //   "/" +
                          //   advSerialNo[scanningId]
                          :""
                      }
                    />
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
                      {getHeaterRowValue()}
                    </span>
                    <input
                      className="!bg-[#EFEFEF]"
                      type="text"
                      placeholder="000000/000000000"
                      defaultValue={
                        advTestPanelID[scanningId]
                          ? advTestPanelID[scanningId] +
                            "/" +
                            advSerialNo[scanningId]
                          : ""
                      }
                    />
                  </div>
                  {isWrongSample && (
                    <div
                      className="text-[2.78vh] mt-[2.08vh] errorleading"
                      style={{ color: "#D94444" }}
                    >
                      <img
                        className="w-[2.08vw]"
                        src="assets/icons/warning.svg"
                        alt="warning"
                      ></img>
                      Incorrect Test Panel. Please capture Test Panel SN{" "}
                      {advTestPanelID[scanningId] +
                        "/" +
                        advSerialNo[scanningId]}
                    </div>
                  )}
                  {hasTimeElapsed && (
                    <div
                      className="text-[2.78vh] errorleading"
                      style={{ color: "#D94444", marginTop: "1em" }}
                    >
                      <img
                        className="w-[2.08vw] inline"
                        src="assets/icons/warning.svg"
                        alt="warning"
                      ></img>
                      <br />
                      <span>
                        Incubation time was over 35 minutes. Use caution
                        interpreting the results.
                      </span>
                    </div>
                  )}
                  {unloadBeforeTime && (
                    <div
                      className="text-[2.78vh] errorleading"
                      style={{ color: "#D94444", marginTop: "1em" }}
                    >
                      <img
                        className="w-[2.08vw] inline"
                        src="assets/icons/warning.svg"
                        alt="warning"
                      ></img>
                      <br />
                      <span>
                        Incubation was less than 25 minutes. Use caution
                        interpreting the results.
                      </span>
                    </div>
                  )}
                  {noScannedImage && (
                    <div
                      className="text-[2.78vh] errorleading"
                      style={{ color: "#D94444", marginTop: "1em" }}
                    >
                      <img
                        className="w-[2.08vw] inline"
                        src="assets/icons/warning.svg"
                        alt="warning"
                      ></img>
                      <br />
                      <span>
                        No image captured. Colour observations manually entered
                        from incubated Test Panel
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <ErrorSampleMsg />
            </div>
          )}
        </>
      )}

      <Heater />
    </div>
  );
};

export default memo(Sidebar);
