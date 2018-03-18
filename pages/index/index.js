//index.js
//获取应用实例
const app = getApp()

const util = require('../../utils/util.js')

var inputContent = ''

const DATAID = 'userid'

const LOGID = 'logid'

var saveDataToLog = function (_this, txt) {
  let data = util.formatTime(new Date()) + '\r\n' + txt
  wx.getStorage({
    key: LOGID,
    success: function (res) {
      let logs = res.data
      if (logs instanceof Array) {
        logs[logs.length] = data
        util.saveToStorage(LOGID, logs)
      }
    },
    fail: function () {
      util.saveToStorage(LOGID, [data])
    },
  })
}

Page({
  data: {
    userid: '',
  },

  onLoad: function () {
    let _this = this

    wx.getStorage({
      key: DATAID,
      success: function (res) {
        inputContent = res.data
        _this.setData({ [DATAID]: res.data })
      },
    })

  },

  bindinput: function (e) {
    inputContent = e.detail.value
  },

  queryClick: function (e) {

    let _this = this
    if (inputContent.length !== 18) {
      wx.showToast({
        image: '/image/error.png',
        title: '请输出 18 位数字或字母',
        duration: 2000,
      })
      return;
    }

    wx.setStorage({ key: DATAID, data: inputContent })

    wx.showLoading({
      mask: true,
      title: '正在查询...',
    })
    console.log("start request")
    wx.request({
      url: 'http://ent.sipmch.sipac.gov.cn/ModuleDefaultCompany/RentManage/SearchRentNo',
      data: { "CertNo": inputContent },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
      },
      fail: function (e) {
        console.log("respone fail")
        wx.hideLoading()
        wx.showModal({
          title: "查询失败",
          content: e['errMsg']
        })
      },
      success: function (res) {
        console.log("respone success")
        wx.hideLoading()
        console.log(res)

        if (res && res['statusCode'] == 200) {
          try {
            res = res['data']

            var re_msg1 = 'result: ' + res['result'] + '\n'
            var re_msg2 = 'prompWord: ' + res['prompWord'] + '\n'
            var re_msg3 = 'isCheckOut: ' + res['isCheckOut'] + '\n'
            var re_msg = re_msg1 + re_msg2 + re_msg3

            wx.showModal({
              content: re_msg
            })

          } catch (e) {
            wx.showToast({
              image: '/image/error.png',
              title: e.message,
              duration: 2000,
            })
          }
        } else {
          wx.showToast({
            image: '/image/error.png',
            title: '获取服务器响应失败',
            duration: 2000,
          })
        }
      }
    })

  },


})

