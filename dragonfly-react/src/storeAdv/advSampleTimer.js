import create from "zustand";
import { persist } from "zustand/middleware";
import { TIMER_FOR_STEPS } from "../constants";
const initialState = {
  advSampleTimers: {
    LYSIS_1: {
      isPlaying: false,
      timer: TIMER_FOR_STEPS,
      timeStamp: "",
    },
    WASH_1: {
      isPlaying: false,
      timer: TIMER_FOR_STEPS,
      timeStamp: "",
    },
    WASH_2: {
      isPlaying: false,
      timer: TIMER_FOR_STEPS,
      timeStamp: "",
    },
    DRY_1: {
      isPlaying: false,
      timer: TIMER_FOR_STEPS,
      timeStamp: "",
    },
    Elution_1: {
      isPlaying: false,
      timer: TIMER_FOR_STEPS,
      timeStamp: "",
    },
  },
  AdvSampleTimerPos: {},
};
export const useAdvSampleTimerStore = create(persist(
    set => ({
        ...initialState,
        setanimation: (value) => set({animation:value}),
        setAdvSampleTimerPos: (no)=> set(prev => ({
            AdvSampleTimerPos: {
              ...prev.AdvSampleTimerPos,
              [no]: initialState.advSampleTimers
            }
          })),
        reduceTimerBySecond: (no,id) => set(prev => {

            return {
                AdvSampleTimerPos: {
                  ...prev.AdvSampleTimerPos,
                  [no]:{
                    ...prev.AdvSampleTimerPos[no],
                    [id]: {
                        ...prev.AdvSampleTimerPos[no][id],
                        timer : prev.AdvSampleTimerPos[no][id].timer > 0 ? prev.AdvSampleTimerPos[no][id].timer - 1 : 0
                    }}
                }
              }
        }),
        setPlayStateForTimerID: (no,id, value) => set(prev => ({

            AdvSampleTimerPos: {
              ...prev.AdvSampleTimerPos,
              [no]:{
                ...prev.AdvSampleTimerPos[no],
              [id]: {
                  ...prev.AdvSampleTimerPos[no][id],
                  isPlaying: value
              }}
            }
          })),
          resetTimer:(no,id)=>set(prev => ({
            AdvSampleTimerPos: {
                ...prev.AdvSampleTimerPos,
                [no]:{
                  ...prev.AdvSampleTimerPos[no],
                  [id]: {
                      ...prev.AdvSampleTimerPos[no][id],
                      timer : TIMER_FOR_STEPS
                  }}
              }
          })),
          removeTimerofSampleNo: (no) => set(prev => {
            const AdvSampleTimerPos = prev.AdvSampleTimerPos;
            delete AdvSampleTimerPos[no]

            return {
              AdvSampleTimerPos

          }
          }),
        resetAdvSampleTimerState: () => set({
          ...initialState
        }),
        setAdvSampleTimerStore:(data)=>set({

          ...data})
    }),
    {
      name: "advSampleTimers"
    }
  ))
