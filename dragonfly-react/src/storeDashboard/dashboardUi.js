import create from 'zustand';
import { persist } from "zustand/middleware"

const initialState = {
  isLogin: false,
  isList: false,
  isOrgLogin: false,
  testCompleteModalViewed: false,
  isBarCode: false,
  isBarCodePopUp: false,
  isBTactive: false,
  isSettings: false,
  bluetoothDevices: {}
};

export const useDashboardUiStore = create(
  persist(
    (set) => ({
      ...initialState,
      updateDashboardMapper: (value) => set({ dashboardMapper: value }),
      logIn: () => set({ isLogin: true }),
      logOut: () => set({ isLogin: false }),
      setIsOrgLogin: (value) => set({ isOrgLogin: value }),
      setIsList: (value) => set({ isList: value }),
      setTestCompleteModalViewed: (value) =>
        set({ testCompleteModalViewed: value }),
      setIsBarCode: (value) => set({ isBarCode: value }),
      setIsBarCodePopUp: (value) => set({ isBarCodePopUp: value }),
      setisBTactive: (value) => set({ isBTactive: value }),
      setIsSettings: (value) => set({ isSettings: value }),
      setBluetoothDevices: (value) => set({ bluetoothDevices: value }),
      resetDashboardUiStore: () =>
        set({
          ...initialState,
        }),
      setDashBoardUiStore: (data) =>
        set({
          ...data,
        }),
    }),
    {
      name: "dashboardUiStore",
    }
  )
);
