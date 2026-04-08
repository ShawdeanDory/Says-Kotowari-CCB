// pages/calculate/calculate.js
const { calculateMetrics } = require('../utils/gpa.js');
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

  fetchData() {
    wx.showLoading({ title: '拉取数据中...' });

    wx.cloud.callFunction({
      name: 'getGrades',
      data: {}
    }).then(res => {
      wx.hideLoading();
      const data = res.result.data || [];
      console.log('【云函数】总条数:', data.length);

      if (data.length > 0) {
        const results = calculateMetrics(data);
        this.setData({ grades: data, metrics: results });
      } else {
        this.setData({
          grades: [],
          metrics: { totalGpa: '0.00', weightedAverage: '0.00' }
        });
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('云函数调用失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },

  // ★ 修复：只保留一个 goToAnalysis，并带空数据校验
  goToAnalysis() {
    if (!this.data.grades || this.data.grades.length === 0) {
      wx.showToast({ title: '暂无数据可分析', icon: 'none' });
      return;
    }
    wx.navigateTo({ url: '/pages/analysis/analysis' });
  },

  deleteGrade(e) {
    const { id, name } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: `删除《${name}》？`,
      success: (res) => {
        if (res.confirm) {
          db.collection('grades').doc(id).remove().then(() => {
            wx.showToast({ title: '已删除' });
            this.fetchData();
          });
        }
      }
    });
  },

  goToAdd() {
    wx.navigateTo({ url: '/pages/add/add' });
  },

  goToOCR() {
    wx.navigateTo({ url: '/pages/ocr/ocr' });
  },

  goToImport() {
    wx.navigateTo({ url: '/pages/importgrade/importgrade' });
  },

  clearAllGrades() {
    if (this.data.grades.length === 0) return;

    wx.showModal({
      title: '确认清空',
      content: '这将彻底删除您的所有历史导入记录',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '清空中...' });
          const promiseArr = this.data.grades.map(item =>
            db.collection('grades').doc(item._id).remove()
          );
          Promise.all(promiseArr).then(() => {
            wx.hideLoading();
            this.setData({
              grades: [],
              metrics: { totalGpa: '0.00', weightedAverage: '0.00' }
            });
            wx.showToast({ title: '清理完成', icon: 'success' });
          }).catch(err => {
            console.error('清空失败:', err);
            wx.hideLoading();
            this.fetchData();
          });
        }
      }
    });
  }
});
