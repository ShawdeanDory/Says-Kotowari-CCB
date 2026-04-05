const db = wx.cloud.database();

Page({
  // 1. 触发选择文件
  goToImport() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['xlsx', 'xls', 'csv'],
      success: (res) => {
        this.uploadFile(res.tempFiles[0].path);
      },
      fail: () => { console.log('取消选择'); }
    });
  },

  // 2. 上传至云存储
  uploadFile(path) {
    wx.showLoading({ title: '上传文件中...' });
    const cloudPath = `temp/${Date.now()}.xlsx`;
    
    wx.cloud.uploadFile({
      cloudPath,
      filePath: path,
      success: res => {
        this.parseFile(res.fileID);
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({ title: '上传失败', icon: 'none' });
      }
    });
  },

  // 3. 调用云函数解析
  parseFile(fileID) {
    wx.showLoading({ title: '云端解析中...' });
    wx.cloud.callFunction({
      name: 'parseExcel',
      data: { fileID },
      success: res => {
        if (res.result && res.result.code === 0) {
          this.saveToDB(res.result.data);
        } else {
          wx.hideLoading();
          wx.showToast({ title: '解析失败，检查表头', icon: 'none' });
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({ title: '云函数调用失败', icon: 'none' });
      }
    });
  },

  async saveToDB(list) {
    if (!list || list.length === 0) return;
    wx.showLoading({ title: `正在写入(${list.length}门)...` });
    const db = wx.cloud.database();

    try {
      const tasks = [];
      
      for (let item of list) {
        // 1. 获取你 Console 里打印出来的那个 7 位数组
        const values = Object.values(item).map(v => v ? v.toString().trim() : "");
        
        // 2. 根据你的日志，直接按位置抓取
        let courseName = values[0];
        let credit = parseFloat(values[2]) || 0;
        let schoolGpa = parseFloat(values[3]) || 0;
        let semester = values[4] || "2025-2026-秋";

        // 3. 关键：解决“成绩”为空的问题
        // 尝试从原始 item 对象中通过 Key 找“成绩”，如果还是没有，就用绩点转换
        let score = "";
        
        // 扫描原始对象的每一个键值对，寻找真正含有 91, 92 的那个格子
        for (let key in item) {
          const val = item[key] ? item[key].toString().trim() : "";
          const n = parseFloat(val);
          // 只要这个值在 60-100 之间，或者它是 A-, B+ 等，就认定它是成绩
          if ((n >= 60 && n <= 100) || /^[A-F][+-]?$/.test(val)) {
            score = val;
            break; 
          }
        }

        // 4. 如果还是没抓到成绩，就拿绩点顶替（或者根据绩点反推）
        if (!score || score === "0") {
          score = schoolGpa > 0 ? schoolGpa.toString() : "";
        }

        // 5. 只要有课程名就存入
        if (courseName && courseName !== "课程名称" && courseName !== "undefined") {
          tasks.push(db.collection('grades').add({
            data: {
              courseName: courseName,
              score: score,               // 蓝色大字显示
              schoolGpa: schoolGpa,       // 顶部计算用
              credit: credit,
              semester: semester,
              countInGpa: true,
              createdAt: db.serverDate()
            }
          }));
        }
      }

      if (tasks.length === 0) {
        wx.hideLoading();
        return wx.showToast({ title: '数据解析为空', icon: 'none' });
      }

      await Promise.all(tasks);
      wx.hideLoading();
      wx.showToast({ title: '导入成功', icon: 'success' });
      setTimeout(() => { wx.navigateBack(); }, 1500);

    } catch (e) {
      console.error("写入失败:", e);
      wx.hideLoading();
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },
  goBack() {
    wx.navigateBack({
      delta: 1})
  },
});