// components/message/index.js
Component({
  properties: {
    data: {
      type: Object
    }
  },


  data: {

  },

  methods: {
    onTapCopy() {
      wx.setClipboardData({
        data: this.data.data.content,
        success: () => {
          wx.showToast({
            title: '复制成功',
            icon:'success'
          })
        }
      })
    
    }
  }
})
