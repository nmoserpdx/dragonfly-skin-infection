import create from 'zustand';
import { persist } from "zustand/middleware"

import { ADV_TIMER_FOR_SCAN,EXTRA_TIME } from '../constants';
const initialState = {
    activeTimer:null,

    timerForSamplePos:{},
    incubationTimer:{},
    voidTimer:{},
    advPopUp: [],
    advPopUpExpiry:{},
    begPopUp:[],
    begPopUpExpiry:{}
}

export const useAdvTimerStore = create(persist(
    set => ({
        ...initialState,
        addToAdvPopUp:(value) => set({advPopUp:value}),
        removeFromAdvPopUp: (samplepos,value,extra=EXTRA_TIME) => set(prev => {
          return{
          advPopUp:prev.advPopUp.filter(sample => sample !== samplepos),
          advPopUpExpiry:{
            ...prev.advPopUpExpiry,
            [samplepos]:value+extra
          },
        }

        }),
        addToBegPopUp:(value) => set({begPopUp:value}),
        removeFromBegPopUp: (sampleid,value,extra=EXTRA_TIME) => set(prev => {
            return{
            begPopUp:prev.begPopUp.filter(sample => sample !== sampleid),
            begPopUpExpiry:{
              ...prev.begPopUpExpiry,
              [sampleid]:value+extra
            },
          }
        }),
        updateActiveTimer:(value) => set({activeTimer:value}),
        setIncubationTimer:(samplepos,value)=> set(prev => {
          return {
            incubationTimer: {
                ...prev.incubationTimer,
                [samplepos]:value
              }
            }
        }),

        setTimerForSamplePos: (samplepos,data,value) => set(prev => {
            return {

                timerForSamplePos: {
                  ...prev.timerForSamplePos,
                  [samplepos]:{
                    ...prev.timerForSamplePos[samplepos],
                    [data] : value,
                    isPaused : false,
                    heaterTimerEndsAt : value+ADV_TIMER_FOR_SCAN,

                    pausedAt : value,


                  }
                }
              }
          }),
        pauseTimer : (samplepos,value) => set(prev => {
          return {
              timerForSamplePos: {
                ...prev.timerForSamplePos,
                [samplepos]:{
                  ...prev.timerForSamplePos[samplepos],
                  pausedAt : value,
                  isPaused : true,

                }
              }
            }
        }),

        resumeTimer : (samplepos,value) => set(prev => {
          return {
              timerForSamplePos: {
                ...prev.timerForSamplePos,
                [samplepos]:{
                  ...prev.timerForSamplePos[samplepos],

                  isPaused : false,
                  heaterTimerEndsAt : value,




                }
              }
            }
        }),

       addExtraTime:(samplepos,value)=>set(prev => {
        return {
            timerForSamplePos: {
              ...prev.timerForSamplePos,
              [samplepos]:{
                ...prev.timerForSamplePos[samplepos],


                heaterTimerEndsAt : prev.timerForSamplePos[samplepos].heaterTimerEndsAt+value,


              }
            }
          }
      }),
        removeTimerForSamplePos: (samplepos) => set(prev => {
          const timerForSamplePos = prev.timerForSamplePos;
          delete timerForSamplePos[samplepos]
          const incubationTimer = prev.incubationTimer;
          delete incubationTimer[samplepos]
          const advPopUpExpiry = prev.advPopUpExpiry;
          delete advPopUpExpiry[samplepos]
          const begPopUpExpiry = prev.begPopUpExpiry;
          delete begPopUpExpiry[samplepos]

          return {
            timerForSamplePos,
            incubationTimer,
            advPopUpExpiry,
            advPopUp:prev.advPopUp.filter(sample => sample !== samplepos),
            begPopUpExpiry,
            begPopUp:prev.begPopUp.filter(sample => sample !== samplepos),
        }
        }),
        resetAdvTimerState: () => set({

          timerForSamplePos:initialState.timerForSamplePos,
          incubationTimer:initialState.incubationTimer,
          advPopUpExpiry:initialState.advPopUpExpiry,
          advPopUp:initialState.advPopUp,
          begPopUpExpiry:initialState.begPopUpExpiry,
          begPopUp:initialState.begPopUp,

        }),
        setAdvTimerStore:(data)=>set({

          ...data})

    }),
    {
      name: "advTimer"
    }
  ))
