import { useState, useEffect } from "react";
import useClick from "../../containers/useClick";

const Icon = ({ value, name, handleClick, handleInput, isCovid }) => {
  const onClick = () => handleClick(name, value);
  const onLongPress = () => handleInput(name, "empty");
  const longPressEvent = useClick(onLongPress, onClick);
  return (
    <div
      className={`minus w-[4.1vw] h-[4.1vw]  text-[1.5vh] text-[white] text-center rounded-[200%] ${
        isCovid ? `mr-[2vw] ml-[1vw]` : ``
      }`}
      value={value}
      name={name}
      {...longPressEvent}
      id={`longPress${name}`}
      key={name}
    >
      {value && value !== "empty" ? (
        <>
          {value === "positive" && (
            <input
              type="image"
              style={{ width: "4.1vw" }}
              src="assets/icons/ManualPlus.svg"
              alt="plus"
            />
          )}
          {value === "negative" && (
            <input
              type="image"
              style={{ width: "4.1vw" }}
              src="assets/icons/ManualMinus.svg"
              alt="minus"
            />
          )}
        </>
      ) : (
        <button
          name={name}
          className={`w-[4.2vw] h-[4.2vw] border-[5px] border-[#FFFFFF]  text-[white] text-center rounded-[200%]`}
        />
      )}
    </div>
  );
};
export default function ManualSelectValue({
  cropImg,
  isCovid,
  value,
  setValue,
  sampleValue,
}) {
  var no = isCovid ? 4 : 8;
  const [result, setResult] = useState({});
  var finalresult = [];
  const handleInput = (name, value) => {
    setResult((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  const handleClick = (name, value) => {
    switch (value) {
      case "positive":
        handleInput(name, "negative");
        break;
      case "negative":
        handleInput(name, "positive");
        break;
      case "empty":
        handleInput(name, "negative");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    generate();
  }, [result]);
  useEffect(() => {
    if (value) {
      [...Array(no).keys()].map((k) => {
        setResult((prevValue) => {
          return {
            ...prevValue,
            [k]: value[k] === 0 ? "positive" : "negative",
          };
        });
        return null;
      });
    }
  }, []);
  const generate = () => {
    [...Array(no).keys()].map((k) => {
      switch (result[k]) {
        case "positive":
          finalresult.push(0);
          break;
        case "negative":
          finalresult.push(1);
          break;
        case "empty":
          finalresult.push(2);
          break;
        default:
          break;
      }
       return null;
      //result[k] === "positive" ? finalresult.push(0) : finalresult.push(1);
    });
    setValue(finalresult);

  };

  return (
    <div
      className="w-full py-[3.82vh] px-[3.75vw] bg-[rgb(239,239,239)] border-3rem"
      style={{ minHeight: "67.82vh", maxHeight: "67.82vh" }}
    >
      <div
        className="text-[3.30vh] leading-none text-center"
        style={{ paddingTop: "3.5%", paddingBottom: "3%" }}
      >
        {/* begSamples[sampleValue] ? begSamples[sampleValue] + " |" : ""*/}{" "}
        {isCovid ? "SARS-CoV-2 Panel" : "Skin Infection Viral Test Panel"}
      </div>

      {/*<div className="text-[2.78vh] mt-[2.78vh] leading-none">Wait 1 minute after removing from Heat Block to assess colour with results card.</div> */}
      <div
        className=" mt-[3.82vh] flex flex-col items-center"
        style={{ justifyContent: "center" }}
      >
        <span></span>
        <img
          className="w-[49.47vw]  mt-[1.82vh] !max-h-[26.95vh]"
          src={cropImg}
          alt="crop"
        />
        <span className="text-[2.78vh] "></span>

        <div
          className={`w-[49.47vw] flex ${
            !isCovid ? `justify-around` : `justify-left`
          } mt-[1.82vh]`}
        >
          {[...Array(no).keys()].map((k, index) => {
            return (
              <Icon
                name={k}
                value={result[k]}
                handleClick={handleClick}
                handleInput={handleInput}
                isCovid={isCovid}
                key={index}
              />
            );
          })}
        </div>
      </div>
      {/* <div className="grid manualinput-grid mt-[1.47vh]">
        <span className="self-center">Negative</span>
        <div className="!w-full flex justify-around " >
          {[...Array(no).keys()].map((k) => {
            return (
              <input
              type="image"
              className="minus w-[3.02vw] h-[3.02vw]  text-[2.78vh] text-[white] text-center rounded-[200%]"
                value="negative"
                name={k}
                onClick={(e) => handleInput(e.target.name, e.target.value)}
                src="assets/icons/ManualMinus.svg"
              >




              </input>
            );
          })}
        </div>
        </div>
        <div className="grid manualinput-grid mt-[2.78vh]">
        <span className="self-center">Positive</span>
        <div  className="!w-full flex justify-around ">
          {[...Array(no).keys()].map((k) => {
            return (
              <input
              type="image"
                className="plus w-[3.02vw] h-[3.02vw]  text-[2.78vh] text-[white] text-center rounded-[200%]"
                value="positive"
                name={k}
                onClick={(e) => handleInput(e.target.name, e.target.value)}
                src="assets/icons/ManualPlus.svg"
              >


              </input>
            );
          })}
        </div>
        </div>
        <div className="grid manualinput-grid  mt-[2.78vh] ">
        <span className="self-center">Empty</span>
        <div  className="!w-full flex justify-around ">
          {[...Array(no).keys()].map((k) => {
            return (
              <button
              className="w-[3.02vw] h-[3.02vw] border-[2px] border-[#707070]  text-[white] text-center rounded-[200%]"
                value="empty"
                name={k}
                onClick={(e) => handleInput(e.target.name, e.target.value)}
              >

              </button>
            );
          })}
        </div>
      </div> */}
      {/* <div className="text-[2.43vh] leading-none mt-[3.21vh] absolute bottom">Incubation time: 21 minutes</div> */}
    </div>
  );
}
