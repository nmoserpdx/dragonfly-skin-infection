import { memo } from "react"
import { useSampleStore } from "../../store/samples"
import SampleBox from "../SampleBox";

const Samples = () => {
    const state = useSampleStore();
    const { samples, currentSample } = state;

    return (
        <div className="pt-4 px-6 bg-cont padding-sample m-4 w-3/12 rounded px-4">
            {/* <Header as='h3' style={{fontSize:"1.9531vw", lineHeight: "2.4414vw"}}>Samples</Header> */}
            {
                currentSample.id &&
                <SampleBox sample={currentSample} active />
            }
            {
                samples.map((sample, index) => (
                    <SampleBox
                        sample={sample}
                        key={index}
                    />
                ))
            } 
        </div>
    )
}

export default memo(Samples)