import create from 'zustand';
import { persist } from "zustand/middleware"

const initialState = {
  sample_ids: ["100006", "100104", "100350"],
  test_panel_ids: ["100040", "100051", "100069"]
} //supports all older codes

export const useConfigStore = create(persist(
    set => ({
        ...initialState,
        setSampleIds: (value) => set({ sample_ids: value }),
        setTestPanels: (value) => set({ test_panel_ids: value }),
        resetConfigState: () => set({
          ...initialState
        }),
        setConfigStore: (data) =>
          set({
            ...data,
          }),
    }),
    {
      name: "appconfiguration"
    }
  ))
