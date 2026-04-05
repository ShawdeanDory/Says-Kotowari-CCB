// 必须引入工具类，才能调用 calculateMetrics 等函数
const { calculateMetrics } = require('../utils/gpa.js'); 

// 如果你还要用到云数据库，这一行也得有
const db = wx.cloud.database();

Page({
  data: {
    metrics: {
      totalGpa: '0.00',
      weightedAverage: '0.00'
    },
    grades: []
  },

  onShow() {
    this.fetchData();
  },

  // pages/index/index.js
// pages/index/index.js
// pages/index/index.js
fetchData() {
  wx.showLoading({ title: '拉取全部数据...' });
  
  // 核心：必须使用 wx.cloud.callFunction 才能突破 20 条限制
  wx.cloud.callFunction({
    name: 'getGrades', // 这里的名字必须和你的云函数文件夹名一模一样
    data: {}
  }).then(res => {
    wx.hideLoading();
    
    // 注意：云函数返回的结果在 res.result 里
    // 这里的 data 应该是你云函数 return 的那个数组
    const data = res.result.data || [];
    
    console.log('【云函数拉取成功】总条数:', data.length);

    if (data.length > 0) {
      const results = calculateMetrics(data);
      this.setData({
        grades: data,
        metrics: results
      });
    } else {
      this.setData({
        grades: [],
        metrics: { totalGpa: '0.00', weightedAverage: '0.00' }
      });
    }
  }).catch(err => {
    wx.hideLoading();
    console.error('云函数调用失败，回退到普通查询:', err);
    // 如果云函数调不通，作为兜底才执行之前的 db.collection...
  });
},goToAnalysis() {
  // 依然保留校验，没数据点进去也没意义
  if (!this.data.grades || this.data.grades.length === 0) {
    wx.showToast({
      title: '暂无数据可分析',
      icon: 'none'
    });
    return;
  }

  wx.navigateTo({
    url: '/pages/analysis/analysis'
  });
},
  // ✨ 精确删除功能
  deleteGrade(e) {
    const { id, name } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: `删除《${name}》？`,
      success: (res) => {
        if (res.confirm) {
          db.collection('grades').doc(id).remove().then(() => {
            wx.showToast({ title: '已删除' });
            // 删完立即重新拉取，确保同步
            this.fetchData(); 
          });
        }
      }
    });
  },
  goToAdd() {
    wx.navigateTo({
      url: '/pages/add/add', // 确保你的路径在 app.json 中已注册
    });
  },
  goToOCR() {
    wx.navigateTo({
      url: '/pages/ocr/ocr', // 确保这个页面在 app.json 中已注册
    });
  },
  // 顺便把另外两个常用的也补上，防止继续报错
  goToImport() {
    wx.navigateTo({
      url: '/pages/importgrade/importgrade', // 这是你放 Excel 导入逻辑的页面
    });
  },// 在 deleteGrade 函数后面添加
  // pages/index/index.js
  clearAllGrades() {
    if (this.data.grades.length === 0) return;

    wx.showModal({
      title: '确认清空',
      content: '这将彻底删除您的所有历史导入记录',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '清空中...' });

          // 批量删除当前用户的所有数据
          // 注意：小程序端 remove() 只能根据 ID 删，所以需要循环
          const promiseArr = this.data.grades.map(item => {
            return db.collection('grades').doc(item._id).remove();
          });

          Promise.all(promiseArr).then(() => {
            wx.hideLoading();
            // 重点：强制重置本地 data，让页面立刻变白
            this.setData({
              grades: [],
              metrics: {
                totalGpa: '0.00',
                weightedAverage: '0.00'
              }
            });
            wx.showToast({ title: '清理完成', icon: 'success' });
          }).catch(err => {
            console.error('清空失败:', err);
            wx.hideLoading();
            // 如果报错，通常是因为没权限删旧数据，刷新一下
            this.fetchData(); 
          });
        }
      }
    });
  },

  goToAnalysis() {
    wx.navigateTo({
      url: '/pages/analysis/analysis',
    });
  }
});