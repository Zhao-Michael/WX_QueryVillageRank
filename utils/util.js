const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':') + '  '
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const ShowTosat = txt => {
  wx.showToast({
    title: txt,
    icon: 'success',
    duration: 2000
  })
}

const saveToStorage = function (_key, _data) {
  wx.setStorage({
    key: _key,
    data: _data
  })
}

module.exports = {
  formatTime: formatTime,
  ShowTosat: ShowTosat,
  saveToStorage: saveToStorage,
}
