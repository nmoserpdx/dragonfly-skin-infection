import { useCallback, useRef, useState } from "react";

const useClick = (
    onLongPress,
    onClick,
    onDoubleClick,
    isTimerPlaying,
    { shouldPreventDefault = true, delay = 300 } = {}
    ) => {

    const [longPressTriggered, setLongPressTriggered] = useState(false);
    const timeout = useRef();
    const target = useRef();
    const clickTimeout = useRef();
    const [clickCount,setClickCount]=useState(0);
    const start = useCallback(
        event => {
            if (shouldPreventDefault && event.target) {
                    event.target.addEventListener("touchend", preventDefault, {
                    passive: false
                });
                target.current = event.target;
            }
            timeout.current = setTimeout(() => {
                onLongPress(event);
                setLongPressTriggered(true);
            }, delay);
        },
        [onLongPress, delay, shouldPreventDefault]
    );

    const clear = useCallback(
        (event, shouldTriggerClick = true) => {
            //console.log(clickCount,"clickCount")
            timeout.current && clearTimeout(timeout.current);
            if(isTimerPlaying){
                setClickCount(clickCount+1)

            if (clickCount === 0) {
                clickTimeout.current = setTimeout(()=> {
                  setClickCount(0)
                  shouldTriggerClick && !longPressTriggered && onClick();
                }, 200);

              } else if (clickCount >= 1) {
                clearTimeout(clickTimeout.current);
                setClickCount(0)
                shouldTriggerClick && !longPressTriggered && onDoubleClick();
              }
            }else{
                shouldTriggerClick && !longPressTriggered && onClick();
            }




            setLongPressTriggered(false);
            if (shouldPreventDefault && target.current) {
                target.current.removeEventListener("touchend", preventDefault);
            }
        },
        [shouldPreventDefault, onDoubleClick,onClick,clickCount,setClickCount, longPressTriggered]
    );

    return {
        onMouseDown: e => start(e),
        onTouchStart: e => start(e),
        onMouseUp: e => clear(e),
        onMouseLeave: e => clear(e, false),
        onTouchEnd: e => clear(e)
    };
};

const isTouchEvent = event => {
return "touches" in event;
};

const preventDefault = event => {
if (!isTouchEvent(event)) return;

if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault();
}
};

export default useClick;
