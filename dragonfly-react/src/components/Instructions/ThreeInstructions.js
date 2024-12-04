const ThreeInstructions = ({type,images,info,addInfo}) => {
    return (
   <div className="w-full flex-row" style={{display: "inline-flex", justifyContent: "center"}}>
      { [...Array(type).keys()].map((k,index) => {
      return(
        <div key = {index} className="w-1/4" style={{padding: "0.5vw"}}>
            <img  style={{ maxHeight:"35.5vh",paddingTop: "1.5vw"}} src={`/images/${images[k]}.png`} type="image/png"  alt="inst3"/>
            <div className="content-text !text-[1.43vh] !leading-[2.43vh]" style={{paddingTop: "1vw"}}> {/*maxWidth: "16vw",  */}
                                    <span className="fontpublic">{k+1}</span><br/>
                                    <div>{info[k]}</div><div className="pt-[1.43vh]">
            {addInfo[k]&&addInfo[k]}</div>
                                  </div>
        </div>
      )
    })}

   </div>

    )
}

export default ThreeInstructions
