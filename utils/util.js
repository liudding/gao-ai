const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

function throttle(func, delay) {
  let lastCalledTime = 0;
  return function(...args) {
    const now = new Date().getTime();
    if (now - lastCalledTime >= delay) {
      func.apply(this, args);
      lastCalledTime = now;
    }
  }
}

module.exports = {
  formatTime,
  throttle
}
