App({
  onLaunch: function () {
    // 1. 初始化云开发环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // 如果你有具体的环境ID，可以填在这里，格式如 'cloud-1g9...'
        // env: '你的环境ID', 
        traceUser: true,
      })
    }

    // 2. 初始化全局数据
    this.globalData = {
      userInfo: null
    }
  },

  // 这里可以定义全局数据对象
  globalData: {
    userInfo: null
  }
})