import create from 'zustand';
import { persist } from "zustand/middleware"

const initialState = {
  prepareSampleTimers: {
    LYSIS_1: {
      isPlaying: false,
      timer: 30,
      timeStamp: "",
    },
    WASH_1: {
      isPlaying: false,
      timer: 30,
      timeStamp: "",
    },
    WASH_2: {
      isPlaying: false,
      timer: 30,
      timeStamp: "",
    },
    DRY_1: {
      isPlaying: false,
      timer: 30,
      timeStamp: "",
    },
    Elution_1: {
      isPlaying: false,
      timer: 30,
      timeStamp: "",
    },
  },
};
export const usePrepareSampleStore = create(persist(
    set => ({
        ...initialState,
    startTimer: (id, value) => {
      let curr_time = new Date().toISOString();
      set(prev => {
        return {
          prepareSampleTimers: {
            ...prev.prepareSampleTimers,
            [id]: {
              ...prev.prepareSampleTimers[id],
              timerStartesAt: value,
              timeStamp: curr_time
            }
          }
        }
      })
    },
    pauseTimer: (id, value) => set(prev => ({

        prepareSampleTimers: {
          ...prev.prepareSampleTimers,
          [id]: {
              ...prev.prepareSampleTimers[id],
            isPlaying: false

          }
        }
      })),
        reduceTimerBySecond: (id) => set(prev => {
            // console.log(prev.prepareSampleTimers[id].timer);
            return {
                prepareSampleTimers: {
                  ...prev.prepareSampleTimers,
                  [id]: {
                      ...prev.prepareSampleTimers[id],
                      timer: prev.prepareSampleTimers[id].timer > 0 ? prev.prepareSampleTimers[id].timer - 1 : 0
                  }
                }
              }
        }),
    setPlayStateForTimerID: (id, value) => 
      set(prev => ({
        prepareSampleTimers: {
          ...prev.prepareSampleTimers,
          [id]: {
            ...prev.prepareSampleTimers[id],
            isPlaying: value,
          }
        }
      }))
    ,
          resetTimer:(id)=>set(prev => ({
            prepareSampleTimers: {
              ...prev.prepareSampleTimers,
              [id]: {
                ...prev.prepareSampleTimers[id],
                timer: 30
              }
            }
          })),
        resetSampleTimerState: () => set({
          ...initialState
        })
    }),
    {
      name: "prepareSampleTimers"
    }
  ))