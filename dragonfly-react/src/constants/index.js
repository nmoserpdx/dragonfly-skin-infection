// To be implemented
import { useSampleStore } from "../store/samples";
// export const TIMER_SECONDS = 25*60; //30;//
// export const EXPANDED_TIMER_SECONDS = 5*60; //10;//
// export const TOTAL_HEATERS = 4;
// export const TIMER_FOR_STEPS=30;
// export const ADV_TIMER_FOR_SCAN = 25*60; //30;//
// export const ADV_TIMER_FOR_VOID = 5*60; //15;//
// export const AT_MAX_TIME = 30*60; //45;//
// export const EXTRA_TIME = 5*60; //5;//
// export const INCUBATION_TIME_ALERT_LIMIT = ADV_TIMER_FOR_SCAN + ADV_TIMER_FOR_VOID + ADV_TIMER_FOR_VOID
// export const Dummy_Token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2Mzc0MDA4ODcsIm5iZiI6MTYzNzQwMDg4NywianRpIjoiYjdiNTc3YWItMjI0Mi00NDYxLThmNGItNzJkZjc0ZjJjMjE2IiwiZXhwIjoxNjM3NDAxNzg3LCJpZGVudGl0eSI6IlZpdjIwMjEtMTEtMjBUMDk6MzQ6NDcuNjA5MzE1IiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.hetnuDSYFlVQElAha6xn2wTWWaBAIrY3swztuNOr6-E";

export var ADV_TIMER_FOR_SCAN = window.NativeDevice ? (window.NativeDevice.isDemoMode() ? 5*60 : 25*60) : 5*60; //25*60//
export var ADV_TIMER_FOR_VOID = window.NativeDevice ? (window.NativeDevice.isDemoMode() ? 2*60 : 5*60) : 2*60; //5*60//
export var AT_MAX_TIME = window.NativeDevice ? (window.NativeDevice.isDemoMode() ? 7*60 : 30*60) : 7*60; //30*60;//
export var EXTRA_TIME = window.NativeDevice ? (window.NativeDevice.isDemoMode() ? 2*60 : 5*60) : 2*60; //5*60;//

//Following are the constants which are always same
export const TOTAL_HEATERS = 4;
export const TIMER_FOR_STEPS=30;
export var INCUBATION_TIME_ALERT_LIMIT = ADV_TIMER_FOR_SCAN + ADV_TIMER_FOR_VOID + ADV_TIMER_FOR_VOID
export const Dummy_Token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2Mzc0MDA4ODcsIm5iZiI6MTYzNzQwMDg4NywianRpIjoiYjdiNTc3YWItMjI0Mi00NDYxLThmNGItNzJkZjc0ZjJjMjE2IiwiZXhwIjoxNjM3NDAxNzg3LCJpZGVudGl0eSI6IlZpdjIwMjEtMTEtMjBUMDk6MzQ6NDcuNjA5MzE1IiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.hetnuDSYFlVQElAha6xn2wTWWaBAIrY3swztuNOr6-E";

export var VALID_RESULTS = {
  "DETECTED" : 0,
  "NOT_DETECTED" : 1,
  "EMPTY" : 2
}
