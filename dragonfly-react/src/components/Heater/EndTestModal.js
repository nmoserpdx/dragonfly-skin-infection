import { useSampleStore } from "../../store/samples.js";
import { useHeaterStore } from "../../store/heaterStore.js";
import { useState } from "react";
import { Modal,Button } from "semantic-ui-react";
import { usePreparationStore } from "../../store/preparationSteps.js";
import { useUIStore } from "../../store/ui.js";
export default function EndTestModal({setIsCancelModal,removeThisSample, setScanningId}) {
  const sampleState = useSampleStore()
  const { resetPreparationState } = usePreparationStore()
  const { resetUiState, hasCaptureSampleScreen } = useUIStore()
  const {  scanningId } = sampleState;
  // const emptyHeaters = new Array(TOTAL_HEATERS - samples.length).fill(null)
  const heaterState = useHeaterStore()
  const {heater,begSamples} = heaterState
  const heatersNo = [1,2,3,4];
  const [selectedButton,setSelectedButton] = useState("")
  const [isFinalMsg,setIsFinalMsg]=useState(false)
  const handleEndTest = () => {
    if(isFinalMsg){
      removeThisSample(heater[selectedButton])
      setIsCancelModal(false)
      setIsFinalMsg(false)
      setScanningId(false, heater[selectedButton])
      if(hasCaptureSampleScreen && scanningId === heater[selectedButton]) {
        resetPreparationState()
        resetUiState()
      }
    }else {
      setIsFinalMsg(true)
    }
  }

  return (<>
    {/* {console.log(samples)} */}
    <Modal
    open={true}
    className="!relative !w-[39.5vw] !h-[56vh] cancelModalBeg "
    >
      { isFinalMsg?<>
      <div className="font-extrabold text-[2.78vh]  mb-[4.86vh]">Are you sure you want to cancel this test?</div>
      <div className="font-extrabold text-[2.78vh] h-[50%]  flex justify-center items-center">
      Test ID: {begSamples[heater[selectedButton]]}
      </div>

      </> :

      <><div className="font-extrabold text-[2.78vh]  mb-[4.86vh]">To cancel a test, select the test ID and then confirm.</div>
      <div className="Heater  flex justify-center items-center" style={{ padding: "0px", margin: "0px" ,maxHeight:"28.91vh",bottom:"4.78vh"}}>

      <ol className="heaterOl " >
      {heatersNo.map((key,index)=> {
 return(    

 <li name={key} key = {index} style={{ minHeight:"4.34vh"}}>
            <span className="tabular  " style={{display:"grid",alignSelf:"center",justifySelf:"center"}}>{key}</span>

           {/* {console.log(!heater[key])} */}

           <div style={{maxWidth:"18.75vw",minHeight:"4.26vh"}}  className={`relative w-[18.75vw] pheight flex items-center rounded-[40px]  ${selectedButton===key ? "!bg-[red] text-white" :"!bg-[#EFEFEF]" }`}>

           <Button  className="heaterButton !leading-[0] !px-[1.25vw] !m-[0] !py-[0]" disabled={!heater[key]} onClick ={(e)=>setSelectedButton(e.target.name)}  name={key} style={selectedButton===key?{maxWidth:"18.75vw",minHeight:"4.26vh",backgroundColor:"red",minWidth:"18.75vw"}:{maxWidth:"18.75vw",minHeight:"4.26vh",minWidth:"18.75vw"}}>
           {begSamples[heater[key]]}

                </Button>
           <img className="w-[2.083vw] absolute z-[1] right-[0.72vw]" onClick ={(e)=>heater[key]?setSelectedButton(e.target.name):""}  name={key} src="assets/icons/close.svg" alt="close"/>
            {/* <div id="up1" className="flex justify-between w-[18.75vw] px-[1.25vw] absolute">
                <span>{heater[key]}</span>

                </div>
                 */}
                </div>

          </li>
          
          )
         
    })}


      </ol>

    </div></>}

      <Modal.Actions className="!border-[0px] ">

           <Button className="confirmBtn m-0 modalBtnLeft !w-[11.97vw] !h-[5.04vh]" onClick={()=>setIsCancelModal(false)}>
           Back

           </Button>

        <Button
          className=" backbtn confirmBtn modalBtnRight !w-[11.97vw] !h-[5.04vh] "
          disabled={selectedButton?false:true}
        onClick={handleEndTest}


        >End Test</Button>
      </Modal.Actions>
    </Modal>

    </>
  );
}
