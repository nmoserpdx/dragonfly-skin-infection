import React, { Fragment, useState } from "react";
import { steps } from "../../logic/instructions";
import { useHeaterStore } from "../../store/heaterStore";
import { usePreparationStore } from "../../store/preparationSteps";
import { useSampleStore } from "../../store/samples";
import { useUIStore } from "../../store/ui";
// import { useAdvUiStore } from "../../storeAdv/advUi";
import { useAdvTimerStore } from "../../storeAdv/advTimers";
import { ADV_TIMER_FOR_SCAN, ADV_TIMER_FOR_VOID } from "../../constants";

function StepsBar({ hasStepsCompleted }) {
  const state = usePreparationStore();
  const { completedSteps } = state;
  const { hasSamplePreparationStarted } = useUIStore();
  const { begSamples } = useHeaterStore();

  const sampleState = useSampleStore();
  const {
    currentSample,
    setCurrentSample,
    setPreperationScreenSampleId,
    preperationScreenSampleId,
  } = sampleState;
  const [newId, setNewId] = useState("");
  const { scanningId } = sampleState;
  const stepsDone = [0, 1, 2, 3, 4, 5, 6];
  // const id = scanningId? scanningId: currentSample.id
  const [isNewId, setIsNewId] = useState(false);

  const { incubationTimer } = useAdvTimerStore();

  const checkSampleId = () => {
    if (newId.id) {
      // console.log(currentId,currentSample.id)
      setCurrentSample(newId);
    }
    setIsNewId(false);
    setNewId({ id: "" });
  };
  //old code below
  /*
  const handleClick = () => {
    setIsNewId(true)
  }*/
  return (
    <div
      className="stepsBar"
      style={{ padding: "0px", margin: "0px", minHeight: "61.4vh" }}
    >
      {hasStepsCompleted ? (
        <>
          <ul style={{ minWidth: "100%" }} id="progress">
            <div className="inpCont  flex flex-col pb-[3.65vh]">
              <label className="inpTxt   font-semibold !pl-[2.79vw] ">
                Sample ID
              </label>
              <div className="ui input input-bd !rounded-[8px] !min-h-[4.86vh]">
                <input
                  type="text"
                  className={`!rounded-[2.17vh] !max-h-[4.26vh] py-[1.25vw] ${
                    incubationTimer[scanningId] <
                    ADV_TIMER_FOR_VOID + ADV_TIMER_FOR_SCAN + 1
                      ? "!bg-[#F4DA9C]"
                      : "!bg-[#DF7E7E]"
                  }`}
                  style={{ color: "white" }}
                  defaultValue={begSamples[scanningId]}
                />
              </div>
            </div>
            {steps.map((step, index) => (
              <Fragment key={index}>
                <li>
                  <div
                    className={`node green ${
                      !stepsDone.includes(index)
                        ? "!bg-[#EFEFEF]"
                        : "!bg[#24B34B]"
                    }`}
                  ></div>
                  <p
                    className={`text-[2.3125rem] ${
                      6 === index ? `t-#292929` : "t-8B8B8B"
                    }`}
                  >
                    {step}
                  </p>
                </li>
                <li id="divide">
                  <div
                    className={`divider   ${
                      !stepsDone.includes(index + 1) ? `gray` : "green"
                    }`}
                  ></div>
                </li>
              </Fragment>
            ))}
          </ul>
        </>
      ) : hasSamplePreparationStarted ? (
        <>
          <ul style={{ minWidth: "100%" }}>
            <div className="inpCont  flex flex-col pb-[3.65vh]">
              <label className="inpTxt   font-semibold !pl-[2.79vw] ">
                Sample ID
              </label>
              <div className="ui input input-bd !pl-[2.79vw]">
                {!isNewId ? (
                  <input
                    type="text"
                    id="SampleName"
                    name="sampleNew"
                    className="!rounded-[2.17vh] !max-h-[4.26vh] !bg-[#24B34B] py-[1.25vw]"
                    style={{ color: "white" }}
                    value={currentSample.id}
                    onBlur={checkSampleId}
                    onClick={(e) => setIsNewId(true)}
                    onChange={(e) => {
                      setCurrentSample({ id: e.target.value });
                    }}
                  />
                ) : (
                  <input
                    type="text"
                    id="SampleNew"
                    name="sampleNew"
                    className="!rounded-[2.17vh] !max-h-[4.26vh] !bg-[#24B34B] py-[1.25vw]"
                    style={{ color: "white" }}
                    defautValue={newId.id || ""}
                    onBlur={checkSampleId}
                    onChange={(e) => {
                      setNewId({ id: e.target.value });
                    }}
                  />
                )}
                {/* <div className="absolute right-[0.78vw] self-center">
                <svg id="Icon_pencil" className="!h-[2.7vh]" data-name="Icon / pencil" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 40 40">
                <g id="MDI_pencil" data-name="MDI / pencil">
                    <g id="Boundary" fill="#a7e1b7" stroke="rgba(0,0,0,0)" stroke-width="1" opacity="0">
                    <rect  stroke="none"/>
                    <rect x="0.5" y="0.5" fill="none"/>
                    </g>
                    <path id="Path_pencil" data-name="Path / pencil" d="M36.45,10.633a1.881,1.881,0,0,0,0-2.663L32.03,3.55a1.881,1.881,0,0,0-2.663,0L25.892,7.006l7.083,7.083M3,29.917V37h7.083l20.89-20.909L23.89,9.008Z" transform="translate(0 0.003)" fill="#a7e1b7"/>
                </g>
                </svg>
                </div> */}
              </div>
            </div>
            {steps.map((step, index) => (
              <Fragment key={index}>
                <li>
                  <div
                    className={`node green ${
                      !completedSteps.includes(index)
                        ? "!bg-[#EFEFEF]"
                        : "!bg[#24B34B]"
                    }`}
                  ></div>
                  {/* <div id="stepsbar-main" >
                <div id="stepsbar-sub">

                  <div
                        className={`h19w15 rounded-full  relative ${stepsDone.includes(index) ? `bg-[#24b34b] ${stepsDone[6] !== index ? "after:absolute after:h14 after:bg-[#24b34b]  after:left2 " : ""}` : 'bg-[#808080]'}`}
                  ></div>
                  <div>{step}</div>
                </div>
              </div> */}
                  <p
                    className={`text-[2.3125rem] ${
                      completedSteps.length - 1 === index
                        ? `t-#292929`
                        : "t-8B8B8B"
                    }`}
                  >
                    {step}
                  </p>
                </li>
                <li id="divide">
                  <div
                    className={`divider   ${
                      !completedSteps.includes(index + 1) ? `gray` : "green"
                    }`}
                  ></div>
                </li>
              </Fragment>
            ))}
          </ul>
        </>
      ) : (
        <ul style={{ minWidth: "100%" }} id="progress">
          <div className="inpCont  flex flex-col pb-[3.65vh]">
            {/* <label className="inpTxt   font-semibold !pl-[2.79vw] ">Sample ID:</label> */}
            <div
              className="ui input input-bd !pl-[2.79vw]"
              style={{ paddingTop: "32px" }}
            >
              <input
                type="text"
                className="!rounded-[2.17vh] !max-h-[4.26vh]  py-[1.25vw]"
                style={{ color: "white", backgroundColor: "rgb(203,203,203)" }}
                value={preperationScreenSampleId}
                onInput={(e) => setPreperationScreenSampleId(e.target.value)}
                disabled
              />

              {/* <div className="absolute right-[0.78vw] self-center">
                  <svg id="Icon_pencil" className="!h-[2.7vh]" data-name="Icon / pencil" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 40 40">
                    <g id="MDI_pencil" data-name="MDI / pencil">
                    <g id="Boundary" fill="#ffffff" stroke="rgba(0,0,0,0)" stroke-width="1" opacity="0">
                    <rect  stroke="none"/>
                    <rect x="0.5" y="0.5" fill="none"/>
                    </g>
                    <path id="Path_pencil" data-name="Path / pencil" d="M36.45,10.633a1.881,1.881,0,0,0,0-2.663L32.03,3.55a1.881,1.881,0,0,0-2.663,0L25.892,7.006l7.083,7.083M3,29.917V37h7.083l20.89-20.909L23.89,9.008Z" transform="translate(0 0.003)" fill="#ffffff"/>
                    </g>
                  </svg>
                </div> */}
            </div>
          </div>
          {steps.map((step, index) => (
            <Fragment key={index}>
              <li>
                <div className={`node green !bg-[#EFEFEF]`}></div>
                <p className={`text-[2.3125rem]  t-8B8B8B`}>{step}</p>
              </li>
              <li id="divide">
                <div className={`divider   gray`}></div>
              </li>
            </Fragment>
          ))}
        </ul>
      )}
    </div>
  );
}

export default React.memo(StepsBar);
