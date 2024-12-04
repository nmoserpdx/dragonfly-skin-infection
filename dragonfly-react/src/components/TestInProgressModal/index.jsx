import { Button, Modal } from "semantic-ui-react";

const TestInProgressModal = ({ openModal, handleClose, isUpdate, isTestActive=true}) => {
    return (
      <>
        <Modal
          open={openModal}
          className="!relative !w-[30vw] !h-[45.05vh] cancelModalBeg"
        >
          <div className="font-bold text-[2.5vh] max-w-2xl">
            Tests are in progress.
            <div style={{ height: "1.5vh" }} />
            {isTestActive? (isUpdate
              ? "You can only check for updates when no tests are in progress."
              : "You can only switch between Guided and Advanced when no tests are in progress.")
              : "You can only toggle when no tests are in progress"}
          </div>

          <Modal.Actions className="!border-[0px]">
            <Button
              className="confirmBtn modalBtnRight !w-[11.97vw] !h-[5.04vh] "
              onClick={handleClose}
            >
              OK
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
}

export default TestInProgressModal
