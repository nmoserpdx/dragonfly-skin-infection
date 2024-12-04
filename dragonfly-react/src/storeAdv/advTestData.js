import create from 'zustand';
import { persist } from "zustand/middleware"

const initialState = {
    advSamplePrepKit:{},
    advTestPanelID:{},
    advSampleID:{},
    advSerialNo:{},
    advLotNo:{},
    image64:"",
    currentSampleDetectionState: {},
    advPrepKitExpDate:{},
    advTestPanelExpDate:{}
}

export const useAdvTestDataStore = create(persist(
    set => ({
        ...initialState,

        setAdvSamplePrepKit: (sampleNo,value) =>set(prev => ({
          advSamplePrepKit:{
            ...prev.advSamplePrepKit,
            [sampleNo]:value
          }
        })),
        setAdvSerialNo:(sampleNo,value) =>set(prev => ({
          advSerialNo:{
            ...prev.advSerialNo,
            [sampleNo]:value
          }
        })),
        setImage64:(value) => set({image64:value}),
        setAdvTestPanelID: (sampleNo,value) =>set(prev => ({
          advTestPanelID:{
            ...prev.advTestPanelID,
            [sampleNo]:value
          }
        })),
        setAdvLotNo: (sampleNo,value) =>set(prev => ({
          advLotNo:{
            ...prev.advLotNo,
            [sampleNo]:value
          }
        })),
        setAdvSampleID: (sampleNo,value) =>set(prev => ({
          advSampleID:{
            ...prev.advSampleID,
            [sampleNo]:value
          }
        })),
        setAdvCompositePrepKit: (sampleNo,v1, v2, v3) =>set(prev => ({
          advSamplePrepKit:{
            ...prev.advSamplePrepKit,
            [sampleNo]:v1
          },
          advLotNo:{
            ...prev.advLotNo,
            [sampleNo]:v2
          },
          advPrepKitExpDate:{
            ...prev.advPrepKitExpDate,
            [sampleNo]:v3
          }
        })),
        setAdvCompositeTestPanelID: (sampleNo,v1, v2, v3) =>set(prev => ({
          advTestPanelID:{
            ...prev.advTestPanelID,
            [sampleNo]:v1
          },
          advSerialNo:{
            ...prev.advSerialNo,
            [sampleNo]:v2
          },
          advTestPanelExpDate:{
            ...prev.advTestPanelExpDate,
            [sampleNo]:v3
          }
        })),
        setAdvPrepKitExpDate: (sampleNo,value) =>set(prev => ({
          advPrepKitExpDate:{
            ...prev.advPrepKitExpDate,
            [sampleNo]:value
          }
        })),
        setAdvTestPanelExpDate: (sampleNo,value) =>set(prev => ({
          advTestPanelExpDate:{
            ...prev.advTestPanelExpDate,
            [sampleNo]:value
          }
        })),
        setCurrentSampleDetectionState:(value) => set({currentSampleDetectionState:value}),
        removeAdvTestData: (no) =>set(prev => {
          const advSamplePrepKit = prev.advSamplePrepKit;
          delete advSamplePrepKit[no]
          const  advSerialNo = prev.advSerialNo
          delete  advSerialNo[no]
          const advTestPanelID = prev.advTestPanelID
          delete advTestPanelID[no]
          const  advSampleID = prev.advSampleID
          delete  advSampleID[no]
          const  advLotNo = prev.advLotNo
          delete advLotNo[no]
          const  advPrepKitExpDate = prev.advPrepKitExpDate
          delete advPrepKitExpDate[no]
          const  advTestPanelExpDate = prev.advTestPanelExpDate
          delete advTestPanelExpDate[no]
          return {
            advSamplePrepKit,
            advTestPanelID,
            advSampleID,
            advSerialNo,
            advLotNo,
            advPrepKitExpDate,
            advTestPanelExpDate
        }
        }),
        resetAdvTestDataState: () => set({
          ...initialState
        }),
        setAdvTestDataStore:(data)=>set({

          ...data})

    }),
    {
      name: "advTestData"
    }
  ))

  // samples: prev.samples.filter(sample => sample !== no),
