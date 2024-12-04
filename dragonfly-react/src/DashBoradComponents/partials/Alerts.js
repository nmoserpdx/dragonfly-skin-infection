import React from 'react'
import {Alert} from 'react-bootstrap'

const Alerts = ({type, message}) =>{
    return(
        <div>
            <Alert
                variant={type}
                children={message}
            />
        </div>
    )
}

Alerts.defaultProps = {
    type: 'info',
}

export default Alerts