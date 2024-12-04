import create from 'zustand';
import { persist } from "zustand/middleware"

const initialState = {
    heater: {
        1:"",
        2:"",
        3:"",
        4:""
    },
    loadNo:null,
    loadSample:"",
    begSamples:{}
}

export const useHeaterStore = create(persist(
    set => ({
        ...initialState,
        setHeater: (heaterno,id)=>set(prev => {
            return {
                heater: {
                  ...prev.heater,
                  [heaterno]: id
                }
              }
          }),
        setLoadNo: (value) =>set({ loadNo: value }),
        setLoadSample: (value) =>set({loadSample:value}),
        removeHeaterID : (no) => set(prev => {
          const begSamples = prev.begSamples;
          delete begSamples[prev.heater[no]]
          // console.log(begSamples,no)

          return {
           heater: {
               ...prev.heater,
               [no]: ""
           },
           begSamples


        }}),
        setBegSamples: (no,value) => set(prev => ({
          begSamples: {
            ...prev.begSamples,
            [no]: value
          }
        })),
        resetLoadState:()=>set({
          loadNo:null,
          loadSample:"",

        }),
        resetHeaterState: () => set({
          ...initialState
        }),
        setHeaterStore:(data)=>set({

          ...data})
    }),
    {
      name: "heaterStore"
    }
  ))
