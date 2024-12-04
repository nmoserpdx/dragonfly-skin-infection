import React, { memo, useContext, useEffect, useState } from 'react'
import { Button } from 'semantic-ui-react'
import { useAdvSampleStore } from '../../storeAdv/advSample'
import IFUscreen from '../IFUscreen'
import AdvanceScan from '../AdvanceScan'
import { useAdvSampleTimerStore } from '../../storeAdv/advSampleTimer'
import { useAdvHeaterStore } from '../../storeAdv/advHeater'
import AdvHeaterSelection from '../../components/AdvHeaterSelection'
import { useAdvTimerStore } from '../../storeAdv/advTimers'
import { useAdvUiStore } from '../../storeAdv/advUi'
import StepsBarSection from './StepsBarSection'
import { useAdvTestDataStore } from '../../storeAdv/advTestData'
import { Modal } from 'semantic-ui-react'
import shortid from 'shortid'
import axios from 'axios'
import { TIMER_FOR_STEPS, Dummy_Token } from "../../constants";
import { useSelector } from 'react-redux'
import { useCurrentAdvTestDataStore } from '../../storeAdv/advCurrentSample'
import UnloadHeaterOverlayAdvScreen from '../../components/UnloadHeaterOverlayAdvScreen'
import { IncubationContext } from '../../context/incubationTimer'
import { checkForExpiryHelper, checkForExpiryYYMMDDHelper } from "../../helpers";

