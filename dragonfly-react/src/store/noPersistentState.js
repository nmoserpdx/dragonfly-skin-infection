import create from 'zustand';

const initialState = {
    isWrongSample:false, //Prep kit
    isWrongTestSample: false, //Test panel
    wrongType:0,
    wrongTestPanelType: 0,
    wrongMsg:"",
    wrongTestPanelMsg: "",
    sampleIDscanned: false
}

export const useNonPersistentStates = create(
    set => ({
        ...initialState,
        setIsWrongSample: (value) => set({  isWrongSample: value }),
        setIsWrongTestSample: (value) => set({  isWrongTestSample: value }),
        setWrongType: (value) => set({  wrongType: value }),
        setWrongTestPanelType: (value) => set({  wrongTestPanelType: value }),
        setWrongMsg: (value) => set({  wrongMsg: value }),
        setWrongTestPanelMsg: (value) => set({  wrongTestPanelMsg: value }),
        setsampleIDScanned: (value) => set({  sampleIDscanned: value }),
        resetNoPersistentState: () => set({
          ...initialState
        })
    }),
    {
      name: "nonPersistentState"
    }
)
