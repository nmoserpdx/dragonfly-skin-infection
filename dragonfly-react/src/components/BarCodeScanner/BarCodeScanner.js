import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Button, Divider } from "semantic-ui-react";
import { Modal } from "semantic-ui-react";

import { useDashboardUiStore } from "../../storeDashboard/dashboardUi";
// const device= localStorage.getItem('bt_deviceInfo') ?
//                             JSON.parse(localStorage.getItem('bt_deviceInfo')):
//                             null


function BarCodeScanner({ handleClose }) {

  const { bluetoothDevices } = useDashboardUiStore()

  const [devices, setDevices] = useState({});
// if(device!=null)
// {
//   alert("device is existing")
//   setDevices(device)

// }
// else{
//   alert("device is not existing")

// }

  const { isBarCodePopUp, setIsBarCodePopUp, setisBTactive, isBTactive } = useDashboardUiStore();

  // useEffect(() => {
  //   window.setBluetoothConnectedDevices = function (json) {
  //     var data = JSON.parse(json)
  //     setDevices(data)
  //   }
  // }, [devices])

  useEffect(() => {
      setDevices(bluetoothDevices)
  }, [bluetoothDevices])

  // useEffect(() => {
  //   // let getDevice=localStorage.getItem('BTinfo')
  //   //    getDevice=JSON.parse(getDevice)
  //   if (isBTactive) {
  //     setisBTactive(true)
  //   }
  //   else {
  //     setisBTactive(false)
  //   }
  // }, [devices])
  if (window)
    window.setBluetoothConnectedDevices = function (json) {
      var data = JSON.parse(json)
      setDevices(data)
    }

  const deviceData = () => {
    let deviceInfo = {
      device_name: "EY-015P",
      device_status: 12,
      device_address: "8C:F1:12:96:38:86",
    }
    //localStorage.setItem('BTinfo',JSON.stringify(deviceInfo))
    setDevices(deviceInfo)
  }

  // const [isBarCodePopUp, setIsBarCodePopUp] = useState(false);
  // useEffect(
  //   // console.log("hi");
  //   window.setBluetoothConnectedDevices = function (json) {
  //     var data = JSON.parse(json)
  //     setDevices(json)
  //     alert(json);
  //     return true
  //   }
  // , [])

  const handlePopUp = () => {
    console.log(isBarCodePopUp)
    setIsBarCodePopUp(!isBarCodePopUp);
  }

  function handleBarcodeScanner() {
    //setisBTactive(true)
    if (window.NativeDevice) {
      window.NativeDevice.initBluetooth();
    }
    else {
      deviceData()   // default device
    }
  }
  function handleDisconnectBluetoothDevice(name) {
    if (window.NativeDevice) {
      window.NativeDevice.disconnectBluetoothDevice(name);
    }
  }
  function handleForget() {
    // console.log("Hi");
    setisBTactive(false);
    // call before delete
    handleDisconnectBluetoothDevice(devices.device_address);
    setDevices({});
    setIsBarCodePopUp(false);
  }
  return (
    <div style={{ maxHeight: 720, overflow: "hidden", position: "fixed" }}>
      <Divider style={{ width: "100%" }} />
      <Row
        style={{
          fontFamily: "Public Sans",
          fontWeight: "normal",
          color: "#292929",
          fontSize: "1.5rem",
          justifyContent: "left",
          alignItems: "center",
          padding: "10px 0px 10px 20px",
        }}
      >
        <img
          style={{ maxWidth: "52px" }}
          src="assets/icons/iconBack.svg"
          alt="help"
          onClick={handleClose}
        />

        <span className="inline-flex w-3/4 font-bold" style={{fontFamily: "Public Sans Bold", marginLeft: "1.8vw"}}>
        Pair Barcode Scanner
        </span>
      </Row>

      <Divider style={{ width: "100%" }} />

      {/* <div
        style={{ marginLeft: "54px" }}
        className="ml-10 settingsItem-grid h-[4vh] aligncenter"
      >
        <img className="!w-[1.85vw]" src="assets/icons/plus.svg" alt="help" />
        <span className="font-2rem self-center !py-[1.65vh] text-blackish">
          Pair Scanner
        </span>
      </div> */}

      <Row
        style={{
          fontFamily: "Public Sans",
          fontWeight: "normal",
          color: "#292929",
          fontSize: "2vw",
          justifyContent: "left",
          alignItems: "center",
          marginLeft: "2.2vw",
          marginTop: "20px",
        }}
      >
        <img
          style={{ maxWidth: "52px" }}
          src="assets/icons/plus.svg"
          alt="plus"
        />
        <span className="inline-flex w-3/4 text-lg font-bold" style={{fontFamily: "Public Sans Bold"}}>
          Pair scanner
        </span>
      </Row>
      <Col
        sm={4}
        style={{
          marginLeft: "116px",
          marginTop: "15px",
          color: "#292929",
          fontSize: "1.2rem",
        }}
        className="public-sans-medium"
      >
        <Row className="public-sans-medium">
          Set the device to SPP (Serial Port Profile) pairing mode by scanning the appropriate bar code in the manufacturer’s User Manual. Once SPP mode has been entered, press start to pair.
        </Row>

        <Row className="public-sans-medium" style={{ marginTop: "15px" }}>
          Once SPP mode has been scanned, press start to pair.
        </Row>
        <Row className="public-sans-medium" style={{ marginTop: "60px" }}>
          <Button className="startBtn" onClick={handleBarcodeScanner}>
            Start
          </Button>
        </Row>
        <Row style={{ marginTop: "35px", marginBottom: "16px" }}>
          Connected Devices:
        </Row>
        <Row>
          {Object.keys(devices).length !== 0 && devices.device_status !== 10 ? (
            <Card
              className="p-2 text-blackish sm-3"
              style={{
                background: "#a7e1b7",
                fontSize: "18px",
                borderRadius: "10px",
                borderColor: "#a7e1b7",
                marginLeft: "0px",
              }}
            >
              <Row>
                <Col sm={6} style={{ paddingLeft: "30px" }}>
                  {devices.device_name}
                </Col>
                <Col sm={5} style={{ textAlign: 'end' }}>
                  {devices.device_status === 12
                    ? "Connected"
                    : devices.device_status === 11
                      ? "Pairing"
                      : ""}
                </Col>
                <Col sm={1} style={{ paddingLeft: "0px", margin: 'auto' }}>
                  <img
                    className="!w-[1.85vw]"
                    src="assets/icons/close.svg"
                    alt="close"
                    onClick={() => {
                      handlePopUp();
                    }}
                  />
                </Col>
              </Row>
            </Card>
          ) : (
            ""
          )}
        </Row>

      </Col>

      <Modal
        className="!relative !w-[39.5vw] !h-[45.05vh] cancelModalBeg"
        open={isBarCodePopUp}
      >
        <div className="text-[2.5vh] max-w-2xl"
          style={{
            fontFamily: "Public Sans",
            fontWeight: "normal",
            color: "#292929",
            fontSize: "26px",
            marginTop: '16px'
          }}>
          Disconnect Device
        </div>

        <div
          style={{
            fontFamily: "Public Sans",
            fontWeight: "normal",
            color: "#292929",
            fontSize: "20px",
            marginTop: '16px'
          }}
        >
          Press Forget to remove the Bluetooth device
        </div>
        <Modal.Actions className="!border-[0px]">
          <Button
            className="confirmBtn m-0 modalBtnLeft !w-[11.97vw] !h-[5.04vh]"
            onClick={() => setIsBarCodePopUp(false)}
          >
            Cancel
          </Button>
          <Button
            className="backbtn confirmBtn modalBtnRight !w-[11.97vw] !h-[5.04vh] "
            onClick={handleForget}
          >
            Disconnect
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}

export default BarCodeScanner;
