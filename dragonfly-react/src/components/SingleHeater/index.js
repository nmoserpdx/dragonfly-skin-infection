import { useAdvHeaterStore } from "../../storeAdv/advHeater";
import { useAdvSampleStore } from "../../storeAdv/advSample";
import AdvProgressbar from "../AdvHeater/ProgressBar";
import { memo } from "react";
const SingleHeater = ({pos}) => {
    const heatersNo = ["1", "2", "3", "4"];
    const {advSamplesPos} = useAdvSampleStore()
    const {AdvHeater} = useAdvHeaterStore()
    const { advSamples} = useAdvSampleStore()
    let heaterId = typeof advSamplesPos[pos] !="undefined" ?String(advSamplesPos[pos]).slice(0,1):false
    return heaterId && 
    <div className="!h-[35.73vh]  !min-w-[29.58vw] bg-[rgb(239,239,239)] flex items-center relative justify-center mr-[2.083vw]">
						<div
							className='Heater heateradv '
							style={{
								padding: "0px",
								margin: "0px",
								maxHeight: "28.91vh",
							}}>
										<div className=" mt-[3.47vh]">
							<div id='Heater' className="!px-[0px] font-semibold absolute top-[2vh] left-[0]" style={{ minWidth: "100%",display:"flex",justifyContent:"center"}}>
							<span>Heat block | <span style={{textTransform:"uppercase"}}> {heaterId}</span> </span>
						
							</div>
    <ol >
            {heatersNo.map(function (key) {
                                  
                                  return (
                                      <li
                                      style={{
                                        minWidth: "100%",
                                        minHeight: "18.70%",
                                        display: "grid",
                                        gridTemplateColumns: "4.42vw 20.75vw",
                                    }}>
                                    
                                          
                                    <span
												className='tabular  '
												style={{
													display: "grid",
													alignSelf: "center",
													justifySelf:"start!important",
												}}>
												{key}
                                              
                                          </span>
                                             
                                          
                                          {AdvHeater[heaterId]&&
                                              <AdvProgressbar
                                              id={advSamples[AdvHeater[heaterId][key]]}
                                              no={key}
                                              
                                              // onhandlescan={handlescan}
                                          />}
                                          
                                      </li>
                                      
                                  );
                              })}
                              </ol> </div>
                              </div>
                              </div>
                              
}

export default memo(SingleHeater)