import React from "react";
import Spinner from 'react-bootstrap/Spinner'

const Loading = () => {
    return(
        <div>
            <Spinner 
                animation="border" 
                role= "status"
                style = {spinnerStyle}
            />
            <span className="sr-only">Loading...</span>
        </div>
    )
}

const spinnerStyle = {
    width: '150px',
    height:'150px',
    margin:'auto',
    display:'block',
    color:'#24b34b'
}

export default Loading