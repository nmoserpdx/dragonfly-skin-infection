import { useState, useEffect } from "react";
import useSound from "use-sound";
import beebeepala_30sec_alarmnorepeat from "../../Sounds/beebeepala_30sec_alarmnorepeat.mp3";

const Timer = ({ isPlaying, countdown, key }) => {
  const [Width, setWidth] = useState(window.screen.width);
  const [play] = useSound(beebeepala_30sec_alarmnorepeat, { volume: 0.5 });
  window.addEventListener(
    "resize",
    function (event) {
      setWidth(window.screen.width);
    },
    true
  );
  const size = 0.0625 * Width;
  const strokeWidth = 0.00625 * Width;
  const halfSize = size / 2;
  const halfStrokeWith = strokeWidth / 2;
  const arcRadius = halfSize - halfStrokeWith;
  const arcDiameter = 2 * arcRadius;
  const [bgColour, setBgColour] = useState("#ffffff");

  const pathLength = 2 * Math.PI * arcRadius;
  const path = `m ${halfSize},${halfStrokeWith} a ${arcRadius},${arcRadius} 0 1,0 0,${arcDiameter} a ${arcRadius},${arcRadius} 0 1,0 0,-${arcDiameter}`;

  const setBackground = () => {
    setBgColour("#a7e1b7");
    setTimeout(() => setBgColour("#ffffff"), 500);
    /* onTouchEnd={() => setBgColour("#ffffff")} */
  };
  var circleDasharray = `${
    pathLength - ((countdown / 30) * (pathLength + 0.5)).toFixed(0)
  }`;

  useEffect(() => {
    if (countdown === 0) {
      play();
    }
  }, [countdown]);
  return (
    <div className="w-full h-full relative" onTouchStart={setBackground}>
      <svg width="6.25vw" height="6.25vw" xmlns="http://www.w3.org/2000/svg">
        <path
          d={path}
          className="base-timer notransition"
          fill={bgColour}
          stroke="rgba(36, 179, 75, 1)"
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          strokeDasharray={pathLength}
          strokeDashoffset={circleDasharray > 0 ? circleDasharray : 0}
        ></path>
      </svg>
      <div className="flex absolute items-center justify-center w-[6.25vw] h-[6.25vw] top-[0px]">
        <div className="text-[4.17vh] timer" style={{ color: "#24B34B" }}>
          {isPlaying && countdown < 31 && countdown >= 0 ? (
            countdown
          ) : (
            <>
              <img
                className="w-[2.5vw]"
                src="assets/icons/timer.svg"
                alt="timer"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timer;
