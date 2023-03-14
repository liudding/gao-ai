import {
  TextDecoder
} from 'text-decoding'
import {throttle} from '../../utils/util'
Page({

  data: {
    messages: [{
      role: 'user',
      content: 'hi'
    }, {
      role: 'assistant',
      content: 'assistant klasdlk 卢卡斯克拉的萨拉丁考虑扣税的零三点零开始老师肯定考虑'
    }, {
      role: 'user',
      content: 'hi  卡拉斯科啦的案例看首都卡拉看ask大口大口可是可是可是看到'
    }, {
      role: 'user',
      content: 'haslasdasdasdkdi'
    },{
      role: 'assistant',
      content: 'lkslk了顺利打开老师的课克里斯蒂拉萨的考虑是到了圣诞快乐老师看到拉萨扩大了快速旅客的顺利打开拉萨的考虑萨拉丁考虑扣税的考虑势力扩大克莱斯勒看到十六点克莱斯勒看到是镂空雕刻拉上了的'
    }, {
      role: 'assistant',
      content: 'hi'
    }],
    currentAssistantMessage: 'hi how can i assist',
    scrollTop: null
  },

  async onLoad(options) {
  },

  clearCurrentAssistantMessage() {
    this.data.messages.push({
      role: 'assistant',
      content: this.data.currentAssistantMessage
    })
    this.setData({
      messages: this.data.messages,
      currentAssistantMessage: ''
    })
  },

  async onConfirmSend(e) {
    this.clearCurrentAssistantMessage()

    const text = e.detail.value
    this.data.messages.push({
      role: 'user',
      content: text
    })

    this.setData({
      messages: this.data.messages,
      currentInput: '',
      assistantIsAnswering: true,
      scrollIntoView: 'anchor'
    })

    this.sendToBot()
  },

  onTapMenu() {
    this.setData({
      scrollTop: 0
    })
  },

  async sendToBot() {
    const requestMessageList = this.data.messages

    const timestamp = Date.now()
    this.task = wx.request({
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
      complete: (res) => {
        this.task = null
        this.setData({
          assistantIsAnswering: false,
          scrollIntoView: 'anchor'
        })
      }
    })

    const updateUI = throttle(() => {
      this.setData({
        currentAssistantMessage: this.data.currentAssistantMessage,
        assistantIsAnswering: true,
        scrollTo: 100000,
        scrollIntoView: 'anchor'
      })

    }, 300)

    const decoder = new TextDecoder()
    this.task.onChunkReceived((res) => {
      const msg = decoder.decode(res.data)
      this.data.currentAssistantMessage += msg
      updateUI()
    })
  },

  onTapStop() {
    this.task.abort()
    this.task = null;
  },

  onTapClear() {
    this.setData({
      messages: []
    })
  },



  onShareAppMessage() {

  }
})