import { useAdvTimerStore } from '../../storeAdv/advTimers'

const TimerFn = () => {
  const { updateActiveTimer } = useAdvTimerStore();

  window.updateTimeAndroid = function (json) {
    updateActiveTimer(json);
      //Push a backup to Android every 2 minutes
      /* let time = twoMinuteTimer + 1
      if (time % 120 === 0) {
          //Call Android function here to handle any crashes
          var data = AllStatetoJson()
          if (window.NativeDevice) {
              window.NativeDevice.backupState(JSON.stringify(data))
          }
          setTwoMinuteTimer(0)
      }
      setTwoMinuteTimer(time) */
  }

  return (
    <div></div>
  )
}

export default TimerFn;
