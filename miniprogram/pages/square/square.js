// pages/square/square.js
const defaultAvatarBase64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSIjZWVlIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIvPjxwYXRoIGZpbGw9IiNjY2MiIGQ9Ik01MCA2MGMtMTMuNSAwLTI1IDYuNS0zMCAxNi41VjkwYzAgMyAyLjUgNSA1IDVoNTBjMi41IDAgNS0yIDUtNXYtMTMuNUM4MCA2Ni41IDY4LjUgNjAgNTAgNjB6TTUwIDI1YTE1IDE1IDAgMSAwIDAgMzAgMTUgMTUgMCAwIDAgMC0zMHoiLz48L3N2Zz4=';

// ★ 开学第一周周一的日期（2026年3月2日）
const SEMESTER_START = new Date(2026, 2, 2);

function calcCurrentWeek() {
  const now = new Date();
  const diffMs = now - SEMESTER_START;
  if (diffMs < 0) return 1;
  return Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;
}

Page({
  data: {
    userList: [],
    defaultAvatar: defaultAvatarBase64,
    currentWeek: 1   // ★ 新增：当前教学周
  },

  onLoad() {
    // ★ 计算当前周
    this.setData({ currentWeek: calcCurrentWeek() });
    wx.startPullDownRefresh();
  },

  onShow() {
    // 每次显示都更新周数（跨周后重新进入会刷新）
    this.setData({ currentWeek: calcCurrentWeek() });
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
  // pages/square/square.js
viewUserSchedule(e) {
  const nickName = e.currentTarget.dataset.name; // 改为获取 name
  wx.navigateTo({
    url: `/pages/visit/visit?name=${encodeURIComponent(nickName)}`, // 传 name，记得编码
  })
}
})