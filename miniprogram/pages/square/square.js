const defaultAvatarBase64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSIjZWVlIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIvPjxwYXRoIGZpbGw9IiNjY2MiIGQ9Ik01MCA2MGMtMTMuNSAwLTI1IDYuNS0zMCAxNi41VjkwYzAgMyAyLjUgNSA1IDVoNTBjMi41IDAgNS0yIDUtNXYtMTMuNUM4MCA2Ni41IDY4LjUgNjAgNTAgNjB6TTUwIDI1YTE1IDE1IDAgMSAwIDAgMzAgMTUgMTUgMCAwIDAgMC0zMHoiLz48L3N2Zz4=';

Page({
  data: {
    userList: [],
    defaultAvatar: defaultAvatarBase64 // 加入默认头像数据
  },

  onLoad() {
    // 进入界面时，自动触发一次下拉刷新动画
    wx.startPullDownRefresh();
  },

  onShow() {
    // 每次显示页面都在后台静默拉取一次最新数据（不打断用户操作）
    this.getSquareData();
  },

  onPullDownRefresh() {
    this.getSquareData(() => {
      wx.stopPullDownRefresh(); 
    });
  },

  // 获取广场数据
  getSquareData(callback) {
    wx.showNavigationBarLoading(); 
    
    wx.cloud.callFunction({
      name: 'getSquareData', 
      success: res => {
        wx.hideNavigationBarLoading();
        const list = res.result.data || res.result;
        
        this.setData({ userList: list });
        if (callback) callback();
      },
      fail: err => {
        wx.hideNavigationBarLoading();
        console.error('获取广场数据失败', err);
        wx.showToast({ title: '加载失败', icon: 'none' });
        if (callback) callback();
      }
    })
  },

  // 点击卡片，跳转详情页
  viewUserSchedule(e) {
    const openid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/visit/visit?id=${openid}`,
      fail: (err) => {
        console.error("跳转失败", err);
        wx.showToast({ title: '页面不存在', icon: 'none' });
      }
    })
  }
})