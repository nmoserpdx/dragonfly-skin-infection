import{ORG_LIST_FAIL, ORG_LIST_REQUEST, ORG_LIST_SUCCESS, PROTONDX_ADMIN_DATA_EXPORT_FAIL, PROTONDX_ADMIN_DATA_EXPORT_REQUEST, PROTONDX_ADMIN_DATA_EXPORT_SUCCESS, PROTONDX_ADMIN_INFECTION_STATS_FAIL, PROTONDX_ADMIN_INFECTION_STATS_REQUEST, PROTONDX_ADMIN_INFECTION_STATS_SUCCESS, PROTONDX_ADMIN_MANAGE_ORG_FAIL, PROTONDX_ADMIN_MANAGE_ORG_REQUEST, PROTONDX_ADMIN_MANAGE_ORG_SUCCESS,
    PROTONDX_ADMIN_RESET_CSV_JSON,
    PROTONDX_ADMIN_STATS_FAIL,
    PROTONDX_ADMIN_STATS_REQUEST,
    PROTONDX_ADMIN_STATS_SUCCESS, 
} from '../types'


export const protondxAdminStatsReducer = (state={},action) =>{
    switch(action.type){
        case PROTONDX_ADMIN_STATS_REQUEST:
            return{
                processing:true,
            }

        case PROTONDX_ADMIN_STATS_SUCCESS:
            return{
                processing:false,
                stats:action.stats,
                barGraphData:action.bar_graph_data,
                pievalues: action.pie_values
            }
            
        case PROTONDX_ADMIN_STATS_FAIL:
            return{
                processing:false,
                error:action.payload
            }   
        default:
            return state         
    }
}

export const protondxAdminInfectionStatsReducer = (state={},action) =>{
    switch(action.type){
        case PROTONDX_ADMIN_INFECTION_STATS_REQUEST:
            return{
                processing:true,
            }

        case PROTONDX_ADMIN_INFECTION_STATS_SUCCESS:
            return{
                processing:false,
                infectionStats:action.payload
            }
            
        case PROTONDX_ADMIN_INFECTION_STATS_FAIL:
            return{
                processing:false,
                error:action.payload
            }   
        default:
            return state         
    }
}

export const protondxAdminOrgListReducer = (state={},action) =>{
    switch(action.type){
        case ORG_LIST_REQUEST:
            return{
                processing:true,
            }

        case ORG_LIST_SUCCESS:
            return{
                processing:false,
                orgs: action.payload,
                orgoptions:action.options
            }
            
        case ORG_LIST_FAIL:
            return{
                processing:false,
                error:action.payload
            }   
        default:
            return state         
    }
}

export const protondxAdminExportDataReducer = (state={},action) =>{
    switch(action.type){
        case PROTONDX_ADMIN_DATA_EXPORT_REQUEST:
            return{
                exporting:true,
            }

        case PROTONDX_ADMIN_DATA_EXPORT_SUCCESS:
            return{
                exporting:false,
                exportable_json:action.payload,
                export_data_received:action.data_received
            }
            
        case PROTONDX_ADMIN_RESET_CSV_JSON:
            return{
                exporting:false,
                exportable_json:[],
                export_data_received:false
            }
        case PROTONDX_ADMIN_DATA_EXPORT_FAIL:
            return{
                exporting:false,
                error:action.payload,

            }   
        default:
            return state         
    }
}


export const protondxAdminManageOrgReducer = (state={},action) =>{
    switch(action.type){
        case PROTONDX_ADMIN_MANAGE_ORG_REQUEST:
            return{
                processing:true,
            }

        case PROTONDX_ADMIN_MANAGE_ORG_SUCCESS:
            return{
                processing:false,
                success: action.payload
            }
            
        case PROTONDX_ADMIN_MANAGE_ORG_FAIL:
            return{
                processing:false,
                error:action.payload
            }   
        default:
            return state         
    }
}


