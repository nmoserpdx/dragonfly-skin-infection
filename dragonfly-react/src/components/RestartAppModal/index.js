import React from 'react'
import { Button, Modal } from "semantic-ui-react";

function RestartAppModal({ openModal, handleClose, handleRestart }) {
  return (
    <>
      <Modal
        open={openModal}
        className="!relative !w-[39.5vw] !h-[45.05vh] cancelModalBeg"
      >
        <div className="font-bold text-[2.5vh] max-w-2xl text-left pt-5" style={{lineHeight: "1.4em"}}>
            <div>
              <div>Select Restart to exit DEMO mode, or Cancel to remain in DEMO mode.</div>
              <div style={{ height: "1vh" }} />
            </div>
        </div>

        <Modal.Actions className="!border-[0px] d-flex">
          <Button
            className="backbtn confirmBtn modalBtnRight !w-[11.97vw] !h-[5.04vh] "
            onClick={handleRestart}
          >
            Restart
          </Button>
          <Button
            className="confirmBtn modalBtnLeft !w-[11.97vw] !h-[5.04vh]"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default RestartAppModal
