import { Button } from "semantic-ui-react";
import { IFUInstructions } from "../../logic/instructions";
import { useAdvUiStore } from "../../storeAdv/advUi";
const IFUscreen = ({ id,no,loaded}) => {
    const {

        setIsIFUscreen,
        iFUscreenFor
    } = useAdvUiStore()
  return (

    <>
      {/* {console.log(IFUInstructions)} */}
    <div style={{minHeight:"67.82vh",maxHeight:"67.82vh",maxWidth:"72.65vw",minWidth:"72.65vw"}}>
                            {/* <CompletedSamplesToasts timerMapper={timerMapper} samples={samples} timeExceededSamples={timeExceededSamples} voidSamples={voidSamples} /> */}
                            <div style={{minHeight:"67.82vh",maxHeight:"67.82vh",maxWidth:"72.65vw",minWidth:"72.65vw",background:"rgb(239,239,239)"}} className="bg-[#c3c2c2] relative  flex flex-col border-3rem">
                            <img className="border-3rem" style={{zIndex:"0",position:"absolute",maxHeight:"67.82vh",maxWidth:"72.65vw",minWidth:"72.65vw"}}  src={IFUInstructions[iFUscreenFor].image} type="image/png" alt="instruction"/>
                            </div></div>
                            <div id="videoDisc" style={{minHeight:"15.21vh",maxWidth:"64vw",alignItems:"flex-end",paddingTop:"1.39vh",lineHeight:"3.47vh"}}>
        <div id="stepcount">{IFUInstructions[iFUscreenFor].heading}</div>

                <div id="stepname" style={{padding:"0px"}}>{IFUInstructions[iFUscreenFor].description}</div>
        </div>

        <div className="flex justify-between absolute  w-full" style={{alignItems:"flex-end",maxHeight:"7.25vh",}}>

        <Button className="confirmBtn t-24 l-space-2" size="mini" style={{maxWidth:"13.02vw",maxHeight:"5.04vh"}} onClick={()=>{setIsIFUscreen(false)}} positive  >Confirm</Button>




        </div>

   </>
  )
};

export default IFUscreen;
