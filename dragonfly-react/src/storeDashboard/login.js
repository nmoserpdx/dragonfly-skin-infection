import create from 'zustand';
import { persist } from "zustand/middleware"

const initialState = {
 loginId:"",

    
}

export const useLoginStore = create(persist(
    set => ({
        ...initialState,
       
        setLoginId: (value) =>({loginId:value}),
       
        resetLoginStore: () => set({
          ...initialState
        })
    }),
    {
      name: "LoginStore"
    }
  ))