// pages/lesson/lesson.js
const app = getApp()
const db = wx.cloud.database()

const defaultAvatarBase64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSIjZWVlIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIvPjxwYXRoIGZpbGw9IiNjY2MiIGQ9Ik01MCA2MGMtMTMuNSAwLTI1IDYuNS0zMCAxNi41VjkwYzAgMyAyLjUgNSA1IDVoNTBjMi41IDAgNS0yIDUtNXYtMTMuNUM4MCA2Ni41IDY4LjUgNjAgNTAgNjB6TTUwIDI1YTE1IDE1IDAgMSAwIDAgMzAgMTUgMTUgMCAwIDAgMC0zMHoiLz48L3N2Zz4=';

Page({
  data: {
    defaultAvatar: defaultAvatarBase64,
    userInfo: { nickName: '', avatarUrl: '' }, // 初始化为空对象
    myCourses: [], // 原始课程数据
    rawCourses: [], // 用于回传给后端的原始数据(无styleString)
    todayIndex: -1,
    currentMonth: 1,
    headerPaddingTop: 88
  },

  onLoad: function() {
    // 胶囊位置计算
    try {
      const menuButton = wx.getMenuButtonBoundingClientRect();
      this.setData({ headerPaddingTop: menuButton.bottom + 12 });
    } catch (e) { }

    // 如果全局有数据，先显示全局的
    if (app.globalData.userInfo) {
      this.setData({ userInfo: app.globalData.userInfo });
    }
  },

  onShow: function () {
    this.calcDate();
    this.loadMySchedule(); // 每次进来都拉取最新数据
  },

  calcDate() {
    const now = new Date();
    const day = now.getDay();
    this.setData({ 
      currentMonth: now.getMonth() + 1, 
      // 周六(6)和周日(0)不亮起任何高亮指示，周一到周五(1-5)对应索引(0-4)
      todayIndex: (day === 0 || day === 6) ? -1 : day - 1 
    });
  },

  goToImport() {
    const url = '/pages/import/import';
    wx.switchTab({ url, fail: () => wx.navigateTo({ url }) })
  },

  // 1. 修改头像
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({ 'userInfo.avatarUrl': avatarUrl }); // 本地秒变
    
    wx.showLoading({ title: '上传头像...' });
    const cloudPath = 'avatars/' + Date.now() + '-' + Math.floor(Math.random()*1000) + '.png';
    
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: avatarUrl,
      success: res => {
        const fileID = res.fileID;
        console.log('头像云ID:', fileID);

        // 更新数据源
        const newUserInfo = { ...this.data.userInfo, avatarUrl: fileID };
        this.setData({ userInfo: newUserInfo });
        app.globalData.userInfo = newUserInfo; // 同步全局

        // ★★★ 关键一步：上传成功后，立刻同步到数据库，这样广场才能看到 ★★★
        this.syncUserInfoToCloud();
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '头像上传失败', icon: 'none' });
      }
    })
  },

  // 2. 修改昵称 (输入过程中实时更新本地)
  onNameInput(e) {
    this.setData({ 'userInfo.nickName': e.detail.value });
  },

  // 3. 修改昵称完成 (失去焦点时，同步到云端)
  onNameChange(e) {
    const name = e.detail.value;
    if (!name) return; // 名字为空不保存
    
    const newUserInfo = { ...this.data.userInfo, nickName: name };
    this.setData({ userInfo: newUserInfo });
    app.globalData.userInfo = newUserInfo;
    
    // ★★★ 关键一步：同步到数据库 ★★★
    this.syncUserInfoToCloud();
  },

  // 【核心函数】将最新的头像/昵称同步到云数据库
  syncUserInfoToCloud() {
    // 只有当有课程数据时，才值得同步到 timetables 表
    if (!this.data.rawCourses || this.data.rawCourses.length === 0) {
      wx.hideLoading();
      return;
    }

    // 调用之前的 saveSchedule 云函数，它会更新 userInfo 字段
    wx.cloud.callFunction({
      name: 'saveSchedule',
      data: {
        courses: this.data.rawCourses, // 把当前的课表带上，防止被覆盖为空
        userInfo: this.data.userInfo,  // 最新的头像和昵称
        isPublic: true // 默认保持公开，或者你需要这里读取之前的设置
      },
      success: res => {
        wx.hideLoading();
        wx.showToast({ title: '已同步全局', icon: 'success' });
        console.log('用户信息已同步到云端');
      },
      fail: err => {
        wx.hideLoading();
        console.error('同步失败', err);
      }
    })
  },
  loadMySchedule() {
    db.collection('timetables').where({ _openid: '{openid}' }).get().then(res => {
      if (res.data.length > 0) {
        const record = res.data[0];
        const rawCourses = record.courses || [];
        
        this.setData({ rawCourses: rawCourses });

        if (!this.data.userInfo.nickName && record.userInfo) {
          this.setData({ userInfo: record.userInfo });
          app.globalData.userInfo = record.userInfo;
        }

        // ★ 修改点1：过滤掉周末的课，并重新计算 left 偏移量
        const processed = rawCourses
          .filter(item => {
            const day = Number(item.day) || 1;
            return day >= 1 && day <= 5; // 仅保留周一到周五
          })
          .map(item => {
            const day = Number(item.day) || 1;
            const start = Number(item.start) || 1;
            const step = Number(item.step) || 2;
            const color = item.color || '#8d99ae';
            
            // 把原来的 100 / 7 改成 100 / 5，把屏幕平分为5份
            const left = (day - 1) * 100 / 5;
            const top = (start - 1) * 110 + 6;
            const height = step * 110 - 12;
            item.styleString = `left:${left}%; top:${top}rpx; height:${height}rpx; background-color:${color}; display:flex; visibility:visible;`;
            return item;
        });

        this.setData({ myCourses: processed });
      }
    })
  },

  showCourseDetail(e) {
    const item = e.currentTarget.dataset.item;
    if(!item) return;
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