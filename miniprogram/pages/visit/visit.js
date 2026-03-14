const db = wx.cloud.database()
const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSIjZWVlIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIvPjxwYXRoIGZpbGw9IiNjY2MiIGQ9Ik01MCA2MGMtMTMuNSAwLTI1IDYuNS0zMCAxNi41VjkwYzAgMyAyLjUgNSA1IDVoNTBjMi41IDAgNS0yIDUtNXYtMTMuNUM4MCA2Ni41IDY4LjUgNjAgNTAgNjB6TTUwIDI1YTE1IDE1IDAgMSAwIDAgMzAgMTUgMTUgMCAwIDAgMC0zMHoiLz48L3N2Zz4=';

Page({
  data: {
    targetUserInfo: null,
    courses: [],
    defaultAvatar: defaultAvatar
  },

  onLoad(options) {
    if (options.id) {
      this.loadTargetSchedule(options.id);
    }
  },

  loadTargetSchedule(targetId) {
    wx.showLoading({ title: '加载中...' });
    db.collection('timetables').where({ _openid: targetId }).get().then(res => {
      wx.hideLoading();
      if (res.data.length > 0) {
        const data = res.data[0];
        
        // 过滤周一到周五
        const filtered = (data.courses || []).filter(item => {
          return item.day >= 1 && item.day <= 5;
        });

        this.setData({
          targetUserInfo: data.userInfo,
          courses: filtered
        });
        wx.setNavigationBarTitle({ title: `${data.userInfo.nickName}的课表` });
      }
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },

  showCourseDetail(e) {
    const item = e.currentTarget.dataset.item;
    
    // 清理可能存在的异常空格，并构建字符串
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