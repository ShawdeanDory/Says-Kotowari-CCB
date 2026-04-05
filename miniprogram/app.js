App({
  onLaunch: function () {
    // 1. 初始化云开发环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-5g2co8aca3d5366b', 
        traceUser: true,
      });
    }

    // 2. 初始化全局数据（先给个空对象，防止下面赋值失败）
    this.globalData = {
      userInfo: null
    };

    // 3. 【双重保险】第一层：从小程序本地缓存恢复
    const savedName = wx.getStorageSync('userNickName');
    const savedAvatar = wx.getStorageSync('userAvatar');
    
    if (savedName) {
      this.globalData.userInfo = {
        nickName: savedName,
        avatarUrl: savedAvatar || ''
      };
      console.log('从缓存找回昵称:', savedName);
    }

    // 4. 【双重保险】第二层：尝试从云端数据库找回（防止清理了缓存）
    this.fetchUserInfoFromCloud();
  },

  // 从云端数据库同步最新的用户信息
  fetchUserInfoFromCloud: function() {
    const db = wx.cloud.database();
    // 这里的 where 不传 openid 也会自动过滤当前用户的数据
    db.collection('timetables').limit(1).get().then(res => {
      if (res.data.length > 0 && res.data[0].userInfo) {
        const cloudInfo = res.data[0].userInfo;
        // 如果云端有数据，覆盖本地内存和缓存
        this.globalData.userInfo = cloudInfo;
        wx.setStorageSync('userNickName', cloudInfo.nickName);
        if (cloudInfo.avatarUrl) {
          wx.setStorageSync('userAvatar', cloudInfo.avatarUrl);
        }
        console.log('从云端同步最新昵称:', cloudInfo.nickName);
      }
    }).catch(err => {
      console.error('云端同步失败', err);
    });
  },

  // 定义全局数据对象
  globalData: {
    userInfo: null
  }
})