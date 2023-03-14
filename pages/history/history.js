// pages/history/history.js
Page({

  data: {

  },


  onLoad(options) {
    const data = wx.getStorageSync('MESSAGE_HISTORIES')
    this.setData({
      messages: data
    })
  },

  onShareAppMessage() {

  }
})