
import { Modal, Button } from "semantic-ui-react";
import { useUIStore } from "../../store/ui.js";
export default function ErrorPopUp({ handleNewPrepKit, handleEndTest }) {


  const { setErrorPopUp } = useUIStore()


  return (<>
    <Modal
      open={true}
      className="!relative !w-[67.7vw] !h-[64.86vh] errorModal px-[4.16vw] py-[4.69vh] !grid"
    >
      <div className="flex text-[2.78vh] py-[4.69vh] gap-[5.05vw]">
        <div className="min-w-[27.23vw]">
          <div className="fontpublic pb-[2vh]">ERROR</div>
          If you made an error during sample preparation, you can scan in a new Sample Preparation Kit.
          <div className="h-[2.78vh]" />
          Press New Prep Kit to scan the new Sample Preparation Kit and restart the procedure.
        </div>
        <div className="min-w-[27.23vw]">
          <div className="fontpublic pb-[2vh]">CANCEL TEST</div>  The test is in progress.
          <div className="h-[2.78vh]" />
          Are you sure you want to cancel this test? If yes, press End Test.
        </div>
      </div>

      <div className="flex absolute bottom-[5.21vh] left-[0px] px-[4.16vw] justify-between !w-full self-end">
        <Button className="confirmBtn m-0  !w-[11.97vw] !h-[5.04vh]" onClick={() => setErrorPopUp(false)}>
          Back

        </Button>
        <Button
          className=" backbtn confirmBtn  !w-[11.97vw] !h-[5.04vh] "
          onClick={handleNewPrepKit}



        >New Prep Kit</Button>
        <Button
          className=" backbtn confirmBtn !w-[11.97vw] !h-[5.04vh] "


          onClick={handleEndTest}
        >End Test</Button>

      </div>

    </Modal>

  </>
  );
}


