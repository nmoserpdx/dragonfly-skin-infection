import create from 'zustand';
import { persist } from "zustand/middleware"

const initialState = {
    initialheater: {
        "1":"",
        "2":"",
        "3":"",
        "4":""
    },
    AdvHeater:{
      'a':{
        "1":"",
      "2":"",
      "3":"",
      "4":""},
    },

    isHeaterModal: false,
    isHeaterButtonsEnable: false,
    HeaterId:['a'],
    allHeaters:[0],
    loadedRow:"",
    loadedHeaterId:"",


}

export const useAdvHeaterStore = create(persist(
    set => ({
        ...initialState,

            setIsHeaterModal: (value) => set({isHeaterModal:value}),
            setIsHeaterButtonsEnable: (value) => set({isHeaterButtonsEnable:value}),
           setAdvHeater:(heaterId,heaterRow,SamplePos) => set(prev => {

            return !heaterRow?{

                AdvHeater: {
                  ...prev.AdvHeater,
                  [heaterId]: initialState.initialheater
                },
                allHeaters:(parseInt(heaterId, 36) === 0) ? [0] : [...prev.allHeaters,(parseInt(heaterId, 36) - 10)]
              }:{
                  AdvHeater:{
                    ...prev.AdvHeater,
                    [heaterId]: {
                        ...prev.AdvHeater[heaterId],
                        [heaterRow]:SamplePos
                    }
                  }

              }
          }),

          setLoad:(heaterId,rowno)=>set({loadedHeaterId:heaterId,loadedRow:rowno}),
          setHeaterId: (heaterId)  => set(prev => {
            return {
                HeaterId: [
                  ...prev.HeaterId,
                  heaterId
                ]
              }
          }),
          removeHeater: (heaterId)=>set(prev => {
            const AdvHeater = prev.AdvHeater;

            delete AdvHeater[heaterId]
            return {
             allHeaters: prev.allHeaters.filter(Id => ((Id+1)+9).toString(36) !== heaterId),
              HeaterId: prev.HeaterId.filter(Id => Id !== heaterId),
              AdvHeater,
              }
          }),
          resetAdvHeaterState: () => set({
            ...initialState
          }),
          setAdvHeaterStore:(data)=>set({

            ...data})
    }),
    {
      name: "advHeaterStore"
    }
  ))