const AdvanceScreen = () => {
	const {
		advSamplePrepKit,
		removeAdvTestData,
		advTestPanelID,
		advSerialNo,
		advLotNo,
		advPrepKitExpDate,
		advTestPanelExpDate
	} = useAdvTestDataStore()
	const {
		activeTimer,
		timerForSamplePos,
		setTimerForSamplePos,
		removeTimerForSamplePos,
		pauseTimer,
		resumeTimer,
		setIncubationTimer,
		incubationTimer,
	} = useAdvTimerStore()

	const [height,setHeight]=useState(false)
	const [scr,setScr]=useState()

	const {
		removeSample,

		advSamplesPos,
		advSamples,
		removeHeaterPosOfSample,
		setAdvSamples,
		setScanningForPos,
		setAdvSampleCompletedStep,
	} = useAdvSampleStore()
	const { removeTimerofSampleNo } = useAdvSampleTimerStore()
	const { loadedHeaterId, loadedRow, setAdvHeater, setLoad } =
		useAdvHeaterStore()
	const { setAdvSampleTimerPos, AdvSampleTimerPos } =
		useAdvSampleTimerStore()
	const {
		currentAdvSampleNo,
		samplesNo,
		setSamplesNo,
		startCompletion,
		advSampleCompletedStep,
	} = useAdvSampleStore()

	const {
		setIsAdvQRcode,
		setIsDirectResultCapture,
		isAdvScanning,
		setIsAdvScanning,
		isIFUscreen,
		isCancelMsgModal,
		setIsCancelMsgModal,
		isDirectResultCapture,
		cancelMsgFor,
		setIsDetected,
		isUnload,
		unloadFor,
		setIsUnloadScreen,
	} = useAdvUiStore()
	const {
		setCurrentAdvSampleID,
		resetCurrentAdvTestDataState
	} = useCurrentAdvTestDataStore()
	const { userInfo } = useSelector(state => state.logIn)
	const { setHasTimeElapsed } = useContext(IncubationContext)

	//old code below
	/*
	const handleMissingNumber = a => {
		var g = a.map(i => Number(i))
		g.sort(function (a, b) {
			return a - b
		})

		for (let i = 0; i <= g.length; i++) {
			if (!(g[i] === i + 1)) {
				return i + 1
			}
		}
	}
	*/

	const handleAdd = () => {
		let nextnumber = shortid.generate();

		//Commenting below
		//Need to uncomment
		//ANAND - BT code
		if(window.NativeDevice){
			window.NativeDevice.checkForBTDevice();
		}

		// if(!AdvSampleTimerPos[nextnumber]){ setAdvSampleTimerPos(nextnumber)}

		// setSamplesNo( [...samplesNo, nextnumber])
		// if(!advSampleCompletedStep[nextnumber]){startCompletion(nextnumber)}
		//Clear current details here first
		resetCurrentAdvTestDataState()
		handleScan(nextnumber)
		createSample()
		// setCurrentAdvSampleID(nextnumber)
	}
	const openScanScreen = (e, sampleNo) => {
		e.preventDefault()
		setLoad(null, null)
		setAdvSampleTimerPos(sampleNo);
		setScanningForPos(sampleNo)
		if (!advSampleCompletedStep[sampleNo].includes('scan')) {
			setAdvSampleCompletedStep(sampleNo, 'scan')
		}
		setIsAdvScanning(true)

		if (!advSamples[sampleNo]) {
			createSample()
		}
		setIsCancelMsgModal(false, '')
	}
	const handleScan = value => {
		setLoad(null, null)
		setScanningForPos(value)

		// setAdvSampleCompletedStep(value,"scan")
		setIsAdvScanning(true)

		createSample(value)
	}
	const createSample = value => {
		const epoch = Math.floor(new Date().getTime() / 100)
		setCurrentAdvSampleID(epoch.toString())
		// console.log( setAdvSamples, setAdvSampleID)
		// setAdvSamples(value,epoch.toString())
		// setAdvSampleID(value,epoch.toString())
	}
	const { setIsHeaterModal, isHeaterModal } = useAdvHeaterStore()
	const removeThisSample = sampleNo => {
		let c = String(advSamplesPos[sampleNo])
		if(c !== 'undefined'){
			let id = c.slice(0, 1)
			let row = c.slice(1)
			setAdvHeater(id, row, '')
		}
		setHasTimeElapsed(false)
		removeSample(sampleNo)
		if (timerForSamplePos[sampleNo]) {
			removeTimerForSamplePos(sampleNo)
		}
		removeTimerofSampleNo(sampleNo)
		removeAdvTestData(sampleNo)
		setIsCancelMsgModal(false, '')
		//Reset Current parameters here
		resetCurrentAdvTestDataState()
	}
	const transferCurrentStateToMainState = (uid, id) => {
		setAdvSamples(uid, id)

		if (!AdvSampleTimerPos[id]) {
			setAdvSampleTimerPos(uid)
		}

		setSamplesNo([...samplesNo, uid])
		if (!advSampleCompletedStep[uid]) {
			startCompletion(uid)
		}
		setAdvSampleCompletedStep(uid, 'scan')
	}
	const removeThisHeater = sampleNo => {
		let c = String(advSamplesPos[sampleNo])
		let id = c.slice(0, 1)
		let row = c.slice(1)

		console.log(sampleNo, c, id, row)
		setAdvHeater(id, row, '')
		removeHeaterPosOfSample(sampleNo)
	}
	const handleClose = () => {
		if (isDirectResultCapture) {
			setIsAdvQRcode(true)
			setIsAdvScanning(true)
			setIsDirectResultCapture(false)
		} else {
			setIsAdvQRcode(false)
			setIsAdvScanning(false)
			setIsDetected(false)
		}
	}
	const handleCloseHeaterModal = () => {
		setIsHeaterModal(!isHeaterModal)
	}

	const handleConfirmHeater = () => {
		setAdvHeater(loadedHeaterId, loadedRow, currentAdvSampleNo)
		setIsHeaterModal(!isHeaterModal)
		if (timerForSamplePos[currentAdvSampleNo]) {
			handleResumeTimer()
		} else {
			setTimerForSamplePos(
				currentAdvSampleNo,
				'timerInsertedAt',
				activeTimer
			)
			setIncubationTimer(currentAdvSampleNo, 0)
		}
	}

	//old code below
	/*
	const handleDirectResultScan = () => {
		setIsDirectResultCapture(true)
		setIsAdvScanning(true)
	}
	*/
	const handleUnloadConfirm = () => {
		pauseTimer(unloadFor, activeTimer)

		removeThisHeater(unloadFor)
		setIsUnloadScreen(false, '')
	}
	const scrollToSample = (scr) =>{
		setHeight(true)
		setScr(scr)
// 		var myElement = document.getElementById(scr);
// var topPos = myElement.offsetBottom;
// document.getElementById('samplesContainer').scrollTop = topPos;
	}
	useEffect(()=>{
		if(scr){
		var objDiv = document.getElementById(scr);
		objDiv.scrollIntoView()}
	},[height])

	const handleUnloadBack = () => {
		handleResumeTimer()
		resumeTimer(
			unloadFor,
			activeTimer +
				(timerForSamplePos[unloadFor].heaterTimerEndsAt -
					timerForSamplePos[unloadFor].pausedAt)
		)

		setIsUnloadScreen(false, '')
	}

	const submitErrorToApi = (scanningForPos) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				'X-AuthorityToken': 'auth-wpf-desktop',
				'X-AccessToken': userInfo
					? userInfo.auth0_user_id
					: Dummy_Token,
			},
    }
    // OLD Code
		// const stepsTimerData = {
		// 	lysistime: AdvSampleTimerPos[scanningForPos]
		// 		? TIMER_FOR_STEPS -
		// 		  AdvSampleTimerPos[scanningForPos].LYSIS_1.timer
		// 		: 0, //default 0
		// 	washtime: AdvSampleTimerPos[scanningForPos]
		// 		? TIMER_FOR_STEPS -
		// 		  AdvSampleTimerPos[scanningForPos].WASH_1.timer
		// 		: 0, //default 0
		// 	drytime: AdvSampleTimerPos[scanningForPos]
		// 		? TIMER_FOR_STEPS -
		// 		  AdvSampleTimerPos[scanningForPos].DRY_1.timer
		// 		: 0, //default 0
		// 	elutetime: AdvSampleTimerPos[scanningForPos]
		// 		? TIMER_FOR_STEPS -
		// 		  AdvSampleTimerPos[scanningForPos].Elution_1.timer
		// 		: 0, //default 0
    // }

      const stepsTimerData = {
        lysistime: AdvSampleTimerPos[scanningForPos].LYSIS_1.timestamp,
        washtime: AdvSampleTimerPos[scanningForPos].WASH_1.timestamp,
        drytime: AdvSampleTimerPos[scanningForPos].DRY_1.timestamp,
        elutetime: AdvSampleTimerPos[scanningForPos].Elution_1.timestamp,
      };
		const timerData = {
			totalelapsedtime: 'null',
			heatingtime: typeof(incubationTimer[scanningForPos]) === 'undefined'?0:incubationTimer[scanningForPos],
		}
		const loactionData = {
			long: '',
			lat: '',
		}
		let prepkitexpired = false;
		if(advPrepKitExpDate[scanningForPos]){
			prepkitexpired = checkForExpiryYYMMDDHelper(advPrepKitExpDate[scanningForPos]);
		}

		let testpanelexpired = false;
		if(advPrepKitExpDate[scanningForPos]){
			testpanelexpired = checkForExpiryHelper(advTestPanelExpDate[scanningForPos]);
		}

		const data = {
			id: userInfo ? userInfo.id : '',
			mac_address:userInfo ? userInfo.mac_address:'',
			org_id: userInfo ? userInfo.org_id : '',
			user_id: userInfo ? userInfo.id : '',
			heaterchosen: advSamplesPos[scanningForPos]
				? String(advSamplesPos[scanningForPos])
						.slice(0, 1)
						.toUpperCase()
				: '',
			testerId:
				typeof advTestPanelID[scanningForPos] !== 'undefined'
					? advTestPanelID[scanningForPos]
					: shortid.generate(),
			serialNo: advSerialNo[scanningForPos]!== 'undefined'
				? advSerialNo[scanningForPos] : "",
			sampleID: advSamples[scanningForPos],
			prepKitID: advSamplePrepKit[scanningForPos] !== 'undefined'
			? advSamplePrepKit[scanningForPos] : "",
			lotNo:advLotNo[scanningForPos] !== 'undefined'
			? advLotNo[scanningForPos] : "",
			result:'0,0,0,0,0,0,0,0',
			invalid: true,
			image: "",
			loaction: loactionData,
			uploadtime: "",
			mode: "advanced",
			flag: false, //error has happened
			heatingexpired: false,
			prepkitexpired: prepkitexpired,
			testpanelexpired: testpanelexpired,
			...stepsTimerData,
			...timerData,
		}
		// https://reqres.in/api/users
		// https://api.anuparamanu.xyz/api/v1/results
		axios
			.post(process.env.REACT_APP_SERVER_BASE_URL + '/addresult', data, config)
			.then(response => console.log(response))
			.catch(function (error) {
				if (error.toJSON().message === 'Network Error') {
					console.log('Network error happend')
				}
				console.log(JSON.stringify({ data, config }))

				if (window.NativeDevice) {
					window.NativeDevice.insertDataToDb(
						JSON.stringify({ data, config })
					)
				}
			})
	}

	//old code below
	/*
	const handlePauseTimer = () => {
		pauseTimer(unloadFor, activeTimer)
		setIsUnloadScreen(true, unloadFor)
		// console.log(timerForSamplePos[sampleNo])
	}
	*/

	const handleResumeTimer = () => {
		resumeTimer(
			currentAdvSampleNo,
			activeTimer +
				(timerForSamplePos[currentAdvSampleNo].heaterTimerEndsAt -
					timerForSamplePos[currentAdvSampleNo].pausedAt)
		)
	}
	const cancelTest = (id) => {
		submitErrorToApi(id)
		removeThisSample(id)
	}
	return (
		<>{/*console.log(typeof timerForSamplePos[cancelMsgFor])*/}
			{!isIFUscreen ? (
				!isAdvScanning ? (
					<>
						{isHeaterModal && (
							<AdvHeaterSelection
								handleCloseHeaterModal={handleCloseHeaterModal}
								loadedRow={loadedRow}
								handleConfirmHeater={handleConfirmHeater}
							/>
						)}
		<Modal
      onClose={() => setIsCancelMsgModal(false)}
      onOpen={() => setIsCancelMsgModal(true)}
      open={isCancelMsgModal&&typeof timerForSamplePos[cancelMsgFor]!=="undefined"}

      className="!relative !w-[39.5vw] !h-[45.05vh] cancelModal"
    >

    <div className="text-[2.78vh] min-w-[27.23vw]" style={{lineHeight: "1.3em"}}>
     The test is in progress. Are you sure you want to cancel this test?</div>

		 <Modal.Actions className="!border-[0px]">
        <Button className="confirmBtn m-0 modalBtnLeft !w-[11.97vw] !h-[5.04vh]" onClick={() => setIsCancelMsgModal(false)}>
          Back
        </Button>
        <Button
          className="backbtn confirmBtn modalBtnRight !w-[11.97vw] !h-[5.04vh] "
          onClick={() => removeThisSample(cancelMsgFor)}
        >Cancel Test</Button>
      </Modal.Actions>
     </Modal>
			<Modal
				// open={true}
				onClose={() => setIsCancelMsgModal(false)}
				onOpen={() => setIsCancelMsgModal(true)}
				open={isCancelMsgModal &&typeof timerForSamplePos[cancelMsgFor]==="undefined"}
				className='!relative !w-[67.7vw] !h-[64.86vh] errorModal px-[4.16vw] py-[4.69vh] !grid'
			>
				<div className='flex text-[2.78vh] py-[4.69vh] gap-[5.05vw]'>
					<div className='min-w-[27.23vw]' style={{lineHeight: "1.2em"}}>
						<div className='fontpublic pb-[2vh]'>
							ERROR
						</div>
						If you made an error during sample
						preparation, you can scan in a new Sample
						Preparation Kit.
						<div className='h-[2.78vh]' />
						Press New Prep Kit to scan the new Sample
						Preparation Kit and restart the procedure.
					</div>
					<div className='min-w-[27.23vw]' style={{lineHeight: "1.2em"}}>
						<div className='fontpublic pb-[2vh]'>
							CANCEL TEST
						</div>{' '}
						The test is in progress.
						<div className='h-[2.78vh]' />
						Are you sure you want to cancel this test?
						If yes, press End Test.
					</div>
				</div>

				<div className='flex absolute bottom-[5.21vh] left-[0px] px-[4.16vw] justify-between !w-full self-end'>
					<Button
						className='confirmBtn m-0  !w-[11.97vw] !h-[5.04vh]'
						onClick={() =>
							setIsCancelMsgModal(false)
						}
					>
						Back
					</Button>
					<Button
						className=' backbtn confirmBtn  !w-[11.97vw] !h-[5.04vh] '
						   onClick={(e) => openScanScreen(e, cancelMsgFor)}
					>
						New Prep Kit
					</Button>
					<Button
						className=' backbtn confirmBtn !w-[11.97vw] !h-[5.04vh] '
						onClick={() =>
							cancelTest(cancelMsgFor)
						}
					>
						Cancel Test
					</Button>
				</div>
			</Modal>

						{isUnload && (
							<UnloadHeaterOverlayAdvScreen
								unloadFor={unloadFor}
								handleUnloadBack={handleUnloadBack}
								handleUnloadConfirm={handleUnloadConfirm}
							/>
						)}

						<div className='stepsSection  !min-h-[100%]' id="samplesContainer">
							{samplesNo.map((sampleNo,index) => (
								<React.Fragment key={index}>
									<StepsBarSection
										sampleNo={sampleNo}
										removeThisHeater={removeThisHeater}
										handleConfirmHeater={
											handleConfirmHeater
										}
										setHeight={setHeight}
										scrollToDiv={scrollToSample}
										removeThisSample={removeThisSample}
									/>{' '}
								</React.Fragment>
							))}


							<button onClick={handleAdd} className='AddButton'>
								<>
									<img
										className='!h-[2.60vh] pr-[0.833vw]'
										src='assets/icons/plus.svg'
										alt="plus"
									/>{' '}
									New Test
								</>
							</button>
							<div className={`${height?`h-[50vh]`:`h-[0vh]`}`} id="iii">
								<div id="iii">

								</div>
							</div>

						</div>
					</>
				) : (
					<AdvanceScan
							transferCurrentStateToMainState={
								transferCurrentStateToMainState
							}
							handleClose={handleClose}
							samplesNo={samplesNo}
					/>
				)
			) : (
				<IFUscreen />
			)}
		</>
	)
}

export default memo(AdvanceScreen)
