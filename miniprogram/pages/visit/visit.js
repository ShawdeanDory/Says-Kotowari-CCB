// pages/visit/visit.js
const db = wx.cloud.database()
const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSIjZWVlIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIvPjxwYXRoIGZpbGw9IiNjY2MiIGQ9Ik01MCA2MGMtMTMuNSAwLTI1IDYuNS0zMCAxNi41VjkwYzAgMyAyLjUgNSA1IDVoNTBjMi41IDAgNS0yIDUtNXYtMTMuNUM4MCA2Ni41IDY4LjUgNjAgNTAgNjB6TTUwIDI1YTE1IDE1IDAgMSAwIDAgMzAgMTUgMTUgMCAwIDAgMC0zMHoiLz48L3N2Zz4=';

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
    targetUserInfo: null,
    allCourses: [],   // 原始全部课程，不过滤
    courses: [],      // 当前显示的课程（按周过滤后）
    defaultAvatar,
    currentWeek: 1,
    displayWeek: 1,
    _touchStartX: 0,
  },

  onLoad(options) {
    const week = calcCurrentWeek();
    this.setData({ currentWeek: week, displayWeek: week });
    
    // 改为接收 name 参数
    if (options.name) {
      const targetName = decodeURIComponent(options.name);
      this.loadTargetSchedule(targetName);
    }
  },
  loadTargetSchedule(targetName) {
    wx.showLoading({ title: '加载中...' });
    
    // 【核心修改】：不再按 _openid 查，按昵称查！
    db.collection('timetables').where({ 
      'userInfo.nickName': targetName 
    }).get().then(res => {
      wx.hideLoading();
      if (res.data.length > 0) {
        const data = res.data[0];
        // 过滤掉周末
        const all = (data.courses || []).filter(item => {
          const day = Number(item.day) || 1;
          return day >= 1 && day <= 5;
        });
        this.setData({ 
          allCourses: all, 
          targetUserInfo: data.userInfo 
        });
        this.filterCourses();
        this.updateTitle();
      }
    }).catch(err => {
      wx.hideLoading();
      console.error("查询失败", err);
    });
  },

  // 按 displayWeek 过滤
  filterCourses() {
    const displayWeek = this.data.displayWeek;
    const filtered = this.data.allCourses.filter(item => {
      const { start, end } = parseWeeks(item.weeks);
      return displayWeek >= start && displayWeek <= end;
    });
    this.setData({ courses: filtered });
  },

  updateTitle() {
    const name = this.data.targetUserInfo && this.data.targetUserInfo.nickName;
    if (name) {
      wx.setNavigationBarTitle({ title: `${name}的课表（第${this.data.displayWeek}周）` });
    }
  },

  // ← 上一周
  prevWeek() {
    const w = this.data.displayWeek;
    if (w <= 1) return;
    this.setData({ displayWeek: w - 1 }, () => {
      this.filterCourses();
      this.updateTitle();
    });
  },

  // → 下一周
  nextWeek() {
    const w = this.data.displayWeek;
    this.setData({ displayWeek: w + 1 }, () => {
      this.filterCourses();
      this.updateTitle();
    });
  },

  // 手势开始
  onTouchStart(e) {
    this.data._touchStartX = e.touches[0].clientX;
  },

  // 手势结束
  onTouchEnd(e) {
    const delta = e.changedTouches[0].clientX - this.data._touchStartX;
    if (Math.abs(delta) < 50) return;
    if (delta < 0) this.nextWeek();
    else this.prevWeek();
  },

  showCourseDetail(e) {
    const item = e.currentTarget.dataset.item;
    let room = (item.room || '未填').replace(/\s/g, ' ');
    let teacher = (item.teacher || '未填').replace(/\s/g, ' ');
    let weeks = (item.weeks || '全周').replace(/\s/g, ' ');
    wx.showModal({
      title: item.name,
      content: `📍 地点：${room}\n👤 老师：${teacher}\n📅 周数：${weeks}`,
      showCancel: false
    });
  },

  goBack() {
    wx.navigateBack();
  }
})