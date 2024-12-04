import { Modal, Button } from "semantic-ui-react";
export default function ConfirmDetection({
  setIsCancelModal,
  setConfirm,
  tagRef,
  tagSerial
}) {
  return (
    <>
      <Modal
        open={true}
        className="!relative !w-[39.5vw] !h-[56vh] cancelModalBeg "
      >
          <>
            <div className="font-extrabold text-[2.78vh]  mb-[4.86vh]">
              Test Panel Tag not scanned.
            </div>
            <div className="font-extrabold text-[2.78vh]  mb-[4.86vh]">
              Please confirm Tag REF/SN matches:
            </div>
            <div className="font-extrabold text-[2.78vh]  mb-[4.86vh]">
                REF:{tagRef}
            </div>
            <div className="font-extrabold text-[2.78vh]  mb-[4.86vh]">
              SN:{tagSerial}
            </div>
          </>

        <Modal.Actions className="!border-[0px] ">
          <Button
            className="confirmBtn m-0 modalBtnLeft !w-[11.97vw] !h-[5.04vh]"
            onClick={() => setIsCancelModal(false)}
          >
            Back
          </Button>

          <Button
            className=" backbtn confirmBtn modalBtnRight !w-[11.97vw] !h-[5.04vh] "
            onClick={setConfirm}
          >
            Confirm
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}
