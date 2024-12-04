import { useSampleStore } from '../../store/samples.js'
import React, { useEffect } from 'react'
import { INCUBATION_TIME_ALERT_LIMIT, ADV_TIMER_FOR_SCAN, ADV_TIMER_FOR_VOID, EXTRA_TIME } from '../../constants/index.js'
import { Modal, Button } from 'semantic-ui-react'

import Progressbar from './Progressbar.js'
import { useHeaterStore } from '../../store/heaterStore.js'
import { useState } from 'react'
import { useAdvTestDataStore } from '../../storeAdv/advTestData'
import EndTestModal from './EndTestModal.js'
import { useAdvTimerStore } from '../../storeAdv/advTimers.js'
import { useUIStore } from '../../store/ui.js'
import { useAdvUiStore } from '../../storeAdv/advUi.js'
import UnloadPopUpWithHeaterGuided from '../UnloadPopUpWithHeaterGuided/index.js'
export default function Heater() {
	const { removeVoidSample, samplePos, setScanningId, setScanningIdPos } =
		useSampleStore()

	const {
		openScanner,
		setHasCaptureSampleScreen,
		isCamera,
		hasCaptureSampleScreen,
		errorPopUp
	} = useUIStore()

	const { isDetected, isManualOverride } = useAdvUiStore()
	const { heater, loadNo, removeHeaterID, begSamples } = useHeaterStore()
	const heatersNo = [1, 2, 3, 4]
	const [isCancelModal, setIsCancelModal] = useState(false)
	const [confirmPopUp, setConfirmPopup] = useState(false)
	const [heaterInfoPopUp, setHeaterInfoPopUp] = useState(false)
	const [timeGapBetweenPopUp, setTimeGapBetweenPopUp] = useState(false)

	const { removeAdvTestData } = useAdvTestDataStore()
	const {
		removeTimerForSamplePos,
		incubationTimer,
		begPopUp,
		removeFromBegPopUp
	} = useAdvTimerStore()

	const handleOpenScanner = (value, id) => {
		if (!isCamera && !hasCaptureSampleScreen) {
			openScanner(value)
			setHasCaptureSampleScreen(value)
			setScanningId(id)
			setScanningIdPos(samplePos[id])
			//    setScanningId(id)
		}
	}

	useEffect(() => {
		let timer1 = setTimeout(() => setTimeGapBetweenPopUp(false), 1000)

		return () => {
			clearTimeout(timer1)
		}
	}, [timeGapBetweenPopUp])

	const addExtraTimeToThisSample = (id, val) => {
		var currentid = null
		setTimeGapBetweenPopUp(true)
		for (var key in begSamples) {
			if (begSamples.hasOwnProperty(key)) {
				if(id === begSamples[key]){
					currentid = key
					break
				}
			}
		}
		if(currentid === null){
			currentid = id
		}
		//calculate diff between current time and next pop up time
		if(incubationTimer[currentid] > INCUBATION_TIME_ALERT_LIMIT) {
			removeFromBegPopUp(currentid)
			return
		}

		var extra = EXTRA_TIME
		if(incubationTimer[currentid] < ADV_TIMER_FOR_SCAN + ADV_TIMER_FOR_VOID){ //30 mins
			extra = ADV_TIMER_FOR_SCAN + ADV_TIMER_FOR_VOID - incubationTimer[currentid]
		}else if(incubationTimer[currentid] < ADV_TIMER_FOR_SCAN + ADV_TIMER_FOR_VOID + ADV_TIMER_FOR_VOID){ //35 mins
			extra = ADV_TIMER_FOR_SCAN + ADV_TIMER_FOR_VOID + ADV_TIMER_FOR_VOID - incubationTimer[currentid]
		}

		val
			? removeFromBegPopUp(currentid, incubationTimer[currentid], extra)
			: removeFromBegPopUp(currentid)
	}

	const handleRemoveSample = id => {

		removeHeaterID(samplePos[id])
		removeTimerForSamplePos(id)
		removeAdvTestData(id)
		setConfirmPopup(false)
		setHeaterInfoPopUp(false)
		removeVoidSample(id)
	}

	const handleCancelModal = () => {
		//if (!isScanning) {
			setIsCancelModal(!isCancelModal)
		//}
	}


	return (
		<>
			{isCancelModal && (
				<EndTestModal
					setIsCancelModal={setIsCancelModal}
					removeThisSample={handleRemoveSample}
					setScanningId={handleOpenScanner}
					scanningId={begPopUp[0]}
				/>
			)}
			{(typeof begPopUp[0] === 'undefined' ? false : true) &&
				!isCancelModal &&
				!errorPopUp &&
				!timeGapBetweenPopUp &&
				!isDetected &&
				!hasCaptureSampleScreen &&
				!isManualOverride &&
				!isCamera && (
					<UnloadPopUpWithHeaterGuided
						id={begPopUp[0]}
						pos={samplePos[begPopUp[0]]}
						heaterNo={heater[begPopUp[0]]}
						closeModal={addExtraTimeToThisSample}
						confirmPopUp={setConfirmPopup}
						setScanningId={handleOpenScanner}
					/>
				)}

			<Modal
				open={confirmPopUp}
				className='!relative !w-[39.5vw] !h-[45vh] cancelModalBeg '
			>
				<div className='font-extrabold text-[2.78vh]  mb-[4.86vh]'>
					Confirm test {begPopUp[0]} in row A{samplePos[begPopUp[0]]}{' '}
					was removed from Heat Block.
					<br /> <br />
					Position A{samplePos[begPopUp[0]]} will be available for a
					new test.
				</div>
				<Modal.Actions className='!border-[0px] '>
					<Button
						className='backbtn confirmBtn m-0 modalBtnLeft !w-[11.97vw] !h-[5.04vh]'
						onClick={() => setConfirmPopup(false)}
					>
						Dismiss
					</Button>

					<Button
						className='confirmBtn modalBtnRight !w-[11.97vw] !h-[5.04vh] '
						onClick={() => handleRemoveSample(begPopUp[0])}
					>
						Confirm
					</Button>
				</Modal.Actions>
			</Modal>

			<div
				className='Heater absolute'
				style={{
					padding: '0px',
					margin: '0px',
					maxHeight: '28.91vh',
					bottom: '4.78vh',
				}}
			>
				<div
					id='Heater'
					className='flex justify-between'
					style={{ fontSize: '2.78vh', minWidth: '100%' }}
				>
					<span>Heat Block </span>
					<img
						className='w-[2.083vw]'
						onClick={handleCancelModal}
						src='assets/icons/close.svg'
						alt="closepop"
						style={{padding:"4px"}}
					/>
				</div>

				<ol className='heaterOl' style={{ minWidth: '100%' }}>
					{heatersNo.map(function (key) {
						return (
              <React.Fragment key={key}>
                <li
                  style={{
                    minWidth: "18.75vw",
                    minHeight: "4.34vh",
                  }}
                >
                  <span
                    className="tabular  "
                    style={{
                      display: "grid",
                      alignSelf: "center",
                      justifySelf: "center",
                      marginLeft: "2.39vw",
                    }}
                  >
                    {key}
                  </span>

                  <Progressbar
                    id={heater[key]}
                    no={key}
                    loaded={loadNo === key ? true : false}
                    handleScan={handleOpenScanner}
                    // onhandlescan={handlescan}
                  />
                </li>
              </React.Fragment>
            );
					})}
				</ol>
			</div>
		</>
	)
}
