import { useState, useEffect } from "react";
import { Button } from "semantic-ui-react";
import { Navbar, Container, Offcanvas } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Divider } from "semantic-ui-react";
import { useAdvUiStore } from "../../storeAdv/advUi";
import { useDashboardUiStore } from "../../storeDashboard/dashboardUi";
import { useDashboard } from "../../store/dashboard";
import { useUIStore } from "../../store/ui";
import { useSelector } from "react-redux";
// import { useHeaterStore } from "../../store/heaterStore";
import { useSampleStore } from "../../store/samples";
import { useAdvSampleStore } from "../../storeAdv/advSample";
import TestInProgressModal from "../TestInProgressModal";
import metadata from "../../metadata.json";
import CheckForUpdateModal from "../CheckForUpdateModal";
import { handleUpdate } from "../../helpers/utilities";
import BluetoothButton from "../BluetoothButton";
import ExpiryIcon from "../ExpiryIcon";
import { memo } from "react";

function TopBar({
  handleBeginner,
  handleAdvScreen,
  handelLogout,
  handleSwitchUser,
  handleDashBoard,
  handleBarCodeScanner,
  handleSettings
}) {
  const [expanded, setExpanded] = useState(false);
  const [openTestModal, setOpenTestModal] = useState(false);
  const { samplesNo } = useAdvSampleStore();
  const { isAdvSampleScreen, setIsDetected, isAdvScanning } = useAdvUiStore();
  const {
    isScanning,
    startProcessForSamplePreparation,
    hasSamplePreparationStarted,
  } = useUIStore();

  const { isDashboard, setIsDashboard } = useDashboard();
  const { samples, activeDemoMode } = useSampleStore();
  const { setIsOrgLogin, isBarCode, setIsBarCode } = useDashboardUiStore();
  const isToggleAllowed =
    isScanning ||
    hasSamplePreparationStarted ||
    isAdvScanning ||
    startProcessForSamplePreparation ||
    samples.length > 0 ||
    samplesNo.length > 0;
  const handleBeginnerChild = () => {
    if (!isToggleAllowed) {
      setExpanded(false);
      setIsDetected(false);
      handleBeginner();
    } else if (isDashboard) {
      setExpanded(false);
      setIsDetected(false);
      handleBeginner();
    } else {
      setOpenTestModal(true);
    }
  };

  const { userInfo } = useSelector((state) => state.logIn);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
  }, [])

  const handleAdvScreenChild = (value) => {
    if (!isToggleAllowed) {
      setExpanded(false);
      setIsDetected(false);
      handleAdvScreen();
    } else if (isDashboard) {
      setExpanded(false);
      setIsDetected(false);
      handleBeginner();
    } else {
      setOpenTestModal(true);
    }
  };

  const handleSwitchUserChild = () => {
    handleSwitchUser();
    setExpanded(false);
  };
  const handleDashBoardChild = () => {
    setExpanded(false);
    setIsBarCode(false);
    setIsOrgLogin(true);
    handleDashBoard();
  };

  const handelLogoutChild = () => {
    setExpanded(false);
    handelLogout();
  };

  // const handleBarCodeScannerChild = () => {
  //   setExpanded(false);
  //   setIsDashboard(false);
  //   handleBarCodeScanner();
  // };

  const handleSettingsBtn = () => {
    setExpanded(false);
    setIsDashboard(false);
    handleSettings();
  };

  const shortName = userInfo
    ? userInfo.name
      .match(/(\b\S)?/g)
      .join("")
      .match(/(^\S|\S$)?/g)
      .join("")
      .toUpperCase()
    : "DF";
  return (

    <Navbar expanded={expanded} className="navbar-fixed-top" expand={false}>
      {/* {userInfo?userInfo.name:""} */}
      {/* {console.log(isScanning ,isAdvScanning ,startProcessForSamplePreparation,"here",begSamples,samples.length,isAdvScanning,samplesNo.length)}
      {isToggleAllowed?"red:":"green"} */}

      <Container fluid style={{justifyContent: "flex-start"}}>
        <BluetoothButton/>
        <ExpiryIcon/>
        <div style={{flexBasis: "5%",fontSize: "2rem", color: "#f7d605"}}>
          {
            activeDemoMode ? "DEMO" : ""
          }
        </div>
        <img
          className=" justify-self-center  !h-[4.17vh] !w-[10.46vw]"
          src="assets/icons/Dragonfly.svg"
          alt="logo"
          style={{flexBasis: "82%"}}
        />

        {true && (
          <Navbar.Toggle
            onClick={() => setExpanded(expanded ? false : "expanded")}
            aria-controls="offcanvasNavbar"
            style={{justifyContent: "right", flex: "1", display: "flex", marginRight: "5px"}}
          >
            <div className="!w-[2.3vw] !p-[0] public-sans-medium">
              <svg viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="28" fill="rgb(36,179,75)" />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  fill="White"
                  fontSize="24px"
                  fontFamily="Arial"
                  dy=".4em"
                >
                  {shortName}
                </text>
              </svg>
            </div>
          </Navbar.Toggle>
        )}
        {!true && <div className="!w-[2.3vw] "></div>}
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          className="!w-[34.89vw]"
        >
          <Offcanvas.Header>
            <img
              src="assets/icons/close.svg"
              onClick={() => setExpanded(expanded ? false : "expanded")}
              alt="close"
              style={{margin:"5px"}}
            />

            <div style={{width: "100%", justifyContent: "flex-end", paddingRight: "15px"}} className="inline-flex">
              <span className="!pl-[2.083vw] font-2rem public-sans-medium" style={{paddingTop:'5px'}}>
                {userInfo ? userInfo.name : "Name"}
              </span>
            </div>
            <div className="!w-[2.51vw] !h-[2.51vw] inline-flex">
              <svg viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="28" fill="rgb(36,179,75)" />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  fill="White"
                  fontSize="24px"
                  fontFamily="Arial"
                  dy=".4em"
                >
                  {shortName}
                </text>
              </svg>
            </div>

            {/* <img src="images/icon-cog.svg" type="image/svg+xml" style={{float: "right"}}
            onClick={handleSettingsBtn} /> */}
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="h-[5.95vh] flex" style={{paddingBottom:'10px'}}>
              <div className="settingsItem-grid self-center">

                {/*<span></span>
            <span className="!pl-[2.083vw] text-[2.08vh]">{userInfo?userInfo.email:"Email@email.com"}</span> */}
              </div>
            </div>
            <Divider style={{ width: "100%" }} />
            <div className="h-[16.26vh] flex pt-[1.73vh]">
              <div className="settingsItem-grid self-start text-blackish">
                <span></span>
                <div className="w-[23.95vw]  h-[4.34vh] capsulebutton">
                  <Button
                    onClick={handleBeginnerChild}
                    className={`text-black public-sans-medium h-[4.34vh] ${isAdvSampleScreen
                        ? `!bg-transparent`
                        : `!bg-[rgb(211,240,219)]`
                      }`}
                  >
                    Guided
                  </Button>
                  <Button
                    onClick={handleAdvScreenChild}
                    className={`text-black public-sans-medium h-[4.34vh]  ${isAdvSampleScreen
                        ? `!bg-[rgb(211,240,219)]`
                        : `!bg-transparent`
                      }`}
                  >
                    Advanced
                  </Button>
                </div>
                <span></span>
                <div className="!w-[24.01vw] !text-[2.086vh] !pt-[2.08vh] public-sans-medium">
                  {" "}
                  Changes can be made if there are no tests in progress.
                </div>
              </div>
            </div>
            <Divider style={{ width: "100%" }} />
            {/* <div className="h-[16.26vh] flex">
              <div
                className="settingsItem-grid"
                onClick={handleSwitchUserChild}
              >
                <img
                  className="!pt-[3.4vh]  !w-[1.85vw]"
                  src="assets/icons/SwitchUser.svg"
                  alt="switch"
                />
                <span
                  onClick={handleSwitchUserChild}
                  className="font-2rem self-center !pt-[1.65vh] text-blackish public-sans-medium"
                >
                  Switch User
                </span>
                <span></span>
                <span className="!text-[2.086vh] !pt-[2.08vh] !pb-[2.08vh] leading-none text-blackish public-sans-medium">
                  Switch users without ending tests in progress.
                </span>
              </div>
            </div> */}
            <Divider style={{ width: "100%" }} />
            <div className="h-[6.78vh] flex ">
              <div onClick={handelLogoutChild} className="settingsItem-grid">
                <img
                  className="!py-[1.65vh]  !w-[1.85vw]"
                  src="assets/icons/Logout.svg"
                  alt="logout"
                />
                <span className="font-2rem self-center !py-[1.65vh]  text-blackish public-sans-medium" style={{marginTop:'-6px'}}>
                  Log out
                </span>
              </div>
            </div>
            <Divider style={{ width: "100%" }} />
            <div className="h-[6.78vh] flex ">
              <div
                className="settingsItem-grid aligncenter"
                onClick={handleDashBoardChild}
                style={{marginTop:'-6px'}}
              >
                <img
                  className="!w-[1.85vw]"
                  src="assets/icons/icon-dashboard.png"
                  alt="dashboard"
                />
                <span className="font-2rem self-center !py-[1.65vh] text-blackish public-sans-medium">
                  Dashboard
                </span>
              </div>
            </div>

            <Divider style={{ width: "100%" }} />
            <div
              className="settingsItem-grid flex h-[6.78vh] aligncenter"
              onClick={handleSettingsBtn}
              style={{marginTop:'-6px'}}
            >
              <img
                className="!w-[1.85vw]"
                src="assets/icons/iconCog.svg"
                alt="dashboard"
              />
              <span className="font-2rem self-center !py-[1.65vh] text-blackish public-sans-medium">
                Settings
              </span>
            </div>

            <Divider style={{ width: "100%" }} />
            <div className="settingsItem-grid h-[6.78vh] aligncenter" style={{marginTop:'-6px'}}>
              <img
                className="!w-[1.85vw]"
                src="assets/icons/help.svg"
                alt="help"
              />
              <span className="font-2rem self-center !py-[1.65vh] text-blackish public-sans-medium">
                Help
              </span>
            </div>

            <Divider style={{ width: "100%" }} />
            <div className="settingsItem-grid  h-[6.78vh] aligncenter">
              <span></span>
              <a href="https://protondx.com/resources/dashboard/terms-and-conditions">
                <span className="font-2rem self-center !py-[1.65vh] text-blackish public-sans-medium">
                  Terms & Conditions
                </span>
              </a>
            </div>

            <Divider style={{ width: "100%" }} />
            <div className="h-[6.78vh] aligncenter flex ">
              <div className="settingsItem-grid">
                <div
                  style={{
                    top: "845px",
                    left: "1293px",
                    width: "35px",
                    height: "31px",
                    background:
                      "var(--unnamed-color-d94444) 0% 0% no-repeat padding-box",
                    background: "#D94444 0% 0% no-repeat paddingBox",
                  }}
                ></div>
                <span className="font-2rem self-center text-blackish public-sans-medium">
                  About
                </span>
              </div>
            </div>
            {/* {userInfo && userInfo.permission_group==="ORG_ADMIN" && <> */}
            {/* </>} */}
            {/* {isDashboard &&
             <Button  className="settingsItem-grid " onClick={()=>setIsOrgLogin(!isOrgLogin)}>
             <span></span>
             <span className="font-2rem self-center !py-[1.65vh]">{isOrgLogin?"its org admin login":"its proton admin login"}</span>
             </Button>} */}
            <div
              className="flex self-center  text-blackish public-sans-medium"
              style={{ paddingLeft: "5.6vw", fontSize: "1.3rem" }}
            >
              {`Version ${metadata.buildMajor}.${metadata.buildMinor}.${metadata.buildRevision} ${metadata.buildTag}`}

              {/* <span
                className="flex self-center"
                style={{
                  paddingLeft: "5.6vw",
                  fontSize: "0.8rem",
                  color: "#24B34B",
                }}
                onClick={() => {
                  if (!isToggleAllowed) {
                    //checkForUpdateApi();
                    setOpenUpdateModal(true);
                  } else {
                    setOpenTestModal(true);
                  }
                }}
              >
                Check For Update
              </span> */}

              {/* if update available required */}
              {/* <span
                  className="flex self-center"
                  style={{
                    paddingLeft: "5.6vw",
                    fontSize: "1.2rem",
                    color: "#D94444",
                  }}
                >{`Update available`}</span> */}
              <TestInProgressModal
                openModal={openTestModal}
                handleClose={() => setOpenTestModal(false)}
                isUpdate={true}
              />
              <CheckForUpdateModal
                openModal={openUpdateModal}
                handleClose={() => setOpenUpdateModal(false)}
                handleUpdate={handleUpdate}
                isUpdateAvailable={isUpdateAvailable}
              />
            </div>
            <div>
              <img
                style={{ paddingLeft: "5.6vw", width: "10vw" }}
                className="inline-flex"
                src="assets/icons/IconCE.svg"
                alt="celogo"
              />
              <img
                style={{ width: "5vw" }}
                className="inline-flex"
                src="assets/icons/IconIVD.svg"
                alt="ivdlogo"
              />
            </div>
            {/* isLogin : {isLogin?'True':'False'}
            Login data*/}

            <TestInProgressModal
              openModal={openTestModal}
              handleClose={() => setOpenTestModal(false)}
              isUpdate={false}
            />
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default memo(TopBar);
