import create from 'zustand';
import { persist } from "zustand/middleware"

const initialState = {
    currentAdvSamplePrepKit:"",
    currentAdvTestPanelID:"",
    currentAdvSampleID:"",
    currentAdvSerialNo:"",
    currentAdvLotNo:"",
    currentPrepKitExpDate:"",
    currentTestPanelExpDate:""
}

export const useCurrentAdvTestDataStore = create(persist(
    set => ({
        ...initialState,

        setCurrentAdvSamplePrepKit: (value) =>set({currentAdvSamplePrepKit:value}),
        setCurrentAdvSerialNo:(value) =>set({currentAdvSerialNo:value}),
        setCurrentAdvLotNo:(value)=>set({currentAdvLotNo:value}),
        setCurrentAdvTestPanelID: (value) =>set({currentAdvTestPanelID:value}),
        setCurrentAdvSampleID: (value) =>set({currentAdvSampleID:value}),
        setCurrentAdvCompositePrepKit: (v1, v2, v3) => set({
            currentAdvSamplePrepKit:v1,
            currentAdvLotNo: v2,
            currentPrepKitExpDate: v3
        }),
        setCurrentAdvCompositeTestPanelID: (v1, v2, v3) => set({
            currentAdvTestPanelID:v1,
            currentAdvSerialNo: v2,
            currentTestPanelExpDate: v3
        }),
        resetCurrentAdvTestDataState: () => set({
          ...initialState
        }),
    }),

    {
      name: "currentAdvTestData"
    }
  ))

  // samples: prev.samples.filter(sample => sample !== no),
