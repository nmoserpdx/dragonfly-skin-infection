import { useEffect } from "react";
import { useSampleStore } from "../../store/samples";
import { useUIStore } from "../../store/ui";
import Button from "../Button";

const SampleBox = ({
    sample,
    active
}) => {
    const { timerMapper, reduceTimerBySecond } = useSampleStore()
    const uiState = useUIStore()
    const { openScanModal } = uiState;
    const secondsToTime = (secs) => {
        const hours = `${Math.floor(secs / (60 * 60))}`;
        const divisor_for_minutes = secs % (60 * 60);
        const minutes = `${Math.floor(divisor_for_minutes / 60)}`;
        const divisor_for_seconds = divisor_for_minutes % 60;
        const seconds = `${Math.ceil(divisor_for_seconds)}`;
        const obj = {
            "h": hours.padStart(2, '0'),
            "m": minutes.padStart(2, '0'),
            "s": seconds.padStart(2, '0')
        };
        return obj;
    };
    const displayTimer = () => {
        let timer = secondsToTime(timerMapper[sample.id]);
        return (`${timer.m}:${timer.s}`)
    };
    useEffect(() => {
        let timerId = null;
        if (timerMapper[sample.id]) {
            timerId = setInterval(() => {
                reduceTimerBySecond(sample.id);
            }, 1000)
        }
        return () => clearInterval(timerId)
    }, [sample.id, timerMapper, reduceTimerBySecond])

    const openModal = () => {
        // openScanModal(true)
    }

    return (
        <div className="my-4 border">
            <div className={`actBar text-white ${!active ? 'bg-gray-300' : 'bg-success'} p-1 text-sm font-semibold`}>{sample.id}</div>
            {timerMapper[sample.id] !== 0 &&
                <div className="timeElp p-4">Time elapsed: {timerMapper[sample.id] ? displayTimer() : 'N/A'}</div>
            }
            <div className="py-4 grid grid-row-2">
            {timerMapper[sample.id] === 0 ?
                    <Button size="mini" positive onClick={openModal}>Scan Sample</Button>
                 : <Button size="mini" positive onClick={openModal}>Skip timer</Button>

            }
            </div>

        </div>
    )
}
export default SampleBox;