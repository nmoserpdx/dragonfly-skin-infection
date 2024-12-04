import { useAdvSampleStore } from "../../storeAdv/advSample";
import { Button } from "semantic-ui-react";
import { memo } from "react";
const SingleHeaterForUnloadPopUp = ({pos,id,hName}) => {
    const heatersNo = ["1", "2", "3", "4"];
    // const {advSamplesPos} = useAdvSampleStore()
    // let heaterId = typeof advSamplesPos[pos] !="undefined" ?String(advSamplesPos[pos]).slice(0,1):false
    return (
    <div className="!h-[35.73vh]  !min-w-[29.58vw] bg-[#EFEFEF] flex items-center relative justify-center mr-[2.083vw]">
						<div
							className='Heater heateradv '
							style={{
								padding: "0px",
								margin: "0px",
								maxHeight: "28.91vh",
							}}>
										<div className=" mt-[3.47vh]">
							<div id='Heater' className="!px-[0px] font-semibold absolute top-[2vh] left-[0]" style={{ minWidth: "100%",display:"flex",justifyContent:"center"}}>
							<span>Heat block | <span style={{textTransform:"uppercase"}}> {hName?hName:'a'}</span> </span>

							</div>
                    <ol >

            {heatersNo.map((key,index)=> {

                return (
                                
                                      <li
                                      style={{
                                        minWidth: "100%",
                                        minHeight: "18.70%",
                                        display: "grid",
                                        gridTemplateColumns: "4.42vw 20.75vw",
                        }}
                        key = {index}
                    >


                                    <span
												className='tabular  '
												style={{
													display: "grid",
													alignSelf: "center",
													justifySelf:"start!important",
												}}>
												{key}

                                          </span>



                                          <Button id="up1" className={` px-[1.25vw] !py-[0px] top-[0px] right-[0px] m-[0px] !flex justify-center  items-center  ${key===pos?`!bg-[#24B34B]`:`bg-[#8B8B8B]`}`}  disabled={key!==pos} style={{width:"18.75vw",minHeight:"4.27vh",zIndex: "100",borderRadius: "40px",}} >
                                       {key===pos && id}
                                        </Button>

                                      </li>

                                  );
                              })}
                              </ol> </div>
                              </div>
                              </div>)

}

export default memo(SingleHeaterForUnloadPopUp)
