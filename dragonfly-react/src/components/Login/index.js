
import './login.css';
import { useDashboardUiStore } from "../../storeDashboard/dashboardUi";
import React, {useEffect, useState} from 'react'
import {Col, Row, Spinner} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { logInUser } from '../../redux-store/actions/authActions'
import Alerts from '../../DashBoradComponents/partials/Alerts';

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {logIn,isLogin} = useDashboardUiStore()
    const handelLogin =() =>{
         logIn()
    }

    const {userInfo, processing, error} = useSelector((state) =>state.logIn)

    const dispatch = useDispatch()


    const protondxAdminRedirect = '/protondx-admin/protondx-dashboard'
    const orgAdminRedirect = 'org-admin/org-dashboard'
    useEffect(() => {
      if(localStorage.getItem('userInfo')){
        handelLogin()
      }
  }, [userInfo, protondxAdminRedirect])


    const loginSubmit = (event) =>{
        console.log(email, password)
        event.preventDefault()

        dispatch(logInUser(email, password))

    }

    return (
        <div className="flex flex-col justify-center" style={{width: '100%'}}>

            <Row style={{display: "flex", margin: "0 auto"}}>
                <Col sm = '12'>
                    <p className='login-logo'>ProtonDx</p>
                    <form onSubmit={loginSubmit} className="login-box-screen">
                    <p className='login-title'>Login</p>
                        <div className='login-input-container'>
                            <label className='login-label'>Username</label>
                            <input
                                className='login-input-box'
                                type='email'
                                value={email}
                                required
                                onChange={(event)=>setEmail(event.target.value)}
                            >
                            </input>
                        </div>

                        <div className='login-input-container'>
                            <label className='login-label'>Password</label>
                            <input
                                className='login-input-box'
                                type='password'
                                value={password}
                                required
                                onChange={(event)=>setPassword(event.target.value)}
                            >
                            </input>
                        </div>

                        {processing?(
                        <button
                                className='login-btn btn-margin'
                                type='submit'
                                disabled
                            >
                            Logging in
                        <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                            </button>):
                            <button
                                className='login-btn btn-margin'
                                type='submit'
                            >
                                Login
                            </button>
                        }
                        {error && error.password ? <Alerts type="danger" message={error.password} />:null}
                        {error && !error.password ? <Alerts type='danger' message={error} />: null}
                    </form>
            </Col>
            </Row>
        </div>
    )
}

export default Login
