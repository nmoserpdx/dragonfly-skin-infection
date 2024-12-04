import { Button } from "semantic-ui-react";
import AdvHeaterSection from "../AdvHeater";


const AdvHeaterSelection= ({handleCloseHeaterModal,handleConfirmHeater,loadedRow}) => {



    return (



    <div className="AdvHeaterOverlay h-full ">

         <div id="AdvHeaterOverlay">
             <div className="flex justify-center pb-[4.78vh]">

         <div className="font-bold text-[2.78vh] w-[60.72vw] -ml-[19.21vw]">
         <div className="text-[#292929]">
         Select the heat block and row button where you placed the test panel. <br />
         Press Confirm when done.
         </div>
         </div></div>
             <AdvHeaterSection /> </div>
     <Button className="confirmBtn backbtn  absolute bottom-[5.21vh] left-[3.44vw]" onClick={handleCloseHeaterModal} disabled={false}>Back</Button>
     <Button className=" confirmBtn absolute bottom-[5.21vh] right-[3.44vw] " onClick={handleConfirmHeater} disabled={!loadedRow}>Confirm</Button>
     </div>
    )

    }
export default AdvHeaterSelection;
