import { useDashboardUiStore } from "../../storeDashboard/dashboardUi";
import { useEffect } from "react";
import { checkBluetooth } from "../../helpers/utilities"

export default function BluetoothButton(){
    const { isBTactive } = useDashboardUiStore();

    useEffect(() => {
    }, [isBTactive])

    return (
      <div className="flex flex-row" style={{flexBasis: "2.5%"}}
        onClick={checkBluetooth}>
        {isBTactive ? (
          <img src="assets/icons/iconBTactive.svg" alt="bt-active-logo" height='30px' width='27px' />
        ) : (
          <img src="assets/icons/iconBTinactive.svg" alt="bt-inactive-logo" height='30px' width='27px' />
        )}
      </div>
    );
}
