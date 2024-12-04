import create from 'zustand';
import { persist } from "zustand/middleware"

const initialState = {
    hasSamplePreparationStarted: false,
    startProcessForSamplePreparation: false,
    isScanning: false,
    isHeatersButtonEnable: false,
    hasCaptureSampleScreen:false,
    isQRCode:false,
    isCamera:false,
    isWrongSample:false,
    errorPopUp:false,
    shouldDisplayId:true,
    
}
export const useUIStore = create(persist(
    set => ({
        ...initialState,
        setSamplePreparationStarted: (value) => set({ hasSamplePreparationStarted: value }),
        setStartProcessForSamplePreparation: (value) => set({ startProcessForSamplePreparation: value }),
        openScanner: (value) => set({ isScanning: value }),
        setIsHeatersButtonEnable: (value) => set({isHeatersButtonEnable : value}),
        setHasCaptureSampleScreen: (value) => set({hasCaptureSampleScreen:value}),
        setIsQRcode: (value) => set({isQRCode: value}),
        setCamera:(value)=> set({isCamera:value}),
        setIsWrongSample:(value) => set({isWrongSample:value}),
        setErrorPopUp:(value)=>set({errorPopUp:value}),
        setShouldDisplayId:(value)=>set({shouldDisplayId:value}),
        resetUiState: () => set({
          ...initialState
        })
    }),
    {
      name: "ui"
    }
  ))