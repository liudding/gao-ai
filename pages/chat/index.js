import {
  TextDecoder
} from 'text-encoding'
import {throttle} from '../../utils/util'
Page({

  data: {
    currentBotMessage: '（思考思考中...）',
    scrollInto: null
  },

  async onLoad(options) {
    const requestMessageList = [{
      role: 'user',
      content: 'write a 200-words article'
    }]

    const timestamp = Date.now()
    const task = wx.request({
      url: 'https://chatgpt.liuding.fun/api/completion',
      method: 'POST',
      data: {
        messages: requestMessageList,
        time: timestamp,
        sign: '',
      },
      dataType: 'arraybuffer',
      responseType: 'arraybuffer',
      enableChunked: true,
      success: (res) => {
        // console.log(res);
      }
    })

    const updateUI = throttle(() => {
      this.setData({
        currentBotMessage: this.data.currentBotMessage,
        scrollInto: 'anchor'
      })

    }, 300)

    const decoder = new TextDecoder('utf-8')
    task.onChunkReceived((res) => {
      const msg = (new TextDecoder()).decode(res.data)

      this.data.currentBotMessage += msg

      updateUI()
    
    })
  },



  onShareAppMessage() {

  }
})