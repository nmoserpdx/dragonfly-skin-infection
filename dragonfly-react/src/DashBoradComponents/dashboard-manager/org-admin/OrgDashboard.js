import React, {useEffect, useState, memo} from 'react'
import {Bar} from 'react-chartjs-2'
import DashboardPie from '../../partials/DashboardPie'
import { useDispatch, useSelector } from 'react-redux'
import {getOrgAdminStats, getOrgAdminInfectionStats} from '../../../redux-store/actions/orgAdminActions'
import { Row, Col } from 'react-bootstrap'
import NavigationBar from '../../partials/NavigationBar'
import DashboardNavigator from '../../partials/DashboardNavigator'
import { VictoryPie } from "victory-pie"
import { Redirect } from 'react-router'
import Loading from '../../partials/Loading'


  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    plugins: {
      legend: {
          display: false
      }
  }
  };
const OrgDashboard = () => {

  const dataFilterKeys = [
    {value:'today', label:'Today'},
    {value:'week', label:'Week'},
    {value:'month', label:'Month'},
    {value:'year', label:'Year'},
    // {value:'lastmonth', label:'Past Month'},
    // {value:'lastyear', label:'Past Year'}
  ]

  const [queryKey, setQueryKey] = useState('today')
  const [userKey, setUserKey] = useState("0");
  const [currentDayYear, setCurrentDayYear] = useState(0)
  const [currentDayMonth, setCurrentDayMonth] = useState(0)

  const {stats, barGraphData, pievalues} = useSelector((state)=>state.orgAdminStats)
  // const {useroptions} = useSelector((state)=>state.orgAdminUserList)
  const {infectionStats} = useSelector((state)=>state.orgAdminInfectionStats)


  const dispatch = useDispatch()

  const handleDataFilter = (query_key)=>{
    setQueryKey(query_key)
  }

  const currentDay = () => {
    var date = new Date()
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000
  }

  const currentMonth = () => {
    var date = new Date()
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), date.getMonth(), 0)) / 24 / 60 / 60 / 1000
  }

  useEffect(() => {
    //Handle timers running in the background
    setCurrentDayYear(currentDay())
    setCurrentDayMonth(currentMonth())
    dispatch(getOrgAdminStats(userKey, queryKey))
    dispatch(getOrgAdminInfectionStats(userKey, queryKey))
    /*if(window.navigator.onLine){

    }else{
      alert("You are not connected to the Internet. Please check your connection and try again.")
    }*/
  }, [dispatch, userKey, queryKey])

  // useEffect(()=>{
  //   dispatch(getOrgAdminUserList())
  // }, [])

    return (
        <div>
          {!localStorage.getItem('userInfo') && <Redirect to='/login' />}
             <NavigationBar />
             {/* <div class="topmenu">
             {useroptions &&
              <select
                className='circle'
                value={userKey}
                style={{padding: "8px", marginRight:"20px"}}
                onChange={e => handleUserFilter(e.target.value)}>
                {useroptions.map(option => (
                <option key={option.value} value={option.value}
                >{option.label}</option>
                ))}
            </select>}
            </div>  */}
             <DashboardNavigator
                btn1={'Organization Dashboard'}
                link1={'/org-admin/org-dashboard'}
                btn2={'User Tests'}
                link2={'/org-admin/userlist'}
                comp={'dashboard'}
             />
             <div className='separator'>
                  {!stats && <Loading />}
             </div>
             {stats &&
             <div className='dashboard-content'>
             <Row>
               {/* Bar Stats*/}
               <Col sm='7'>
                  <div className='dashboard-card'>
                   <Row>
                      <Col sm='6'>
                          <label className='bar-stats-heading'>
                            Statistics
                          </label>
                          <label className='bar-stats'>
                            {stats.testtoday} tests today
                          </label>
                          <label className='bar-stats'>
                            {stats.testmonth} tests last 28 days
                          </label>
                          <label className='bar-stats'>
                            {stats.testyear} tests last 365 days
                          </label>
                      </Col>
                      <Col sm='6'>
                      <div className='piegraph'>
                        { pievalues[0].y===0 && pievalues[1].y===0 && pievalues[2].y===0 ? <div style={{height: "30vh", width: "2vw"}}></div> :
                          <VictoryPie
                            data={pievalues}
                            colorScale={["#ff8a8a", "#24b34b", "#fec20c"]}
                            radius={100}
                          />
                        }
                      </div>
                      </Col>
                    </Row>
                    <Row>
                      <div style={{padding: "10px"}}>
                            <Bar data={barGraphData} options={options} />
                      </div>
                    </Row>
                  </div>

               </Col>

               {/* Pie  Stats*/}
               <Col sm='5'>
                <div className='dashboard-card'>
                    <Row>
                      <Row className="aligncenter">
                        <Col sm='4'>
                          <label>Statistics From </label>
                        </Col>
                        <Col sm='4'>
                        <select
                          value={queryKey}
                          style={{padding: '9px'}}
                          onChange={e => handleDataFilter(e.target.value)}>
                          {dataFilterKeys.map(option => (
                            <option key={option.value} value={option.value} style={{padding: '5px'}}
                            >{option.label}</option>
                          ))}
                        </select>
                        </Col>
                      </Row>
                      <Col lg='4'>
                      <div className='pie-card-container'>
                        <label className='pie-label'>No Infection </label>
                        <div className='pie-card no-infection'>
                            <DashboardPie percentage={infectionStats ? Math.round(infectionStats.noinfection) : 0}  progressColor={'rgba(90, 134, 181, 1)'} trailColor={'rgba(158, 197, 238, 0.2)'}/>
                        </div>
                      </div>
                      </Col>
                      <Col lg='4'>
                        <div className='pie-card-container'>
                          <label className='pie-label'>OPXV </label>
                          <div className='pie-card covid-19'>
                            <DashboardPie percentage={infectionStats ? Math.round(infectionStats.covid) : 0} progressColor={'rgba(102, 228, 127, 1)'} trailColor={'rgba(102, 228, 127, 0.2)'}/>
                          </div>
                        </div>
                      </Col>
                      <Col lg='4'>
                        <div className='pie-card-container'>
                           <label className='pie-label'>MPXV I/II </label>
                          <div className='pie-card flu-a'>
                            <DashboardPie percentage={infectionStats ? Math.round(infectionStats.influenzaA) : 0} progressColor={'rgba(155, 155, 255, 1)'} trailColor={'rgba(158, 197, 238, 0.2)'} />
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col lg='4'>
                        <div className='pie-card-container'>
                        <label className='pie-label'>VZV </label>
                            <div className='pie-card flu-b'>

                              <DashboardPie percentage={infectionStats ? Math.round(infectionStats.influenzaB) : 0} progressColor={'rgba(255, 164, 119, 1)'} trailColor={'rgba(255, 164, 119, 0.2)'}/>
                            </div>
                        </div>
                      </Col>
                      <Col lg='4'>
                        <div className='pie-card-container'>
                        <label className='pie-label'>HSV 1 </label>
                            <div className='pie-card rsv'>

                                <DashboardPie percentage={infectionStats ? Math.round(infectionStats.rsv) : 0} progressColor={'rgba(72, 143, 240, 1)'} trailColor={'rgba(158, 197, 238, 0.2)'}/>
                            </div>
                        </div>
                      </Col>
                      <Col lg='4'>
                        <div className='pie-card-container'>
                        <label className='pie-label'>HSV 2 </label>
                            <div className='pie-card hrv'>

                                <DashboardPie percentage={infectionStats ? Math.round(infectionStats.rhino) : 0} progressColor={'rgba(72, 194, 226, 1)'} trailColor={'rgba(158, 197, 238, 0.2)'} />
                            </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
               </Col>
             </Row>
            </div>
}
        </div>
    )
}

export default memo(OrgDashboard)
