import React from 'react'
import {Col, Row} from 'react-bootstrap'
import { Redirect} from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

const Login = () => {

    const {loginWithRedirect, user, isLoading, isAuthenticated} =useAuth0()

    return (
        <div >

            {!isLoading && user && (
               <Redirect to="/callback" />
            )}
            <Row>
                <Col sm='7'>
                {/* <p className='login-logo'>ProtonDx</p> */}

                    <div className="login-box-screen">
                        <div className='login-input-container auth0-login-margin'>

                        {!isLoading && !user && (
                            <button
                                className='login-btn btn-margin btn-lg'
                                onClick={()=>loginWithRedirect()}
                            >
                                Login With Auth0
                            </button>
                        )}
                        </div>
                     </div>
            </Col>
            <Col sm='4'>
               <div className='login-image'>
                <img src='login-image.jpeg' height='620px'/>
               </div>
            </Col>
            </Row>
        </div>
    )
}

export default Login
