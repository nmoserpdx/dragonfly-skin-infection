const FourInstructions = ({type,images,info,addInfo}) => {

    return (
        <div className="w-full flex-row" style={{display: "inline-flex", justifyContent: "center", paddingLeft: "1vw", paddingRight: "1vw"}}>
        { [...Array(type).keys()].map((k,index) => {
            return(
        <div key={index} className="w-1/4" style={{padding: "0.5vw"}}>
          <img style={{paddingTop: "1.5vw"}} className="w-[16.35vw]" src={`/images/${images[k]}.png`} type="image/png"  alt="inst4"/>
          <div className="content-text !text-[2.43vh] !leading-[2.43vh]" style={{ paddingTop: "2.08vh"}}>
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

export default FourInstructions
