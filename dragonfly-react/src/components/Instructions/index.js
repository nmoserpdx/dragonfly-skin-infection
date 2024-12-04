import FourInstructions from "./FourInstructions";
import TwoInstructions from "./TwoInstructions";
import ThreeInstructions from "./ThreeInstructions";
const Instructions = ({type,images,info,addInfo}) => {
  switch(type) {
    case 3:
      return <ThreeInstructions images={images} info={info} type={type} addInfo={addInfo}/>
    case 4:
      return <FourInstructions images={images} info={info} type={type} addInfo={addInfo} />
    case 2:
      return <TwoInstructions  images={images} info={info} type={type} addInfo={addInfo}/>
    default:
      return <div></div>
  }
}

export default Instructions
