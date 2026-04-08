// pages/lesson/lesson.js
const app = getApp()
const db = wx.cloud.database()

const defaultAvatarBase64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSIjZWVlIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIvPjxwYXRoIGZpbGw9IiNjY2MiIGQ9Ik01MCA2MGMtMTMuNSAwLTI1IDYuNS0zMCAxNi41VjkwYzAgMyAyLjUgNSA1IDVoNTBjMi41IDAgNS0yIDUtNXYtMTMuNUM4MCA2Ni41IDY4LjUgNjAgNTAgNjB6TTUwIDI1YTE1IDE1IDAgMSAwIDAgMzAgMTUgMTUgMCAwIDAgMC0zMHoiLz48L3N2Zz4=';

const SEMESTER_START = new Date(2026, 2, 2); // 2026-03-02

function calcCurrentWeek() {
  const now = new Date();
  const diffMs = now - SEMESTER_START;
  if (diffMs < 0) return 1;
  return Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;
}

function parseWeeks(weeksStr) {
  if (!weeksStr) return { start: 1, end: 99 };
  const match = weeksStr.match(/(\d+)-(\d+)/);
  if (match) return { start: parseInt(match[1]), end: parseInt(match[2]) };
  const single = weeksStr.match(/(\d+)/);
  if (single) { const w = parseInt(single[1]); return { start: w, end: w }; }
  return { start: 1, end: 99 };
}

