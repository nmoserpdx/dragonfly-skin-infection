import React from 'react'
import { Button, Modal } from "semantic-ui-react";

function CheckForUpdateModal({ openModal, handleClose,handleUpdate, isUpdateAvailable }) {
  return (
    <>
      <Modal
        open={openModal}
        className="!relative !w-[39.5vw] !h-[45.05vh] cancelModalBeg"
      >
        <div className="font-bold text-[2.5vh] max-w-2xl text-center pt-5">
          {/* <div style={{ height: "1.5vh" }} /> */}
          {isUpdateAvailable ? (
            <div>
              <div>A new version is available.</div>
              <div style={{ height: "1vh" }} />

              <div> Press Update to install the newest version. </div>
              <div style={{ height: "10vh" }} />

              <div>
                {" "}
                IMPORTANT: You can only update when no tests are running.
              </div>
            </div>
          ) : (
            <div>Your software is up to date</div>
          )}
        </div>

        <Modal.Actions className="!border-[0px] d-flex">
          {isUpdateAvailable ? (
            <Button
              className=" confirmBtn modalBtnRight !w-[11.97vw] !h-[5.04vh] "
              onClick={handleUpdate}
            >
              Update
            </Button>
          ) : (
            ""
          )}
          <Button
            className="backbtn confirmBtn modalBtnLeft !w-[11.97vw] !h-[5.04vh]"
            onClick={handleClose}
          >
            Dismiss
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default CheckForUpdateModal
