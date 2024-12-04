import create from 'zustand';
import { persist } from "zustand/middleware"

const initialState = {
    //Warning codes
    sampleFlag: {},
    samplePrepkitExpired: {},
    sampleTestpanelExpired: {},
    sampleHeatingtimeExpired: {}
}

export const useWarningsStore = create(persist(
    set => ({
        ...initialState,
        //Setters for Test panel error cases
        setSampleFlag: (id,pos) => set(prev => ({
          sampleFlag: {
            ...prev.sampleFlag,
            [id]: pos
          }
        })),
        setSamplePrepkitExpired: (id,pos) => set(prev => ({
          samplePrepkitExpired: {
            ...prev.samplePrepkitExpired,
            [id]: pos
          }
        })),
        setSampleTestPanelExpired: (id,pos) => set(prev => ({
          sampleTestpanelExpired: {
            ...prev.sampleTestpanelExpired,
            [id]: pos
          }
        })),
        setSampleHeatingtimeExpired: (id,pos) => set(prev => ({
          sampleHeatingtimeExpired: {
            ...prev.sampleHeatingtimeExpired,
            [id]: pos
          }
        })),

        //Sample test panel
        removeFlagWarning: (id) => set(prev => {
          const flag = prev.sampleFlag;
          if(flag[id]){
            delete flag[id];
            return flag;
          }else{
            return null;
          }
        }),

        removeSamplePrepkitWarning: (id) => set(prev => {
          const prepkit = prev.samplePrepkitExpired;
          if(prepkit[id]){
            delete prepkit[id];
            return prepkit;
          }else{
            return null;
          }
        }),

        removeSampleTestPanelWarning: (id) => set(prev => {
          const testpanel = prev.sampleTestpanelExpired;
          if(testpanel[id]){
            delete testpanel[id];
            return testpanel;
          }else{
            return null;
          }
        }),

        removeHeatingTimeWarning: (id) => set(prev => {
          const heatingtime = prev.sampleHeatingtimeExpired;
          if(heatingtime[id]){
            delete heatingtime[id];
            return heatingtime;
          }else{
            return null;
          }
        }),

        resetWarnings: () => set({
          ...initialState
        }),
    }),
    {
      name: "warnings"
    }
  ))
