export const secondsToTime = (secs) => {
    const hours = `${Math.floor(secs / (60 * 60))}`;
    const divisor_for_minutes = secs % (60 * 60);
    const minutes = `${Math.floor(divisor_for_minutes / 60)}`;
    const divisor_for_seconds = divisor_for_minutes % 60;
    const seconds = `${Math.ceil(divisor_for_seconds)}`;
    const obj = {
      "h": hours.padStart(2, '0'),
      "m": minutes.padStart(2, '0'),
      "s": seconds.padStart(2, '0')
    };
    return obj;
  };

export const CalculateDateFromJDay = (day,year) => {
  var year1 = `202${year}`
  const oneDay = 1000 * 60 * 60 * 24
  var First_Day = new Date(year1, 0, 0);
  var DateForDay = new Date((day+1)*oneDay+First_Day.getTime())
  return DateForDay
}

export const checkForAlphanumeric = (value) => {
  if (!/^[a-zA-Z0-9/]*$/g.test(value)) {
      return false
  }
  return true
}

export const parseGSI = (response) => {

  if (response.length === 3) {
    response[0] = response[0].replace("240", "");
    response[1] = response[1].replace("10", "");
    response[2] = response[2].replace("17", "");
  } else if (response[0].slice(0, 6) !== -1) {
    let len = response[0].slice(0, 6);
    if (len === 100051 || len === 100040 || len === 100069) {
      //
    }
  }
  // console.log(response);
};

export const checkForExpiryHelper = (date) => { //for test panel
  return !(date > new Date());
};

export const checkForExpiryYYMMDDHelper = (YYMMDD) => { //For prep kit
    return !(new Date(`20${YYMMDD.slice(0,2)}-${YYMMDD.slice(2,4)}-${YYMMDD.slice(4,6)}`) >= new Date())
}
