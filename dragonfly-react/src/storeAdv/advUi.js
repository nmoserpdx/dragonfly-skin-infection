import create from 'zustand';
import { persist } from "zustand/middleware"

const initialState = {

  isAdvSampleScreen:false,
  isIFUscreen:false,
  iFUscreenFor:"",
  isAdvScanning:false,
  hasAdvSamplePreparationStarted: false,
  isAdvQRcode:false,
  isDirectResultCapture:false,
  isCancelMsgModal:false,
  cancelMsgFor:"",
  isDetected:false,
  commentMsg:"",
  finalDataToApi:"",
  isUnload:"",
  unloadFor:"",
  isCommentFlagged:false,
  isPopUp:"",
  isManualOverride:false
}

export const useAdvUiStore = create(persist(
    set => ({
        ...initialState,
        setIsPopUp:(value)=> set({isPopUp:value}),
        setIsCommentFlagged: (value) => set({isCommentFlagged:value}),
        setIsDetected: (value) => set({ isDetected: value }),
        setFinalDataToApi: (value) => set({ finalDataToApi: value }),
        setCommentMsg: (value) => set({ commentMsg: value }),
        setIsUnloadScreen:(value,no) => set({isUnload:value,unloadFor:no}),
        setIsAdvSampleScreen: (value) => set({ isAdvSampleScreen: value }),
        setIsIFUscreen:(value) => set({ isIFUscreen: value }),
        setIFUscreenFor:(value) => set({ iFUscreenFor: value }),
        setIsAdvScanning:(value) => set ( {isAdvScanning:value}),
        setIsCancelMsgModal:(value,no) => set ( {isCancelMsgModal:value,
          cancelMsgFor:no
        }),
        setIsManualOverride:(value) => set ( {isManualOverride:value}),
        setHasAdvSamplePreparationStarted:(value) => set({hasAdvSamplePreparationStarted:value}),
            setIsAdvQRcode: (value) => set({isAdvQRcode:value}),
            setIsDirectResultCapture: (value) => set({isDirectResultCapture:value}),
            resetAdvUi : () => set({

              ...initialState
            })
    }),
    {
      name: "advUiStore"
    }
  ))
