//index.js
//获取应用实例
const app = getApp()

var inputContent = ''

const DATAID = 'userid'

Page({
  data: {
    userid: '',
  },

  onLoad: function () {
    var _this = this

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
    var _this = this
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

    wx.request({
      url: 'http://ent.sipmch.sipac.gov.cn/ModuleDefaultCompany/RentManage/SearchRentNo',
      data: { "CertNo": inputContent },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
      },
      fail: function () {
        wx.hideLoading()
        wx.showToast({
          image: '/image/error.png',
          title: '查询失败！',
          duration: 2000,
        })
      },
      success: function (res) {
        wx.hideLoading()
        try {
          if (res && res['statusCode'] == 200) {
            var result = res['data']
            if (result) {
              var ischeckout = result['isCheckOut']
              var msg = result['prompWord'];
              var match = msg.match(/【[0-9]{1,}】/g)
              var rank = 0
              if (match.length > 0) {
                rank = match[0].replace('【', '').replace('】', '').trim()
                wx.showModal({
                  showCancel: false,
                  content: '您当前排名为：' + rank + '\r\n\r\nisCheckOut: ' + ischeckout,
                })
                return;
              }
            }
          }
        } catch (e) {
        }

        wx.showToast({
          image: '/image/error.png',
          title: '内容解析错误！',
          duration: 2000,
        })
      }
    })

  },


})

