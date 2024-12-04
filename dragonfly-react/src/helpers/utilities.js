// Following functions are Android native functions
// being called inside the code
export const handleUpdate = () => {
  if (window.NativeDevice) {
    window.NativeDevice.checkForUpdate();
  }
}

export const checkBluetooth = () => {
  //Commenting below
  //Need to uncomment
  //ANAND
  if(window.NativeDevice){
    window.NativeDevice.checkForBTDevice();
  }
  return true;
}
