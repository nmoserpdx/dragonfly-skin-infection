import { useAuth0 } from '@auth0/auth0-react'
import React, { useEffect, useState } from 'react'
import { Redirect, useHistory } from 'react-router'
import { Spinner } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { logInUser } from '../../redux-store/actions/authActions'


const Auth0DashBridge = () => {
    const { user, logout, isLoading, getAccessTokenSilently, isAuthenticated } = useAuth0()
    const {userInfo, error} = useSelector((state) =>state.logIn)
    const protondxAdminRedirect = '/protondx-admin/protondx-dashboard'
    const orgAdminRedirect = 'org-admin/org-dashboard'

    const [redirectable, setRedirectable] = useState(false)
    const history = useHistory()
    const dispatch = useDispatch()

   
    const handleRedirection = () => {
        setRedirectable(true)
        fetchTokenFromAuth0()
    }

    const callAuth0Backend = async (login_id, access_token)=>{
        
        await dispatch(logInUser(login_id, access_token))
    }

    useEffect(() => {
        if(localStorage.getItem('userInfo')){
          const role = JSON.parse(localStorage.getItem('userInfo')).permission_group
           if(role === 'PROTON_DX_ADMIN' ){
                history.push(protondxAdminRedirect)
           }
           else if(role === 'ORG_ADMIN'){
            history.push(orgAdminRedirect)        
           }else{
               localStorage.removeItem('userInfo')
               logout()
           }
        }
        if(error){
            console.log(error)
            // logout()
        }
    }, [history, userInfo, error])

    const fetchTokenFromAuth0 = ()=>{
        async function fetchToken() {
            try {
                const token = await getAccessTokenSilently();
                if(token && user){
                    callAuth0Backend(user.email, token)
                }   
            } catch (err) {
                console.log(err);
            }
        }
        fetchToken();
    }
        

    return (
        <div>
            { !isLoading && !user && <Redirect to="/login" />}

            <div className='auth-bridge'>
                <button 
                    disabled='true'
                    className='protondx-btn-primary btn-lg'>Taking you to the dashboard... 
                     <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
                </button>
            </div>
            
            {!isLoading && user && !redirectable &&
                handleRedirection()
            }
        </div>
    )
}

export default Auth0DashBridge
