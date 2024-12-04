import React from 'react'

import { useNonPersistentStates } from '../../store/noPersistentState';
const ErrorSampleMsg = ({
    setStartProcessForSamplePreparation
}) => {
    const {isWrongSample,wrongMsg,isWrongTestSample, wrongTestPanelMsg} = useNonPersistentStates()
    return (isWrongSample || isWrongTestSample)  && (
        <div style={{overflow:"hidden",maxHeight:"300px"}}>
            <div className='text-[2.58vh] mt-[2.19vh] flex flex-col errorleading errorNewLine' style={{color:'#D94444', maxWidth: "500px"}}>
              <img className='w-[2.08vw]' src="assets/icons/warning.svg" alt="warning"/>
              {(wrongMsg === "")?wrongTestPanelMsg:wrongMsg}
            <br />
            {/* wrongMsg */}
          </div>
        </div>
    )
}

export default ErrorSampleMsg
