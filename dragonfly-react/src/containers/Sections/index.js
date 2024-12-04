import { memo } from "react"
//import DevicesConnected from "../../components/DevicesConnected"
//import Samples from "../../components/Samples"
import Activity from "../Activity"

const Sections = () => {
    return (
        <div className="section-cont bg-white" style={{ maxHeight: "100%",minWidth:"72.65vw"}}>
            {/* <Samples /> */}
            <Activity />
            {/* <DevicesConnected /> */}
        </div>
    )
}

export default memo(Sections)
