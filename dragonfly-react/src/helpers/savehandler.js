const AllStatetoJson = () => {
    var LoginData = {
        isLogin: isLogin
    }
    var LoginInfo = userInfo
    var AdvData = {
        useAdvHeaterStoreData: {
            AdvHeater: AdvHeater,
            HeaterId: HeaterId,
            allHeaters: allHeaters,
        },
        useAdvSampleStoreData: {
            advSamples: advSamples,
            advSampleCompletedStep: advSampleCompletedStep,
            advSamplesPos: advSamplesPos,
            samplesNo: samplesNo,
            samplesReadyForCapture: samplesReadyForCapture
        },
        useAdvSampleTimerStoreData: {
            AdvSampleTimerPos: AdvSampleTimerPos,
        },
        useAdvTestDataStoreData: {
            advSamplePrepKit: advSamplePrepKit,
            advTestPanelID: advTestPanelID,
            advSampleID: advSampleID,
            advLotNo: advLotNo,
            advSerialNo: advSerialNo
        },
        useAdvTimerStoreData: {
            timerForSamplePos: timerForSamplePos,
            incubationTimer: incubationTimer,
            activeTimer: activeTimer
        }
    }

    var BegData = {
        useSampleStoreData: {
            samples: samples,
            timerMapper: timerMapper,
            voidSamples: voidSamples,
            timeExceededSamples: timeExceededSamples,
            samplePos: samplePos,
            allowExpiry: allowExpiry
        },
        useHeaterStoreData: {
            heater: heater,
            begSamples: begSamples
        }
    }

    var Mode = {
        mode: false
    }

    if (isAdvSampleScreen) {
        Mode.mode = true
    } else {
        Mode.mode = false
    }

    var Data = {
        LoginData,
        LoginInfo,
        AdvData,
        BegData,
        Mode
    }
    setDatset(Data)
    //  console.log(JSON.stringify(Data))
    //  AllJsonToState(JSON.stringify(Data))
    return Data
}
