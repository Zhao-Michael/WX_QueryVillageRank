//logs.js
const util = require('../../utils/util.js')

const LOGID = 'logid'

Page({
  data: {
    logs: []
  },

  onLoad: function () {
    this.setData({
      logs: function () {
        let temp = wx.getStorageSync(LOGID)
        if (temp instanceof Array) {
          return temp.length == 0 ? ['无数据'] : temp;
        } else {
          return ['无数据']
        }
      }()
    })
  },

  onbindlongtap: function () {
    wx.showModal({
      content: "是否删除所有日志信息？",
      success: res => {
        if (res.confirm) {
          util.saveToStorage(LOGID, [])
          util.ShowTosat("删除成功，请重新加载页面！")
        }
      }
    })
  }

})
