import { useEffect } from "react";
import { useSampleStore } from "../../store/samples";

export default function ExpiryIcon(){
  const {allowExpiry} = useSampleStore();

    useEffect(() => {
    }, [allowExpiry])

    return (
      <div className="flex flex-row" style={{flexBasis: "2.5%"}}>
      { allowExpiry ? (
      <div>
          <img src="assets/icons/EXP.svg" alt="expiry-logo" height='30px' width='27px' />
      </div>
      )
      : ""}
      </div>
    );
}
