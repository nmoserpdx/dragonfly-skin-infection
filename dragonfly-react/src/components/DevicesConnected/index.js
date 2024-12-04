import { memo } from "react"
import { Header } from "semantic-ui-react"

const DevicesConnected = () => {
    return (
        <div className="pt-4 w-3/12 bg-cont padding-device m-4 text-center rounded px-4">
            <Header as='h3' style={{ fontSize:"1.9531vw", lineHeight: "2.4414vw"}}>Devices connected</Header>
        </div>
    )
}

export default memo(DevicesConnected)