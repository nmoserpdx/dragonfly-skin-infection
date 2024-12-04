import create from 'zustand';
import { persist } from "zustand/middleware"

const initialState = {
    
    isDashboard:false,
    OffResultSave:[]
    
}

export const useDashboard = create(persist(
    set => ({
        ...initialState,
        setIsDashboard: (value) => set({ isDashboard: value }),
        setOffResultSave:(value)=>set({OffResultSave:value}),
        removeOffResultSave:(value)=>set(prev=>{
          var data =prev.OffResultSave.filter(function (t) {
            return t.testerId !== value 
            });
            return{
              OffResultSave:data
            }
        })
       
        }),
    {
      name: "dashboardStore"
    }
  ))