import {
  TextDecoder
} from '../../utils/text-decoding/index'
import throttle from '../../utils/throttle'
import roles from './roles'
Page({

  data: {
    messages: [],
    currentAssistantMessage: '',
    showCurrentAnswer: false,
    assistantIsAnswering: false,
    scrollTop: null,
    showRolePicker: false,

    roles: roles
  },

  async onLoad(options) {
    wx.getStorage({
      key: 'MESSAGE_HISTORIES',
      success: (res) => {
        this.histories = res.data || []
      },
      fail: (e) => {
        this.histories = []
      }
    })
    
    if (options.role) {
      const role = this.data.roles.find(i => i.id === options.role)
      if (role) {
        this.switchToRole(role)
      }
    }

    // const prompt = 'I want you to act as a spoken English teacher and improver. I will speak to you in English and you will reply to me in English to practice my spoken English. I want you to keep your reply neat, limiting the reply to 100 words. I want you to strictly correct my grammar mistakes, typos, and factual errors. I want you to ask me a question in your reply. Now let’s start practicing, you could ask me a question first. Remember, I want you to correct my grammar mistakes, typos, and factual errors strictly.'

    // this.messages = [{
    //   role: 'user',
    //   content: prompt
    // }]

    // this.setData({
    //   messages: this.data.messages,
    //   currentInput: '',
    //   assistantIsAnswering: false,
    //   scrollIntoView: 'anchor'
    // })
    // this.sendToBot();

  
  },

  clearCurrentAssistantMessage() {
    if (this.data.currentAssistantMessage) {
      this.data.messages.push({
        role: 'assistant',
        content: this.data.currentAssistantMessage
      })
    }

    this.setData({
      messages: this.data.messages,
      currentAssistantMessage: ''
    })
  },

  async onConfirmSend(e) {
    this.clearCurrentAssistantMessage()

    const msg = {
      role: 'user',
      content: e.detail.value
    }
    this.data.messages.push(msg)

    this.setData({
      messages: this.data.messages,
      currentInput: '',
      showCurrentAnswer: true,
      assistantIsAnswering: true,
      scrollIntoView: 'anchor'
    })

    this.addMessageToHistory(msg)

    this.sendToBot()
  },

  onTapMenu() {
    this.setData({
      showRolePicker: true
    })
  },

  async sendToBot() {
    const requestMessageList = this.data.messages.concat()

    if (this.currentAssistantRole) {
      requestMessageList.unshift({
        role: 'user', // system
        content: this.currentAssistantRole.prompt
      })
    }

    const timestamp = Date.now()
    this.task = wx.request({
      url: 'https://completion.liuding.fun/api/completion',
      method: 'POST',
      data: {
        messages: requestMessageList,
        time: timestamp,
        sign: '',
      },
      dataType: 'arraybuffer',
      responseType: 'arraybuffer',
      enableChunked: true,
      fail: () => {
        this.task = null
        this.setData({
          assistantIsAnswering: false,
          currentAssistantMessage: '糟糕，出错了',
          scrollIntoView: 'anchor'
        })
      },
      complete: (res) => {
        setTimeout(() => {
          this.task = null
          this.setData({
            assistantIsAnswering: false,
            scrollIntoView: 'anchor'
          })
          this.addMessageToHistory({
            role: 'assistant',
            content: this.data.currentAssistantMessage
          })
        }, 300)
      }
    })

    const updateUI = throttle(() => {
      this.setData({
        currentAssistantMessage: this.data.currentAssistantMessage,
        showCurrentAnswer: true,
        assistantIsAnswering: true,
        scrollIntoView: 'anchor'
      })
    }, 300)

    const decoder = new TextDecoder()
    this.task.onChunkReceived((res) => {
      const msg = decoder.decode(res.data)
      if (msg === '\n') {
        return;
      }
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
      messages: [],
      currentAssistantMessage: ''
    })
  },

  onTapCopy() {
    wx.setClipboardData({
      data: this.data.currentAssistantMessage,
    })
  },

  onTapHistory() {
    wx.navigateTo({
      url: '/pages/history/history',
    })
  },

  switchToRole(role) {
    this.currentAssistantRole = role;

    this.setData({
      messages: role.messages || [],
      currentAssistantMessage: '',
      assistantIsAnswering: false,
      showCurrentAnswer: false,
      showRolePicker: false
    })

    wx.setNavigationBarTitle({
      title: role.name,
    })

    if (!role.messages || !role.messages.length) {
      return
    }

    const last = role.messages[role.messages.length - 1]
    if (last.role === 'assistant') {
      return;
    }

    this.setData({
      showCurrentAnswer: true,
      assistantIsAnswering: true,
      scrollIntoView: 'anchor'
    })
    this.sendToBot();
  },

  onTapRole(e) {
    const role = e.currentTarget.dataset.item

    if (this.currentAssistantRole && this.currentAssistantRole.id === role.id) return;

    this.switchToRole(role)
  },

  addMessageToHistory(msg) {
    this.histories.push(msg)

    wx.setStorage({
      key: 'MESSAGE_HISTORIES',
      data: this.histories
    })
  },

  onShareAppMessage() {

  }
})