export function formatTime(date) {
  if (!date) {
    return date;
  }
  const min = parseInt(date / 60);
  const second = parseInt(date % 60);
  return `0${min}`.slice(-2) + ":" + `0${second}`.slice(-2);
}
export function formatTimeByHM(time) {
  if (!time) {
    return time;
  }
  const min = parseInt((time / 1000 / 60) + '');
  const second = time / 1000 % 60;
  return `0${min}`.slice(-2) + ":" + `0${second}`.slice(-2);
}

export function verifyCode(phone) {
  const reg = /^1[3456789]\d{9}$/;
  if (!reg.test(phone)) {
    return false;
  }
  return true;
}

export function getCountdownTime(endTime, currentTime) {
  if (!endTime) {
    return {
      minute: '00',
      second: '00'
    };
  }
  let minute = parseInt((endTime - currentTime) / 1000 / 60);
  if (minute < 0) {
    minute = 0;
  }
  let consend = parseInt((endTime - currentTime) / 1000 % 60);
  if (consend < 0) {
    consend = 0;
  }
  const info = {
    minute: `0${minute}`.slice(-2),
    second: `0${consend}`.slice(-2),
  };
  return info;
}

export const fixScroll = () => {
  let u = navigator.userAgent;
  let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isiOS) {
    window.scrollTo(0, 0);
  }
}