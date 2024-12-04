import { createContext, useEffect, useState } from "react";
import { INCUBATION_TIME_ALERT_LIMIT, ADV_TIMER_FOR_SCAN } from "../constants";

export const IncubationContext = createContext({
    hasTimeElapsed: false,
    unloadBeforeTime: false,
    noScannedImage: false,
    tagMissing: false
})

const IncubationProvider = ({incubationTimeForCurrentSample, children}) => {
    const [hasTimeElapsed, setHasTimeElapsed] = useState(false)
    const [unloadBeforeTime, setUnloadBeforeTime] = useState(false)
    const [noScannedImage, setNoScannedImage] = useState(false)
    const [tagMissing, setTagMissing] = useState(false)

    useEffect(() => {
        if(unloadBeforeTime !== true){
          if(incubationTimeForCurrentSample > INCUBATION_TIME_ALERT_LIMIT) {
              setHasTimeElapsed(true)
          }
        }
        if(incubationTimeForCurrentSample < ADV_TIMER_FOR_SCAN) {
        //   console.log(incubationTimeForCurrentSample)
            setUnloadBeforeTime(true)
        }else{
          setUnloadBeforeTime(false)
        }
    }, [incubationTimeForCurrentSample])
    return (
        <IncubationContext.Provider value={{hasTimeElapsed, setHasTimeElapsed,
        unloadBeforeTime, setUnloadBeforeTime, noScannedImage, setNoScannedImage,
        tagMissing, setTagMissing}}>
            {children}
        </IncubationContext.Provider>
    )
}

export default IncubationProvider
