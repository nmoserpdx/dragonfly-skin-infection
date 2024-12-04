import { secondsToTime } from "../../helpers";
import { useSampleStore } from "../../store/samples";
import { useAdvTimerStore } from "../../storeAdv/advTimers";

const CompletedSamplesToasts = ({timerMapper, samples,samplePos, voidSamples, handleResultCaptureScreen, handleVoidSample, timeExceededSamples}) => {
    const {timerForSamplePos,activeTimer}=useAdvTimerStore()
    const {begSampleReadyForScan } = useSampleStore();

    const displayTimer = id => {
        let timer = secondsToTime(activeTimer-timerForSamplePos[id].timerInsertedAt);

        return (`${timer.m}:${timer.s}`)
      };

      return (
              <div className="z-10 flex  fixed w-[72.65vw] top-0 left-toast max-h-[9.08vh] z-[5]">
                  {samples.map(sample => voidSamples.includes(sample.id) || (!voidSamples.includes(sample.id) && begSampleReadyForScan.includes(sample.id)) ? (
                      <div
                          className={`flex-1 bg-[#24b34b] ${voidSamples.includes(sample.id) ? "!bg-[red] text-white" : begSampleReadyForScan.includes(sample.id) ? "!bg-[#F4DA9C]" : ""} text-[1.7vw] py-4 rounded-b-[25px] text-center`}
                          onClick={() => !voidSamples.includes(sample.id) && begSampleReadyForScan.includes(sample.id) ? handleResultCaptureScreen(true,sample.id,samplePos[sample.id]) : voidSamples.includes(sample.id) ? handleVoidSample(sample.id) : {}}
                        // onClick={() =>  handleVoidSample(sample.id) }
                      >
                          <span>{sample.id}</span>
                          {voidSamples.includes(sample.id) && <span className="ml-2 font-medium">{`: Void`}</span>}
                          {!voidSamples.includes(sample.id) && begSampleReadyForScan.includes(sample.id) && <span className="ml-2 font-medium">{`: Capture`}</span>}
                          <div className="ml-2 font-medium text-[red] text-[1.5vw]">{!voidSamples.includes(sample.id) && begSampleReadyForScan.includes(sample.id) && `${displayTimer(sample.id)}`}</div>
                      </div>
                  ): null)}
              </div>
          )
}


export default CompletedSamplesToasts
