import React, {useEffect} from 'react'
// import { useHistory } from 'react-router'
// import { useSelector } from 'react-redux'
// import { useAuth0 } from '@auth0/auth0-react'

const NavigationBar = (props) => {

    // const [orgKey, setOrgKey] = useState('0')
    // const history = useHistory()
    // const {userInfo} = useSelector(state=>state.logIn)
    // const {orgoptions} = useSelector(state=>state.protondxAdminOrgList)

    useEffect(() => {
       //dispatch(getProtondxAdminOrgList())
    }, [])

    //old code
    /*
    const handleOrgFilter = (org_id)=>{
        alert(props.handleOrgKey)
    }

    const handleLogout = ()=>{
        localStorage.removeItem('userInfo')
        logout()
    }
    */

    // const {logout} =useAuth0()

    //const dispatch = useDispatch()
    return (
        <div className='protondx-navbar'>
            {/*<div class="topmenu">
              { <p className='top-logo'>ProtonDx</p> }
              {userInfo && (
                <button
                    className='circle'
                    onClick={handleLogout}
                >
                    Logout
                </button>
            )}
            </div>*/}
        </div>
    )
}

export default NavigationBar
