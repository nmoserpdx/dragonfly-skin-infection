import create from 'zustand';
import { persist } from "zustand/middleware"

const initialState = {
    samplePrepKit: "",
    TestPanel: "",
    respiratoryTestPanel: "",
    serialNo:"",
    lotNo:"",
    scannedTestPanelId:"",
    scannedSerialNo:"",
    prepKitExpirydate: "",
    testPanelExpirydate: ""
}
export const useTestDataStore = create(persist(
    set => ({
        ...initialState,
        setSamplePrepKit: (value) => set({ samplePrepKit: value }),
        setTestPanel: (value) => set({ TestPanel: value }),
        setLotNo:(value)=>set({lotNo:value}),
        setRespiratoryTestPanel: (value) => set({ respiratoryTestPanel: value }),
        setSerialNo:(value)=> set({serialNo:value}),
        setScannedData:(v1,v2)=> set({
          scannedTestPanelId:v1,
          scannedSerialNo:v2,
        }),
        setCompositePrepKit: (v1, v2, v3)=> set({
          samplePrepKit: v1,
          lotNo:v2,
          prepKitExpirydate: v3
        }),
        setCompositeTestPanel: (v1, v2, v3)=> set({
          TestPanel: v1,
          serialNo:v2,
          testPanelExpirydate: v3
        }),
        resetScannedData:()=>set({
        scannedTestPanelId:"",
        scannedSerialNo:""
        }),
        resetTestDataState: () => set({
          ...initialState
        })
    }),
    {
      name: "testData"
    }
  ))
