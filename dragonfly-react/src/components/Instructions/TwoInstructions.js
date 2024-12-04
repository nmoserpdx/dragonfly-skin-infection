const TwoInstructions = ({type,images,info,addInfo}) => {
    return (
        <div className="w-full flex-row" style={{display: "inline-flex", justifyContent: "center",paddingTop:"2.1vh",paddingRight:"1.14vw",paddingLeft:"1.14vw"}}>
        { [...Array(type).keys()].map((k,index) => {
          return (
        
            <div key={index} className="" style={{ paddingLeft: "0.98vw", paddingRight: "0.98vw" }}>
              
          <img  className="w-[33.95vw] h-[41.39vh]"  src={`/images/${images[k]}.png`} type="image/png"  alt="inst2"/>
          <div className="content-text !text-[2.43vh] !leading-[2.43vh]" style={{maxWidth: "34vw", paddingTop: "1vw"}}>
            <span className="fontpublic">{k+1}</span><br/>
            {info[k]}
            <br/><br/>{addInfo[k]&&addInfo[k]}
          </div>
        </div>
         )
        })}
        </div>
    )
}

export default TwoInstructions
