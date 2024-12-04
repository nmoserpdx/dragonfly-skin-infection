import create from 'zustand';
import { persist } from "zustand/middleware"

const initialState = {
    advSamples:{},
    scanningForPos:"",
    advSampleCompletedStep:{},
    advSamplesPos:{},
    currentAdvSampleNo: "",
    samplesNo:[],
    samplesReadyForCapture:[],
    advVoidSamples:[],
}

export const useAdvSampleStore = create(persist(
    set => ({
        ...initialState,
        setAdvVoidSamples:(value)=> set({advVoidSamples:value}),
        setScanningForPos:(value) => set({scanningForPos:value}),
        setSamplesNo:(value) => set({samplesNo:value}),
        setSamplesReadyForCapture:(value) => set({samplesReadyForCapture:value}),
        setAdvSamplesPos:(sampleNo,pos) =>set(prev => ({
          advSamplesPos:{
            ...prev.advSamplesPos,
            [sampleNo]:[pos]
          }
        })),
        startCompletion:(pos) => set(prev => ({
          advSampleCompletedStep: {
            ...prev.advSampleCompletedStep,
            [pos]: []
          }
        })),
        setCurrentAdvSampleNo:(value)=> set({currentAdvSampleNo:value}),
        setAdvSampleCompletedStep:(pos,value) =>set(prev => ({
          advSampleCompletedStep: {
            ...prev.advSampleCompletedStep,
            [pos]: [...prev.advSampleCompletedStep[pos],value]
          }
        })),
        setAdvSamples: (no,value) => set(prev => ({
          advSamples: {
            ...prev.advSamples,
            [no]: value
          }
        })),
        removeSample: (no) => set(prev => {
          const advSamples = prev.advSamples;
          delete advSamples[no]
          const advSamplesPos = prev.advSamplesPos
          delete advSamplesPos[no]
          const advSampleCompletedStep = prev.advSampleCompletedStep
          delete advSampleCompletedStep[no]
          return {
            advSamples,
            advSamplesPos,
            advSampleCompletedStep,
            samplesNo: prev.samplesNo.filter(sample => sample !== no),
            samplesReadyForCapture : prev.samplesReadyForCapture.filter(sample => sample !== no),

        }
        }),
        removeHeaterPosOfSample: (no) => set(prev => {

          const advSamplesPos = prev.advSamplesPos
          delete advSamplesPos[no]

          return {
            advSamplesPos,
          }
        }),
        resetAdvSampleState: () => set({
          ...initialState
        }),
        setAdvSampleStore:(data)=>set({

          ...data})
    }),
    {
      name: "advSampleStore"
    }
  ))

  // samples: prev.samples.filter(sample => sample !== no),
