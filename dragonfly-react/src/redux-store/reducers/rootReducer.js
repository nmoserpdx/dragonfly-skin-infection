import {combineReducers} from 'redux'
import {logInReducer} from './authReducers'
import { protondxAdminStatsReducer,
    protondxAdminInfectionStatsReducer, 
    protondxAdminOrgListReducer,
     protondxAdminManageOrgReducer,
    protondxAdminExportDataReducer 
} from './protondxAdminReducers'
import { orgAdminStatsReducer,
    orgAdminInfectionStatsReducer, 
    orgAdminUserListReducer, 
    orgAdminManageUserReducer,
    orgAdminExportDataReducer,
    orgAdminUserResultReducer
 } from './orgAdminReducers'
const rootReducer = combineReducers({

    logIn: logInReducer,
    protondxAdminStats:protondxAdminStatsReducer,
    protondxAdminInfectionStats:protondxAdminInfectionStatsReducer,
    protondxAdminOrgList:protondxAdminOrgListReducer,
    protondxAdminManageOrg:protondxAdminManageOrgReducer,
    protondxAdminExportData:protondxAdminExportDataReducer,
    orgAdminStats:orgAdminStatsReducer,
    orgAdminUserList:orgAdminUserListReducer,
    orgAdminUserResult:orgAdminUserResultReducer,
    orgAdminManageUser:orgAdminManageUserReducer,
    orgAdminInfectionStats:orgAdminInfectionStatsReducer,
    orgAdminExportData:orgAdminExportDataReducer
    
})

export default rootReducer
