
import { memo } from "react";
import SingleHeater from "../SingleHeater";
const UnloadHeaterOverlayAdvScreen = ({unloadFor,handleUnloadBack,handleUnloadConfirm}) => {
   
    
    return (
        <div className=" flex flex-grow !w-full h-full" >
        <div className="flex !min-w-[50%]  justify-center">
      <div    className="grid  !text-[2.78vh] font-semibold !max-h-[29.30vh] self-center justify-self-center" style={{gridTemplateColumns:"2.7vw 29.58vw"}}>
          <span></span>
          <span>Remove the test panel from the heat block position shown.</span>
          <span></span>
          <span>Press confirm when removed.</span>
          <span id="warn"><svg id="icon_warning" data-name="icon / warning" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 40 40">
         <path id="Path_9620" data-name="Path 9620" d="M0,0H40V40H0Z" fill="none"/>
         <path id="Path_9621" data-name="Path 9621" d="M1,37H39L20,2Zm20.727-5.526H18.273V27.789h3.455Zm0-7.368H18.273V16.737h3.455Z" fill="#D94444"/>
         </svg>
         </span>
          <span>Sample can be kept at room temperature for XX minutes.</span>
          <span id="warn">

          <svg id="icon_warning" data-name="icon / warning" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
             <path id="Path_9620" data-name="Path 9620" d="M0,0H40V40H0Z" fill="none"/>
             <path id="Path_9621" data-name="Path 9621" d="M1,37H39L20,2Zm20.727-5.526H18.273V27.789h3.455Zm0-7.368H18.273V16.737h3.455Z" fill="#D94444"/>
             </svg>
          </span>
          <span>Place test strip on ice for up to XX minutes.</span>

      </div>
      </div>
      <div className="flex !min-w-[50%] justify-center">
      <div    className="grid  !max-h-[29.30vh] self-center justify-self-center" style={{gridTemplateColumns:"2.7vw 29.58vw"}}>
        <SingleHeater pos={unloadFor}/>
      </div>
      </div>
       <button className="absolute bottom-[5.21vh] left-[3.44vw] confirmBtn t-24  backbtn"  onClick={handleUnloadBack}>Back</button>
       
        <button className="absolute bottom-[5.21vh] right-[3.44vw] confirmBtn t-24  backbtn" onClick={handleUnloadConfirm}>confirm</button>
  </div>)
                              
}

export default memo(UnloadHeaterOverlayAdvScreen)