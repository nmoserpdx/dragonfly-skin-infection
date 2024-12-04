import {Modal, Button, TransitionablePortal} from "semantic-ui-react";
import React, {Fragment, useState} from "react";
import {AT_MAX_TIME, EXTRA_TIME} from "../../constants";
import {secondsToTime} from "../../helpers";
function SampleReadyScanModal({id, scanThisSample, removeThisSample, addExtraTimeToThisSample, incubationTimer}) {
    const [finalUnloadMsg,
        setFinalUnloadMsg] = useState(false)
    const displayTimerInWords = (val) => {
        let timer = secondsToTime(val);

        return timer.m != '00'
            ? (`${timer.m} mins`)
            : (`${timer.s}secs `)
    };
    const scanThisSampleChild = () => {
        addExtraTimeToThisSample(id, false)
        scanThisSample(true, id)
    }
    const handleUnloadHeater = () => {
        setFinalUnloadMsg(false)
        removeThisSample(id)
    }

    return (
        <TransitionablePortal open={true} duration={2000}>
            <Modal open={true} className="!relative !w-[39.5vw] !h-[45.05vh] cancelModal ">

                <div className="min-h-[15.39vh] flex flex-col">
                    <div className="font-bold text-[2.78vh] max-w-2xl ">
                        Sample {id}
                        ready to scan</div>

                    {incubationTimer > AT_MAX_TIME && <div className="font-bold  pt-[6.43vh] text-[2.78vh] max-w-2xl">

                        <svg
                            id="icon_warning"
                            className="!max-w-[1.97vw] absolute left-[2.08vw]"
                            data-name="icon / warning"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 40 40">
                            <path id="Path_9620" data-name="Path 9620" d="M0,0H40V40H0Z" fill="none"/>
                            <path
                                id="Path_9621"
                                data-name="Path 9621"
                                d="M1,37H39L20,2Zm20.727-5.526H18.273V27.789h3.455Zm0-7.368H18.273V16.737h3.455Z"
                                fill="#D94444"/>
                        </svg>

                        <div>Sample incubated over 40 minutes. Use caution interpreting results.</div>

                    </div>}
                </div>

                <Modal.Actions className="!border-[0px]">
                    {!finalUnloadMsg
                        ? <> {
                            incubationTimer > AT_MAX_TIME
                                ? <Button
                                        className="backbtn confirmBtn m-0 modalBtnLeft !w-[11.97vw] !h-[5.04vh]"
                                        onClick={() => setFinalUnloadMsg(true)}>
                                        Unload Heater

                                    </Button>
                                : <Button
                                        className="backbtn confirmBtn m-0 modalBtnLeft !w-[11.97vw] !h-[5.04vh]"
                                        onClick={() => addExtraTimeToThisSample(id, true)}>
                                        +{displayTimerInWords(EXTRA_TIME)}

                                    </Button>
                        }
                    < Button
                    className = "confirmBtn modalBtnRight !w-[11.97vw] !h-[5.04vh] "

                    onClick = {
                        () => scanThisSampleChild(true, id)
                    }>
                    Scan
                    </Button>
                  </ >:<> <Button
                        className="backbtn confirmBtn m-0 modalBtnRight !w-[11.97vw] !h-[5.04vh]"
                        onClick={() => handleUnloadHeater()}>
                        Confirm

                    </Button>
                    < Button
                    className = "confirmBtn modalBtnLeft !w-[11.97vw] !h-[5.04vh] "

                    onClick = {
                        () => setFinalUnloadMsg(false)
                    } >
                    Back
                    </Button>
                    </>}

                </Modal.Actions>

            </Modal>
        </TransitionablePortal>

    );
}
export default React.memo(SampleReadyScanModal);
