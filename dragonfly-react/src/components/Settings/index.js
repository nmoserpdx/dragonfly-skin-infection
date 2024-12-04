import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Divider } from "semantic-ui-react";
import { useSampleStore } from "../../store/samples";
import { useDashboard } from "../../store/dashboard";
import { useAdvUiStore } from "../../storeAdv/advUi";
import { useUIStore } from "../../store/ui";
import { useAdvSampleStore } from "../../storeAdv/advSample";
import { server_base_url } from "../../shared";
import axios from "axios";
import TestInProgressModal from "../TestInProgressModal";
import CheckForUpdateModal from "../CheckForUpdateModal";
import RestartAppModal from "../RestartAppModal";
import { handleUpdate } from "../../helpers/utilities";

function Settings({ handleCloseBtn, handleBarCodeScanner }) {

  const [expired, setExpired] = useState(false);
  const [demomode, setDemoMode] = useState(false);
  const { isDashboard, setIsDashboard } = useDashboard();
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
  const [openTestModal, setOpenTestModal] = useState(false);
  const [openRestartModal, setOpenRestartModal] = useState(false);
  const [demobuttonSelected, setDemoButtonSelected] = useState(false);
  const { samples, setAllowExpiry, allowExpiry, activeDemoMode, setActiveDemoMode } = useSampleStore();
  const { isAdvScanning } = useAdvUiStore();
  const {
    isScanning,
    startProcessForSamplePreparation,
    hasSamplePreparationStarted,
  } = useUIStore();
  const { samplesNo } = useAdvSampleStore();

  useEffect(() => {
    setExpired(allowExpiry)
  }, [allowExpiry])

  useEffect(() => {
    setDemoMode(activeDemoMode)
  }, [activeDemoMode])

  const isToggleAllowed =
    isScanning ||
    hasSamplePreparationStarted ||
    isAdvScanning ||
    startProcessForSamplePreparation ||
    samples.length > 0 ||
    samplesNo.length > 0;

  const userInfoMain = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  const toggleExpiry = (e) => {
    if (e.currentTarget.checked) {
      setExpired(true)
      setAllowExpiry(true)
    }else{
      setExpired(false)
      setAllowExpiry(false)
    }
  }

  const toggleDemoMode = (e) => {
    //Need to add check for test in progress
    if (e){ //(e.currentTarget.checked) {
      setDemoMode(true)
      if(window.NativeDevice){
        window.NativeDevice.setDemoMode(true);
      }
      setActiveDemoMode(true);
    }else{
      setDemoMode(false)
      if(window.NativeDevice){
        window.NativeDevice.setDemoMode(false);
      }
      setActiveDemoMode(false)
    }
  }

  const handleBarCodeScannerChild = () => {
    //setExpanded(false);
    setIsDashboard(false);
    handleBarCodeScanner();
  };

  //Check for update function here
  const checkForUpdateApi = async () => {
    // Sachin
    // {
    //   console.log(localStorage.getItem("userInfo"));
    // }
    let checkApi = false;
    var userInfo = localStorage.getItem("userInfo");
    let current = userInfoMain.current_version;
    try {

      const accessToken = JSON.parse(userInfo).auth0_access_token
      const url = `${server_base_url}/version`;
      let data = await axios({
        method: "get",
        url: url,
        headers: {
          "Content-Type": "application/json",
          "X-AuthorityToken": "auth-wpf-desktop",
          "X-AccessToken": accessToken,
        },
        params: "",
      });
      let new_version = data.data.version;
      //console.log(new_version);
      if (new_version > current) {
        checkApi = true;
      }
      if (checkApi) {
        // Update Dialog
        setIsUpdateAvailable(true);
      } else {
        // Up to Date
        setIsUpdateAvailable(false);
      }
    } catch (e) {
      alert("Error happened" + JSON.stringify(e));
    }
  }

  const invokeRestart = async() => {
    toggleDemoMode(demobuttonSelected);
    setOpenRestartModal(false);
    if(window.NativeDevice){ //Restart the app here
      window.NativeDevice.restartApp();
    }
  }

  return (
    <div style={{ maxHeight: 720, overflow: "hidden", position: "fixed", width: "95%" }}>
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
          className="inline-flex"
          onClick={handleCloseBtn}
        />
        <span className="inline-flex w-3/4 font-bold" style={{fontFamily: "Public Sans Bold", marginLeft: "1.8vw"}}>
        Settings
        </span>

      </Row>

      <Divider style={{ width: "100%" }} />
      <Row
        style={{
          fontFamily: "Public Sans",
          fontWeight: "normal",
          color: "#292929",
          fontSize: "2vw",
          justifyContent: "left",
          alignItems: "center",
          marginLeft: "50px",
          marginTop: "20px",
          cursor: "pointer"
        }}
        onClick={handleBarCodeScannerChild}
      >
      <Col sm={4} className = "inline-flex align-center pb-3">
        <img
          style={{ maxWidth: "28px", marginLeft: "8px" }}
          src="assets/icons/plus.svg"
          alt="plus"
          className="mx-2 inline-flex align-center"
        />
        <span className="inline-flex w-3/4 text-lg font-bold" style={{fontFamily: "Public Sans Bold"}}>
          Pair barcode scanner
        </span>
      </Col>
      </Row>

      <Divider style={{ width: "100%" }} />
      <Row
        style={{
          fontFamily: "Public Sans",
          fontWeight: "normal",
          color: "#292929",
          fontSize: "2vw",
          justifyContent: "left",
          alignItems: "center",
          marginLeft: "5vw",
          marginTop: "20px",
          marginBottom: "20px"
        }}
      >
      <Col sm={4} className = "inline-flex align-center">
        <div className="inline-flex flex-column">
          <span className="text-lg font-bold">Allow Expired Kits for training</span>
          <span className="text-lg public-sans-medium">Results will be marked as expired and not suitable for pathogen assessment. <br/>Expired kits are suitable for training use only.</span>
        </div>
      </Col>
        <Col
          sm={2}
          style={{
            marginLeft: "116px",
            marginTop: "15px",
            fontFamily: "Public Sans",
            fontWeight: "normal",
            color: "#292929",
            fontSize: "1.2vw",
          }}
        >
        <label className="switch">
          <input name="allowexpiry" type="checkbox"
          checked= { expired ? true : false}
          style={{width: "80px"}}
          onChange={(e) => {
            toggleExpiry(e)
          }}
          />
          <span className="slider round"></span>
        </label>
        </Col>
      </Row>
      <Divider style={{ width: "100%" }} />

      <Row
        style={{
          fontFamily: "Public Sans",
          fontWeight: "normal",
          color: "#292929",
          fontSize: "2vw",
          justifyContent: "left",
          alignItems: "center",
          marginLeft: "5vw",
          marginTop: "20px",
          marginBottom: "20px"
        }}
      >
        <Col
          sm={4}
          className = "inline-flex align-center">
          <div className="inline-flex flex-column">
            <span className="text-lg font-bold">Demo Mode</span>
            <span className="text-lg public-sans-medium">When active, incubation is set to 5 minutes and results are marked for Demonstration Use Only.<br/>Changing modes would require the App to restart.</span>
          </div>
        </Col>
        <Col
          sm={2}
          style={{
            marginLeft: "116px",
            marginTop: "15px",
            fontFamily: "Public Sans",
            fontWeight: "normal",
            color: "#292929",
            fontSize: "1.2vw",
          }}
        >
        <label className="switch">
          <input name="demomode" type="checkbox"
          checked= { demomode ? true : false}
          style={{width: "80px"}}
          onChange={(e) => {
            //toggleDemoMode(e)
            if(!isToggleAllowed){
              setOpenRestartModal(true);
              setDemoButtonSelected(e.currentTarget.checked);
            }else{
              setOpenTestModal(true);
            }
          }} />
          <span className="slider round"></span>
        </label>
        </Col>
      </Row>

      <Divider style={{ width: "100%" }} />

      <Row
        style={{
          fontFamily: "Public Sans",
          fontWeight: "normal",
          color: "#292929",
          fontSize: "2vw",
          justifyContent: "left",
          alignItems: "center",
          marginLeft: "5vw",
          marginTop: "20px",
          cursor: "pointer"
        }}
        onClick={() => {
          //if (!isToggleAllowed) {
            checkForUpdateApi();
            setOpenUpdateModal(true);
          /*} else {
            setOpenModal(true);
          }*/
        }}
      >
      <Col sm={4} className = "inline-flex align-center">
        <div className="inline-flex flex-column">
          <span className="text-lg font-bold">Check for software updates</span>
        </div>
      </Col>
      </Row>

      <TestInProgressModal
        openModal={openTestModal}
        handleClose={() => setOpenTestModal(false)}
        isUpdate={true}
        isTestActive={!isToggleAllowed}
      />
      <CheckForUpdateModal
        openModal={openUpdateModal}
        handleClose={() => setOpenUpdateModal(false)}
        handleUpdate={handleUpdate}
        isUpdateAvailable={isUpdateAvailable}
      />
      <RestartAppModal
        openModal={openRestartModal}
        handleClose={() => setOpenRestartModal(false)}
        handleRestart={invokeRestart}
      />
    </div>
  );
}

export default Settings;
