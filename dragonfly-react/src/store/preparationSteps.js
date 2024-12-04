import create from 'zustand';
import { persist } from "zustand/middleware"

const initialState = {
    activeStep: 0,
    completedSteps: [0],
    playbackTimes: 0,
    videoPlaybackPointer: 0
}
export const usePreparationStore = create(persist(
    set => ({
        ...initialState,
        setActiveStep: (value) => set({ activeStep: value }),
        setCompletedSteps: (value) => set({ completedSteps: value }),
        setPlaybackTimes: (value) => set({ playbackTimes: value }),
        setVideoPlaybackPointer: (value) => set({ videoPlaybackPointer: value }),
        resetPreparationState: () => set({
            ...initialState
        }),
        
    }),
    {
      name: "preparation-steps"
    }
  ))