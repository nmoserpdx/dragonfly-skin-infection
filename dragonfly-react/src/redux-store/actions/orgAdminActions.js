import axios from 'axios'
import{ ORG_ADMIN_DATA_EXPORT_FAIL, ORG_ADMIN_DATA_EXPORT_REQUEST, ORG_ADMIN_DATA_EXPORT_SUCCESS, ORG_ADMIN_INFECTION_STATS_FAIL, ORG_ADMIN_INFECTION_STATS_REQUEST, ORG_ADMIN_INFECTION_STATS_SUCCESS, ORG_ADMIN_RESET_CSV_JSON, ORG_ADMIN_STATS_FAIL,
    ORG_ADMIN_STATS_REQUEST,
    ORG_ADMIN_STATS_SUCCESS,
    USER_LIST_FAIL,
    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_RESULT_FAIL,
    USER_RESULT_REQUEST,
    USER_RESULT_SUCCESS
} from '../types'
import {server_base_url} from '../../shared'
import moment from 'moment'


export const getOrgAdminStats = (user_key, query_key) => async (dispatch) =>{
    try {
        dispatch({
            type:ORG_ADMIN_STATS_REQUEST,
        })

        const now = new Date()
        var fromDate
        var toDate = new Date(now.getTime() + (24 * 60 * 60 * 1000)).toISOString().slice(0, 10)
        switch(query_key){

            case 'today':
                fromDate = now.toISOString().slice(0, 10)
                // console.log("Today " + fromDate)
                toDate = new Date(now.getTime() + (24 * 60 * 60 * 1000)).toISOString().slice(0, 10)
                // console.log(toDate)
                break
            case 'week':
                fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1).toISOString().slice(0, 10)
                // console.log("week " + fromDate)
                toDate = new Date(now.getTime() + (24 * 60 * 60 * 1000)).toISOString().slice(0, 10)
                // console.log("week " + toDate)
                break
            case 'month':
                fromDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
                // console.log("Month " + fromDate)
                toDate = new Date(now.getTime() + (24 * 60 * 60 * 1000)).toISOString().slice(0, 10)
                // console.log("Month " + toDate)
                break
             case 'year':
                var currentYear = new Date().getFullYear()
                fromDate = `${currentYear}-01-01`
                // console.log("year: " + fromDate)
                toDate = new Date(now.getTime() + (24 * 60 * 60 * 1000)).toISOString().slice(0, 10)
                // console.log("year: " + toDate)
                break
            /*case 'lastmonth':
               let cYear = now.getFullYear()
               let cMonth = now.getMonth()
               console.log(cMonth)
               if(cMonth != 0){
                  fromDate = `${cYear}-${cMonth-1}-01`
                  toDate = `${cYear}-${cMonth-1}-30`
               }else{//will go to past year
                 fromDate = `${cYear}-12-01`
                 toDate = `${cYear}-12-31`
               }
               console.log(fromDate)
               console.log(toDate)
               toDate = new Date(now.getTime() + (24 * 60 * 60 * 1000)).toISOString().slice(0, 10)
               break
           case 'lastyear':
              var currentYear = new Date().getFullYear()
              fromDate = `${currentYear}-01-01`
              toDate = new Date(now.getTime() + (24 * 60 * 60 * 1000)).toISOString().slice(0, 10)
              break*/
            default:
                fromDate = now.toISOString().slice(0, 10)
                toDate = new Date(now.getTime() + (24 * 60 * 60 * 1000)).toISOString().slice(0, 10)
        }

        const url = `${server_base_url}/userresults`
        const accessToken = JSON.parse(localStorage.getItem('userInfo')).auth0_access_token
        // const orgId = JSON.parse(localStorage.getItem('userInfo')).org_id
        const mac_address = JSON.parse(localStorage.getItem('userInfo')).mac_address

        const jsondata = {
            from_date: fromDate,
            to_date: toDate,
            user_id: user_key,
            mac_address: mac_address
        }

        var data=null
        if(!window.navigator.onLine){
          data = JSON.parse(window.NativeDevice.getDashboardresultsFromDevice(JSON.stringify(jsondata)))
        }else
        {
          data = await axios({
              method: 'get',
              url: url,
              headers:{
                  'Content-Type':'application/json',
                  "X-AuthorityToken": "auth-wpf-desktop",
                  "X-AccessToken" : accessToken
              },
              params: jsondata
          })
          data = data.data
        }

        const stats_data = data
        const stats = stats_data
        const graphdata = stats_data.graphdata
        const piedata = stats_data.piedata

        const bar_graph_data = {
            labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
              {
                label:"",
                data:[
                  graphdata.january,
                  graphdata.february,
                  graphdata.march,
                  graphdata.april,
                  graphdata.may,
                  graphdata.june,
                  graphdata.july,
                  graphdata.august,
                  graphdata.september,
                  graphdata.october,
                  graphdata.november,
                  graphdata.december
                ],
                backgroundColor: [
                  '#24B34B',
                ],
                borderColor: [
                  '#24B34B',
                ],
                borderWidth: 1,
              },
            ],
          }

         const pie_values = [
            { x: "Positive", y: piedata.positive },
            { x: "Negative", y: piedata.negative },
            { x: "No Result", y: piedata.noresult },
          ]
        dispatch({
            type:ORG_ADMIN_STATS_SUCCESS,
            stats:stats,
            bar_graph_data:bar_graph_data,
            pie_values:pie_values
        })

    } catch (error) {
        dispatch({
            type:ORG_ADMIN_STATS_FAIL,
            payload:
                error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}

export const getOrgAdminInfectionStats = (user_key, query_key) => async (dispatch, getState) =>{
    try {
        dispatch({
            type:ORG_ADMIN_INFECTION_STATS_REQUEST,
        })

        var fromDate
        var toDate
        const now = new Date()
        switch(query_key){

            case 'today':
                fromDate = now.toISOString().slice(0, 10)
                toDate = new Date(now.getTime() + (24 * 60 * 60 * 1000)).toISOString().slice(0, 10)
                break
            case 'week':
                fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1).toISOString().slice(0, 10)
                toDate = new Date(now.getTime() + (24 * 60 * 60 * 1000)).toISOString().slice(0, 10)
                break
            case 'month':
                fromDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
                toDate = new Date(now.getTime() + (24 * 60 * 60 * 1000)).toISOString().slice(0, 10)
                break
            case 'year':
                var currentYear = new Date().getFullYear()
                fromDate = `${currentYear}-01-01`
                toDate = new Date(now.getTime() + (24 * 60 * 60 * 1000)).toISOString().slice(0, 10)
                break
            default:
                fromDate = now.toISOString().slice(0, 10)
                toDate = new Date(now.getTime() + (24 * 60 * 60 * 1000)).toISOString().slice(0, 10)
                break
        }
        const accessToken = JSON.parse(localStorage.getItem('userInfo')).auth0_access_token
        // const orgId = JSON.parse(localStorage.getItem('userInfo')).org_id
        const url = `${server_base_url}/infectiondata`

       const jsondata = {
         from_date: fromDate,
         to_date: toDate,
        //  org_id: orgId,
         user_id: user_key
       }
       var data=null
       if(!window.navigator.onLine && window.NativeDevice){
         data =JSON.parse(window.NativeDevice.getInfectiondataFromDevice(jsondata))
       }else
       {
         var response = await axios({
           method: 'get',
           url: url,
           headers:{
           'Content-Type':'application/json',
           "X-AuthorityToken": "auth-wpf-desktop",
           "X-AccessToken" : accessToken
           },
           params: jsondata
         })
         data = response.data
       }
          // percentage calculation
        var total = 0
        if(data.noinfection < 0){
            total = data.covid + data.influenzaA + data.influenzaB + data.rsv + data.rhino
        } else {
            total = data.noinfection + data.covid + data.influenzaA + data.influenzaB + data.rsv + data.rhino
        }

        var covid = 0
        var influenzaA = 0
        var influenzaB = 0
        var rsv = 0
        var rhino =0
        var noinfection =0
        if(total >0){
            covid = ((data.covid / total)*100).toFixed(2)
            influenzaA = ((data.influenzaA / total)*100).toFixed(2)
            influenzaB = ((data.influenzaB / total)*100).toFixed(2)
            rsv = ((data.rsv/ total)*100).toFixed(2)
            rhino = ((data.rhino/ total)*100).toFixed(2)
            noinfection = 100- (Number(covid) + Number(influenzaA) + Number(influenzaB) + Number(rsv) + Number(rhino))
        }
        const infectionData = {
            noinfection,
            covid,
            influenzaA,
            influenzaB,
            rsv,
            rhino
        }
        dispatch({
            type:ORG_ADMIN_INFECTION_STATS_SUCCESS,
            payload:infectionData,
        })

    } catch (error) {
        dispatch({
            type:ORG_ADMIN_INFECTION_STATS_FAIL,
            payload:
                error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}

export const resetCSVjson = ()=> async (dispatch)=>{

    dispatch({
        type:ORG_ADMIN_RESET_CSV_JSON
    })
}

export const exportOrgAdminData = (fromDate, toDate, userId) => async (dispatch, getState) =>{
    try {
        dispatch({
            type:ORG_ADMIN_DATA_EXPORT_REQUEST,
        })

        const accessToken = JSON.parse(localStorage.getItem('userInfo')).auth0_access_token
        // const orgId = JSON.parse(localStorage.getItem('userInfo')).org_id
        const mac_address = JSON.parse(localStorage.getItem('userInfo')).mac_address
        const url = `${server_base_url}/mac_export`

         const jsondata = {
           from_date: fromDate,
           to_date: toDate,
           user_id:userId,
        //    org_id:orgId,
           mac_address: mac_address
         }
         var data=null
         //Moving the call to Android for export
         if(!window.navigator.onLine && window.NativeDevice){
           data =JSON.parse(window.NativeDevice.exportdataFromDevice(JSON.stringify(jsondata)))
           dispatch({
             type:ORG_ADMIN_DATA_EXPORT_SUCCESS,
             payload:data,
           })
         }else if(window.navigator.onLine && window.NativeDevice){
           var response = await axios({
             method: 'get',
             url: url,
             headers:{
             'Content-Type':'application/json',
             "X-AuthorityToken": "auth-wpf-desktop",
             "X-AccessToken" : accessToken
             },
             params: jsondata
           })
           data = response.data

           //data =JSON.parse(window.NativeDevice.exportdataToCSV(JSON.stringify(jsondata)))

           if(response.status === 200 ||response.status === 201){
             dispatch({
               type:ORG_ADMIN_DATA_EXPORT_SUCCESS,
               payload:data,
             })
          }else{
            dispatch({
                type:ORG_ADMIN_DATA_EXPORT_FAIL,
                payload:data.error.message
            })
          }
         }else{
           var response1 = await axios({
             method: 'get',
             url: url,
             headers:{
             'Content-Type':'application/json',
             "X-AuthorityToken": "auth-wpf-desktop",
             "X-AccessToken" : accessToken
             },
             params: jsondata
           })
           data = response1.data
         }
         dispatch({
         type:ORG_ADMIN_DATA_EXPORT_SUCCESS,
         payload:data,
         })

    } catch (error) {
        dispatch({
            type:ORG_ADMIN_DATA_EXPORT_FAIL,
            payload:
                error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}

export const exportOrgAdminSelectedData = (data) => async (dispatch, getState) =>{
    try {
        dispatch({
            type:ORG_ADMIN_DATA_EXPORT_REQUEST,
        })
        dispatch({
            type:ORG_ADMIN_DATA_EXPORT_SUCCESS,
            payload:data,
        })
    }catch (error) {
        dispatch({
            type:ORG_ADMIN_DATA_EXPORT_FAIL,
            payload:
                error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}

export const getOrgAdminUserList = (current_page, number_of_rows_per_page) => async (dispatch) =>{
    try {
        dispatch({
            type:USER_LIST_REQUEST,
        })

        const orgId = JSON.parse(localStorage.getItem('userInfo')).org_id
        const accessToken = JSON.parse(localStorage.getItem('userInfo')).auth0_access_token
        const url = `${server_base_url}/users`

       const jsondata = {
         org_id: orgId,
         current_page: current_page,
         number_of_rows_per_page: number_of_rows_per_page
       }

       var data=null
       if(!window.navigator.onLine && window.NativeDevice){
         data = JSON.parse(window.NativeDevice.getUserListFromDevice(jsondata))
       }else
       {
         try{
           data = JSON.parse(window.NativeDevice.getUserListFromDevice(jsondata))
         }catch(e){
           //Failed getting user data from tablet, so trying to pull from the server
           var response= await axios({
             method: 'get',
             url: url,
             headers:{
             'Content-Type':'application/json',
             "X-AuthorityToken": "auth-wpf-desktop",
             "X-AccessToken" : accessToken
             },
             params:jsondata
           })
           data = response.data
         }
         //Following is user list populated from Device all the time
       }
       // // Save the user data to the local storage
       // localStorage.setItem('pdxTableRows', JSON.stringify(data))

        const user_options = [{
            value:'0', label:'All'
        }]

        const users = data
        users.map(user=>(
            (typeof(user.auth0_user_id) != 'undefined') ?
              user_options.push({value:user.id, label:user.name})
            : console.log("error")
        ))

        dispatch({
            type:USER_LIST_SUCCESS,
            payload:data,
            options:user_options
        })

    } catch (error) {
        dispatch({
            type:USER_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}

export const getOrgAdminUserResult = (current_page, number_of_rows_per_page, fromDateFromParam = "", toDateFromParam = "", userId = "") => async (dispatch) =>{
    try {
        dispatch({
            type:USER_RESULT_REQUEST,
        })

        // const orgId = JSON.parse(localStorage.getItem('userInfo')).org_id
        const accessToken = JSON.parse(localStorage.getItem('userInfo')).auth0_access_token
        const mac_address = JSON.parse(localStorage.getItem('userInfo')).mac_address

        const url = `${server_base_url}/mac_show`

        let toDate =  moment(toDateFromParam).format("YYYY-MM-DD")
        let fromDate = moment(fromDateFromParam).format("YYYY-MM-DD")
        if(!toDateFromParam) {
            const now = new Date()
            toDate = new Date(now.getTime() + (24 * 60 * 60 * 1000)).toISOString().slice(0, 10)
        }

        if(!fromDateFromParam) {
            var d = new Date(new Date().getFullYear(), 0, 1);
            fromDate = d.getFullYear() + "-0" + (d.getMonth()+1) + "-0" + d.getDate();
        }

       const jsondata = {
         from_date: fromDate,
         to_date: toDate,
        //  ...(userId ? {user_id: userId} : {org_id: orgId}),
         mac_address: mac_address,
         current_page: current_page,
         number_of_rows_per_page: number_of_rows_per_page
       }
       let data=null
       if(!window.navigator.onLine && window.NativeDevice){
         data = JSON.parse(window.NativeDevice.getUserResultsFromDevice(jsondata))
       }else
       {
         var response = await axios({
           method: 'get',
           url: url,
           headers:{
           'Content-Type':'application/json',
           "X-AuthorityToken": "auth-wpf-desktop",
           "X-AccessToken" : accessToken
           },
           params:jsondata
         })
         data = response.data
       }
       // if(typeof(data) === 'undefined'){ //Error
       // if(!window.navigator.onLine && window.NativeDevice){
       // data = window.NativeDevice.getUserResultsFromDevice(jsondata)
       // }
       // }

        data && data.map(datum =>{
            if(datum.total_rows){
                // Save the user data to the local storage
                localStorage.setItem('pdxTableTotalRows', JSON.stringify(datum.total_rows))
            }
        })
        //Removing number of pages and cols
        data.pop()
        data.pop()

        dispatch({
            type:USER_RESULT_SUCCESS,
            payload:data,
        })

    } catch (error) {
        dispatch({
            type:USER_RESULT_FAIL,
            payload:
                error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}
