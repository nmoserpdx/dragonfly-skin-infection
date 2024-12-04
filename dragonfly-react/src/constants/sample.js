//export const TEST_PANEL = ['100051','100040', '100069']
//export const PREP_KIT = ['100006', '100104', '100350']

export const BCR = {
    "lot":1,
    "expiry":2,
    "ref":0
}
// bar code response

export const TEST_PANEL_TYPE = {
    '100051':"Respiratory",
    '100040':"Covid"
}

export var SCAN_ERRORS = {
  "NONE": 0,
  "EXPIRED_PREP_KIT" : 1,
  "INVALID_PREP_KIT" : 2,
  "MISSING_PREP_KIT" : 3,
  "EXPIRED_TEST_PANEL" : 4,
  "INVALID_TEST_PANEL" : 5,
  "MISSING_TEST_PANEL" : 6,
  "GENERIC_INVALID": 7
}
