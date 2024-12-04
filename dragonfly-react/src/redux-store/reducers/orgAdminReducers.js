import{ ORG_ADMIN_DATA_EXPORT_FAIL, ORG_ADMIN_DATA_EXPORT_REQUEST, ORG_ADMIN_DATA_EXPORT_SUCCESS, ORG_ADMIN_INFECTION_STATS_FAIL, ORG_ADMIN_INFECTION_STATS_REQUEST, ORG_ADMIN_INFECTION_STATS_SUCCESS, ORG_ADMIN_MANAGE_USER_FAIL, ORG_ADMIN_MANAGE_USER_REQUEST, ORG_ADMIN_MANAGE_USER_RESET, ORG_ADMIN_MANAGE_USER_SUCCESS, ORG_ADMIN_RESET_CSV_JSON, ORG_ADMIN_STATS_FAIL, 
    ORG_ADMIN_STATS_REQUEST, 
    ORG_ADMIN_STATS_SUCCESS, 
    USER_LIST_FAIL, 
    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_RESULT_FAIL,
    USER_RESULT_REQUEST,
    USER_RESULT_SUCCESS} from '../types'


export const orgAdminStatsReducer = (state={},action) =>{
    switch(action.type){
        case ORG_ADMIN_STATS_REQUEST:
            return{
                processing:true,
            }

        case ORG_ADMIN_STATS_SUCCESS:
            return{
                processing:false,
                stats:action.stats,
                barGraphData:action.bar_graph_data,
                pievalues: action.pie_values
            }
            
        case ORG_ADMIN_STATS_FAIL:
            return{
                processing:false,
                error:action.payload
            }   
        default:
            return state         
    }
}
export const orgAdminExportDataReducer = (state={},action) =>{
    switch(action.type){
        case ORG_ADMIN_DATA_EXPORT_REQUEST:
            return{
                exporting:true,
            }

        case ORG_ADMIN_DATA_EXPORT_SUCCESS:
            return{
                exporting:false,
                exportable_json:action.payload,
                export_data_received:true
            }
        case ORG_ADMIN_RESET_CSV_JSON:
            return{
                exporting:false,
                exportable_json:[],
                export_data_received:false
            }    
            
        case ORG_ADMIN_DATA_EXPORT_FAIL:
            return{
                exporting:false,
                error:action.payload
            }   
        default:
            return state         
    }
}

export const orgAdminInfectionStatsReducer = (state={},action) =>{
    switch(action.type){
        case ORG_ADMIN_INFECTION_STATS_REQUEST:
            return{
                processing:true,
            }

        case ORG_ADMIN_INFECTION_STATS_SUCCESS:
            return{
                processing:false,
                infectionStats:action.payload
            }
            
        case ORG_ADMIN_INFECTION_STATS_FAIL:
            return{
                processing:false,
                error:action.payload
            }   
        default:
            return state         
    }
}


export const orgAdminUserListReducer = (state={},action) =>{
    switch(action.type){
        case USER_LIST_REQUEST:
            return{
                fetching_users:true,
            }

        case USER_LIST_SUCCESS:
            return{
                fetching_users:false,
                users: action.payload,
                useroptions:action.options
            }
            
        case USER_LIST_FAIL:
            return{
                fetching_users:false,
                error:action.payload
            }   
        default:
            return state         
    }
}

export const orgAdminUserResultReducer = (state={},action) =>{
    switch(action.type){
        case USER_RESULT_REQUEST:
            return{
                fetching_user_results:true,
            }

        case USER_RESULT_SUCCESS:
            return{
                fetching_user_results:false,
                user_results: action.payload,
            }
            
        case USER_RESULT_FAIL:
            return{
                fetching_user_results:false,
                error:action.payload
            }   
        default:
            return state         
    }
}

export const orgAdminManageUserReducer = (state={},action) =>{
    switch(action.type){
        case ORG_ADMIN_MANAGE_USER_REQUEST:
            return{
                processing:true,
            }

        case ORG_ADMIN_MANAGE_USER_SUCCESS:
            return{
                processing:false,
                success: action.payload
            }
            
        case ORG_ADMIN_MANAGE_USER_FAIL:
            return{
                processing:false,
                error:action.payload
            }   
        case  ORG_ADMIN_MANAGE_USER_RESET:
            return{
                processing: false
            }  
        default:
            return state         
    }
}
