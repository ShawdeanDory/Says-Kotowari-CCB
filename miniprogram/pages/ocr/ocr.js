const db = wx.cloud.database();

Page({
  data: {
    tempList: [] // OCR 识别后待确认的列表
  },
  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: (res) => {
        this.processOCR(res.tempFiles[0].tempFilePath);
      }
    });
  },
  processOCR(filePath) {
    wx.showLoading({ title: 'AI 识别中' });
    
    // MVP 阶段：调用微信服务市场的通用印刷体识别（需在小程序后台添加插件/购买服务）
    // 此处使用 wx.serviceMarket.invokeService 作为标准实现范例
    wx.getFileSystemManager().readFile({
      filePath: filePath,
      encoding: 'base64',
      success: res => {
        wx.cloud.callFunction({
          name: 'ocrParse', // 调用下文的云函数
          data: { imgBase64: res.data }
        }).then(cloudRes => {
          wx.hideLoading();
          // 假设云函数已经清洗好了数据结构
          const parsedData = cloudRes.result.data || [];
          this.setData({ tempList: parsedData });
        }).catch(err => {
          wx.hideLoading();
          wx.showToast({ title: '识别失败，请重试', icon: 'none' });
        });
      }
    });
  },
  // 异常数据容错与修改
  modifyItem(e) {
    const { index, field } = e.currentTarget.dataset;
    const value = e.detail.value;
    const key = `tempList[${index}].${field}`;
    this.setData({ [key]: value });
  },
  batchSave() {
    wx.showLoading({ title: '批量存入中' });
    // 云数据库批量写入需要在云函数中进行，或前端循环添加
    const tasks = this.data.tempList.map(item => {
      return db.collection('grades').add({
        data: {
          ...item,
          score: Number(item.score),
          credit: Number(item.credit),
          countInGpa: true,
          createdAt: db.serverDate()
        }
      });
    });

    Promise.all(tasks).then(() => {
      wx.hideLoading();
      wx.showToast({ title: '导入成功' });
      setTimeout(() => wx.navigateBack(), 1000);
    });
  }
});