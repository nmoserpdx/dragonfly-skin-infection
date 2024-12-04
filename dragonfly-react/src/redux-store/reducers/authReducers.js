import{
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
} from '../types'


export const logInReducer = (state={},action) =>{
    switch(action.type){
        case LOGIN_REQUEST:
            return{
                processing:true,
            }

        case LOGIN_SUCCESS:
            return{
                processing:false,
                userInfo:action.payload
            }

        case LOGIN_FAIL:
            return{
                processing:false,
                error:action.payload
            }
        case LOGOUT:
            return {}
        default:
            return state
    }
}