Page({
  data: {
    defaultAvatar: defaultAvatarBase64,
    userInfo: { nickName: '', avatarUrl: '' },
    myCourses: [],
    rawCourses: [],
    todayIndex: -1,
    currentMonth: 1,
    currentWeek: 1,  // 真实当前周，用于"本周"标记
    displayWeek: 1,  // 当前显示的周，可切换
    headerPaddingTop: 88,
    _touchStartX: 0,
  },

  onLoad: function () {
    
    try {
      const menuButton = wx.getMenuButtonBoundingClientRect();
      this.setData({ headerPaddingTop: menuButton.bottom + 12 });
    } catch (e) { }
    if (app.globalData.userInfo) {
      this.setData({ userInfo: app.globalData.userInfo });
    }
  },

  onShow: function () {
    this.calcDate();
    this.loadMySchedule();
  },

  calcDate() {
    const now = new Date();
    const day = now.getDay();
    const week = calcCurrentWeek();
    this.setData({
      currentMonth: now.getMonth() + 1,
      currentWeek: week,
      displayWeek: week, // 每次进入重置为当前周
      todayIndex: (day === 0 || day === 6) ? -1 : day - 1
    });
  },

  // ← 上一周
  prevWeek() {
    const w = this.data.displayWeek;
    if (w <= 1) return;
    this.setData({ displayWeek: w - 1 }, () => this.filterCourses());
  },

  // → 下一周
  nextWeek() {
    const w = this.data.displayWeek;
    this.setData({ displayWeek: w + 1 }, () => this.filterCourses());
  },

  // 手势开始
  onTouchStart(e) {
    this.data._touchStartX = e.touches[0].clientX;
  },

  // 手势结束，判断方向
  onTouchEnd(e) {
    const delta = e.changedTouches[0].clientX - this.data._touchStartX;
    if (Math.abs(delta) < 50) return;
    if (delta < 0) this.nextWeek(); // 左滑 → 下一周
    else this.prevWeek();           // 右滑 → 上一周
  },

  goToImport() {
    const url = '/pages/import/import';
    wx.switchTab({ url, fail: () => wx.navigateTo({ url }) })
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({ 'userInfo.avatarUrl': avatarUrl });
    wx.showLoading({ title: '上传头像...' });
    const cloudPath = 'avatars/' + Date.now() + '-' + Math.floor(Math.random() * 1000) + '.png';
    wx.cloud.uploadFile({
      cloudPath,
      filePath: avatarUrl,
      success: res => {
        const newUserInfo = { ...this.data.userInfo, avatarUrl: res.fileID };
        this.setData({ userInfo: newUserInfo });
        app.globalData.userInfo = newUserInfo;
        this.syncUserInfoToCloud();
      },
      fail: () => { wx.hideLoading(); wx.showToast({ title: '头像上传失败', icon: 'none' }); }
    })
  },

  onNameInput(e) { this.setData({ 'userInfo.nickName': e.detail.value }); },

  onNameChange(e) {
    const name = e.detail.value;
    if (!name) return;
    const newUserInfo = { ...this.data.userInfo, nickName: name };
    this.setData({ userInfo: newUserInfo });
    app.globalData.userInfo = newUserInfo;
    this.syncUserInfoToCloud();
  },

  syncUserInfoToCloud() {
    if (!this.data.rawCourses || this.data.rawCourses.length === 0) {
      wx.hideLoading(); return;
    }
    wx.cloud.callFunction({
      name: 'saveSchedule',
      data: { courses: this.data.rawCourses, userInfo: this.data.userInfo, isPublic: true },
      success: () => { wx.hideLoading(); wx.showToast({ title: '已同步全局', icon: 'success' }); },
      fail: err => { wx.hideLoading(); console.error('同步失败', err); }
    })
  },
  loadMySchedule() {
    const myNickName = this.data.userInfo.nickName;
    if (!myNickName) return; // 如果没昵称，没法自动认领

    wx.showLoading({ title: '同步身份中...' });

    // 1. 先尝试用当前环境的 OpenID 查
    db.collection('timetables').where({ _openid: '{openid}' }).get().then(res => {
      if (res.data.length > 0) {
        // A. 已经绑定过了，直接显示
        this.renderTimetable(res.data[0]);
      } else {
        // B. 没找到绑定记录，尝试通过【昵称】进行“全量认领”
        return db.collection('timetables').limit(50).get().then(allRes => {
          const myRecord = allRes.data.find(item => item.userInfo && item.userInfo.nickName === myNickName);
          
          if (myRecord) {
            console.log("检测到未绑定的课表，正在自动关联当前 ID...");
            // 【关键步骤】：调用云函数或直接更新，把当前的 OpenID 关联上去
            // 这里我们直接把数据取出来渲染，并提示用户重新保存一次即可
            this.renderTimetable(myRecord);
            wx.showToast({ title: '身份已自动同步', icon: 'success' });
          } else {
            wx.showToast({ title: '未找到您的课表', icon: 'none' });
          }
        });
      }
    }).catch(err => {
      console.error("同步失败", err);
      wx.hideLoading();
    });
  },

  // 抽离出来的渲染函数
  renderTimetable(record) {
    wx.hideLoading();
    this.setData({
      rawCourses: record.courses || []
    }, () => {
      this.filterCourses();
    });
  },

  // 按 displayWeek 过滤，切换周时直接调用，无需重新请求
  filterCourses() {
    const displayWeek = this.data.displayWeek;
    const processed = this.data.rawCourses
      .filter(item => {
        const day = Number(item.day) || 1;
        if (day < 1 || day > 5) return false;
        const { start, end } = parseWeeks(item.weeks);
        return displayWeek >= start && displayWeek <= end;
      })
      .map(item => {
        const day = Number(item.day) || 1;
        const start = Number(item.start) || 1;
        const step = Number(item.step) || 2;
        const color = item.color || '#8d99ae';
        const left = (day - 1) * 100 / 5;
        const top = (start - 1) * 110 + 6;
        const height = step * 110 - 12;
        item.styleString = `left:${left}%; top:${top}rpx; height:${height}rpx; background-color:${color}; display:flex; visibility:visible;`;
        return item;
      });
    this.setData({ myCourses: processed });
  },

  showCourseDetail(e) {
    const item = e.currentTarget.dataset.item;
    if (!item) return;
    wx.showModal({
      title: item.name,
      content: `📍 ${item.room || '未知'}\n👤 ${item.teacher || '未知'}\n📅 ${item.weeks || '全周'}`,
      showCancel: false, confirmColor: '#6c5ce7'
    });
  },

  onPullDownRefresh() {
    this.loadMySchedule();
    setTimeout(() => wx.stopPullDownRefresh(), 1000);
  }
})
