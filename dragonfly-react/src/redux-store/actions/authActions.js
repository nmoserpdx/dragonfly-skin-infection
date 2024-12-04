import axios from 'axios'
import{
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT
} from '../types'
import {server_base_url} from '../../shared'


export const logInUser = (login_id, auth0_access_token) => async (dispatch) =>{
    try {
        dispatch({
            type:LOGIN_REQUEST,
        })

        

        const url = `${server_base_url}/auth0login`
        const config = {
            headers:{
                'Content-Type':'application/json',
                "X-AuthorityToken": "auth-wpf-desktop"
            }
        }
        
        const {data} = await axios.post(
            url,
            {login_id, auth0_access_token},
            config
        )
 
        dispatch({
            type:LOGIN_SUCCESS,
            payload:data
        })

        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch (error) {
        dispatch({
            type:LOGIN_FAIL,
            payload:
                error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}

// export const logInUser = (login_id, password) => async (dispatch) =>{
//     try {
//         dispatch({
//             type:LOGIN_REQUEST,
//         })
//         const url = `${server_base_url}/login`
//         const config = {
//             headers:{
//                 'Content-Type':'application/json',
//                 "X-AuthorityToken": "auth-wpf-desktop"
//             }
//         }
        
//         const {data} = await axios.post(
//             url,
//             {login_id, password},
//             config
//         )
 
//         dispatch({
//             type:LOGIN_SUCCESS,
//             payload:data
//         })

//         localStorage.setItem('userInfo', JSON.stringify(data))
//     } catch (error) {
//         dispatch({
//             type:LOGIN_FAIL,
//             payload:
//                 error.response && error.response.data.message
//                 ? error.response.data.message
//                 : error.message
//         })
//     }
// }

export const logOutUser = () => async (dispatch) =>{
    localStorage.removeItem('userInfo')
    dispatch({
        type:LOGOUT
    })
}
