import create from 'zustand';
import { persist } from "zustand/middleware"

const initialState = {
    samples: [],
    currentSample: {},
    timerMapper: {},
    voidSamples: [],
    timeExceededSamples: {},
    scanningId:"",
    scanningIdPos:"",
    samplePos : {},
    preperationScreenSampleId:"",
    begSampleReadyForScan: [],
    allowExpiry: false,
    activeDemoMode: false
}
export const useSampleStore = create(persist(
    set => ({
        ...initialState,
        setBegSampleReadyForScan: (value) => set({begSampleReadyForScan:value}),
        setSamples: (value) => set({ samples: value }),
        setCurrentSample: (value) => set({ currentSample: value }),
        setPreperationScreenSampleId: (value) => set({preperationScreenSampleId:value}),
        setSamplePos: (id,pos) => set(prev => ({
          samplePos: {
            ...prev.samplePos,
            [id]: pos
          }
        })),
        setSampleTimer: (id, timer) => set(prev => ({
          timerMapper: {
            ...prev.timerMapper,
            [id]: timer
          }
        })),
        setScanningId: (id) => set({ scanningId: id }),
        reduceTimerBySecond: (id, stateToSet) => set(prev => ({
          [stateToSet]: {
            ...prev[stateToSet],
            [id]: prev[stateToSet][id] ? prev[stateToSet][id] - 1 : 0
          }
        })),
        setTimeExceededSamples: (id, timer) => set(prev => ({
          timeExceededSamples: {
            ...prev.timeExceededSamples,
            [id]: timer
          }
        })),
        setScanningIdPos: (pos) => set({scanningIdPos: pos}),
        setVoidSamples: (value) => set({ voidSamples: value }),
        removeVoidSample: (id) => set(prev => {
          const timerMapper = prev.timerMapper;
          delete timerMapper[id]
          const timeExceededSamples = prev.timeExceededSamples;
          delete timeExceededSamples[id];
          const samplePos = prev.samplePos;
          delete samplePos[id];

          return {
              voidSamples: prev.voidSamples.filter(sampleId => sampleId !== id),
              begSampleReadyForScan:  prev.begSampleReadyForScan.filter(sampleId => sampleId !== id),
              samples: prev.samples.filter(sample => sample.id !== id),
              timerMapper,
              timeExceededSamples,
              samplePos   // added
          }
        }),
        resetSampleState: () => set({
          ...initialState
        }),
        setSampleStore:(data)=>set({

          ...data}),
        setAllowExpiry: (value) => set({ allowExpiry: value ? value : false }),
        setActiveDemoMode: (value) => set({ activeDemoMode: value ? value : false }),
    }),
    {
      name: "samples"
    }
  ))
