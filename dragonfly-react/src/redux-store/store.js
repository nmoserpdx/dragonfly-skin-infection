import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import rootReducer from './reducers/rootReducer'

const userInfo= localStorage.getItem('userInfo') ?
                            JSON.parse(localStorage.getItem('userInfo')):
                            null
const initialState = { 
    logIn:{
        userInfo:userInfo
    }
}

const middleware = [thunk]

const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)
export default store