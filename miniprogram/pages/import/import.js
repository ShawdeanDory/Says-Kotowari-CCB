// pages/import/import.js
const app = getApp()

Page({
  data: {
    userInfo: {}, // 存用户信息
    token: '',
    tempCourses: [],
    hasData: false,
    isPublic: false
  },

  onShow() {
    // 1. 自动同步全局变量里的用户信息 (来自首页设置)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      });
    }
  },

  // 监听输入口令
  onInputToken(e) {
    this.setData({ token: e.detail.value })
  },

  // 【新增】监听昵称修改
  onNameInput(e) {
    this.setData({
      'userInfo.nickName': e.detail.value
    })
  },

  // 解析口令 (保持不变)
  importFromWakeUp() {
    if (!this.data.token) return wx.showToast({ title: '请粘贴口令', icon: 'none' });
    wx.showLoading({ title: '解析中...' })
    wx.cloud.callFunction({
      name: 'importWakeUp',
      data: { token: this.data.token },
      success: res => {
        wx.hideLoading();
        if (res.result.success) {
          this.setData({ tempCourses: res.result.data, hasData: true });
          wx.showToast({ title: '解析成功' });
        } else {
          wx.showModal({ title: '提示', content: res.result.msg, showCancel: false });
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    })
  },

  // 开关改变
  switchChange(e) {
    this.setData({ isPublic: e.detail.value })
  },

  // 保存到云端
  saveToCloud() {
    // 校验：必须要有昵称（头像如果没有就用默认的）
    if (!this.data.userInfo.nickName) {
      return wx.showToast({ title: '请填写昵称', icon: 'none' });
    }
    if (!this.data.hasData) {
      return wx.showToast({ title: '暂无数据', icon: 'none' });
    }

    wx.showLoading({ title: '保存中...' })
    
    wx.cloud.callFunction({
      name: 'saveSchedule',
      data: {
        courses: this.data.tempCourses,
        isPublic: this.data.isPublic,
        // 直接把当前页面确认好的 userInfo (含自定义昵称和云端头像ID) 传给后端
        userInfo: this.data.userInfo 
      },
      success: res => {
        wx.hideLoading();
        wx.showToast({ title: '保存成功' });
        
        // 保存后跳回课表页
        setTimeout(() => {
            wx.switchTab({ 
                url: '/pages/lesson/lesson',
                fail: () => { wx.reLaunch({ url: '/pages/lesson/lesson' }) }
            }) 
        }, 1500);
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({ title: '保存失败', icon: 'none' });
      }
    })
  }
})