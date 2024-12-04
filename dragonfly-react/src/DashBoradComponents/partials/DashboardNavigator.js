import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { useDashboardUiStore } from '../../storeDashboard/dashboardUi'

const DashboardNavigator = ({ btn1 , btn2 }) => {
    const {isList,setIsList} = useDashboardUiStore()
    return (
        <div>
            <Row>
                <Col sm='6'>
                    <div className='link'> 
                     <button onClick={()=>setIsList(false)} className={`${!isList?`protondx-btn-primary`:`protondx-btn-white`} btn-lg`}>{btn1}</button>
                    </div>
                </Col>
                <Col sm='6'>
                    <div className='link'> 
                        <button onClick={()=>setIsList(true)} className={`${isList?`protondx-btn-primary`:`protondx-btn-white`} btn-lg`}>{btn2}</button>
                    </div>    
                </Col>
            </Row>
          
            
        </div>
    )
}

export default DashboardNavigator
