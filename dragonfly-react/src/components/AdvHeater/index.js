import React from "react";
import { useState,useEffect } from "react";
import "./Heater.css";
import AdvProgressbar from "./ProgressBar";
import { Button } from "semantic-ui-react";
import { useAdvHeaterStore } from "../../storeAdv/advHeater";
import { useAdvSampleStore } from "../../storeAdv/advSample";
function AdvHeaterSection() {
  const heatersNo = ["1", "2", "3", "4"];
  //const loadNo = 1;
  //const heater = [1, 2, 3];
  var [noOfHeaters, setNoOfHeaters] = useState(0);
  const [alpha, setAlpha] = useState([])

  const {
    setAdvSamplesPos,
    currentAdvSampleNo,
    advSamples,
  } = useAdvSampleStore();
  const {
    isHeaterModal,
    loadedRow,
    setLoad,
    allHeaters,
    loadedHeaterId,
    HeaterId,
    setHeaterId,
    AdvHeater,
    setAdvHeater,
    removeHeater
  } = useAdvHeaterStore()

  const handleMissingNumber = (a) => {
    var g = a.sort(function(a, b) {
      return a - b;
    });

    for (let i = 0; i <= g.length; i++) {

      if (!(g[i] === i)) {

        return ((i + 1) + 9).toString(36);
      }
    }
  };

  const handleAdd = () => {

    var val = handleMissingNumber(allHeaters)

    setNoOfHeaters((noOfHeaters += 1))
    setAdvHeater(val)
    setHeaterId(val)
    setAlpha(prev => {
      return [...prev, val];
    })
  }

  const handleHeaterClick = (event,a) =>
  {
    setLoad(a,event)
  }
  useEffect(() => {

      setAdvSamplesPos(currentAdvSampleNo,loadedHeaterId+loadedRow)
  }, [loadedRow,loadedHeaterId])
  	return (
  		<div className='adv-heater' >
  			{/* {console.log(HeaterId)} */}
  			<div className={`adv-heater-cont !text-[#292929] ${HeaterId.length>=3?``:`justify-center`}`}>

  				{HeaterId.map((a,index) => {
  					return (
  						<div className={`!h-[35.73vh] !min-w-[29.58vw] bg-[rgb(239,239,239)] flex items-center relative justify-center mr-[2.083vw]`} key = {index}>
  						<div
  							className='Heater heateradv '
  							style={{
  								padding: "0px",
  								margin: "0px",
  								maxHeight: "28.91vh",
  							}}>
  										<div className=" mt-[3.47vh]">
  							<div id='Heater' className="!px-[0px] font-semibold absolute top-[2vh] left-[0]" style={{ minWidth: "100%",display:"flex",justifyContent:"center"}}>
  							<span>Heat block | <span style={{textTransform:"uppercase"}}> {a}</span> </span>

  							</div>
  							{a!=='a' && <input type="image" alt="heaterclose" src="assets/icons/close.svg" className="!max-w-[2.083vw] absolute top-[0.98vw] right-[0.98vw] " disabled={AdvHeater[a][1] || AdvHeater[a][2] || AdvHeater[a][3] || AdvHeater[a][4]} onClick={(e)=>removeHeater(a)} name={a}></input>}
												 <ol style={{ minWidth: "100%" }}>
  								{heatersNo.map((key,index)=>{

  									return (
  										<li
  											style={{
  												minWidth: "20.833vw",
  												maxHeight: "4.34vh",
																 }}
															 key = {index}>

  											<span
  												className='tabular  '
  												style={{
  													display: "grid",
  													alignSelf: "center",
  													justifySelf:"start!important",
  												}}>
  												{key}
  											</span>


                                              {AdvHeater[a][key]?
                                                  <AdvProgressbar
  												id={advSamples[AdvHeater[a][key]]}
  												no={key}

  												// onhandlescan={handlescan}
  											/>:<Button  className="heaterButton text-center !p-[0px] !text-[2.78vh]"  style={loadedHeaterId === a && loadedRow === key?{maxWidth:"20.75vw",minHeight:"4.26vh",backgroundColor:"#24B34B",minWidth:"20.75vw"}:{maxWidth:"20.75vw",minHeight:"4.26vh",minWidth:"20.75vw"}} name={key}  onClick={(event) => handleHeaterClick(event.target.name,a)}  disabled={!isHeaterModal}>
  												{loadedHeaterId === a && loadedRow === key?advSamples[currentAdvSampleNo]:""}
  											{/* {loadedHeaterId === a && loadedRow === key?advSamples[currentAdvSampleNo]:""} */}

                                              </Button>}

  										</li>
  									);
  								})}
  							</ol>
  							</div>
  						</div>
  						</div>
  					);
  				})}


  			<div   className="!h-[35.73vh] !min-w-[29.58vw] bg-[rgb(239,239,239)] flex items-center relative justify-center mr-[2.083vw]" style={{fontSize:"32px",display:"flex",alignItems:"center",justifyContent:"center"}}>
  				<button  onClick={handleAdd}>
  				<div  className="!px-[0px] text-[2.78vh] absolute top-[2vh] left-[0] font-semibold " style={{ minWidth: "100%",display:"flex",justifyContent:"center",fontSize:"2rem!important",color:"#9E9E9E"}}>
  				Add heat block
  							</div>
  					<span ><img className="w-[2.083vw]" src="assets/icons/plus.svg" alt="plus" /></span>
  				</button>
  			</div>
  			</div>
  		</div>
  	);
  }

export default AdvHeaterSection;
