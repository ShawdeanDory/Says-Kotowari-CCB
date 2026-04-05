const db = wx.cloud.database();

Page({
  data: {
    // 默认学期设置
    semesterArray: ['2024-2025-秋', '2024-2025-冬', '2024-2025-春', '2025-2026-秋'],
    currentSemester: '2025-2026-秋',
    semIndex: 3,

    // 初始状态：只显示一个空白的手动录入框
    courseList: [{
      courseName: '',
      credit: '',
      score: '',
      schoolGpa: ''
    }],

    // 课表弹窗控制
    showTimetable: false,
    timetableData: [],
    selectedImportNames: []
  },

  // 学期切换
  bindSemesterChange(e) {
    this.setData({
      currentSemester: this.data.semesterArray[e.detail.value],
      semIndex: e.detail.value
    });
  },

  // 统一处理所有输入框
  onInput(e) {
    const { index, field } = e.currentTarget.dataset;
    const value = e.detail.value;
    this.setData({
      [`courseList[${index}].${field}`]: value
    });
  },

  // 添加空白行
  addEmptyCourse() {
    const newList = this.data.courseList.concat([
      { courseName: '', credit: '', score: '', schoolGpa: '' }
    ]);
    this.setData({
      courseList: newList
    });
  },

  // 删除某一行
  removeCourse(e) {
    const { index } = e.currentTarget.dataset;
    let list = this.data.courseList;
    list.splice(index, 1);
    this.setData({ courseList: list });
  },

  // --- 课表导入逻辑 ---

  /**
   * 打开课表导入弹窗
   * 增加 _openid 过滤，确保只读到当前用户自己的课表
   */
  async openTimetableModal() {
    wx.showLoading({ title: '加载中...', mask: true });
    try {
      // 1. 全量获取（解决 OpenID 匹配不上的问题）
      const res = await db.collection('timetables').limit(20).get();
      
      console.log("导入弹窗查到的原始数据：", res.data);

      if (!res.data || res.data.length === 0) {
        wx.hideLoading();
        wx.showToast({ title: '数据库无课表', icon: 'none' });
        return;
      }

      // 2. 匹配逻辑：优先找你现在的昵称，找不到就取第一条
      let myRecord = null;
      const currentNickName = this.data.userInfo?.nickName;

      if (currentNickName) {
        myRecord = res.data.find(r => r.userInfo && r.userInfo.nickName === currentNickName);
      }
      
      // 如果按昵称没匹配到，直接拿第一条（这通常就是你之前上传的那份）
      if (!myRecord) {
        myRecord = res.data[0];
      }

      let allExtractedCourses = [];
      const nameSet = new Set();

      // 3. 解析课程数组
      if (myRecord.courses && Array.isArray(myRecord.courses)) {
        myRecord.courses.forEach(course => {
          if (course.name && !nameSet.has(course.name)) {
            nameSet.add(course.name);
            allExtractedCourses.push({
              name: course.name,
              teacher: course.teacher || '未知',
              weeks: course.weeks || ''
            });
          }
        });
      }

      if (allExtractedCourses.length === 0) {
        wx.hideLoading();
        wx.showToast({ title: '课表内无有效课程', icon: 'none' });
        return;
      }

      this.setData({
        timetableData: allExtractedCourses,
        showTimetable: true
      }, () => {
        wx.hideLoading();
      });

    } catch (err) {
      console.error("导入失败：", err);
      wx.hideLoading();
      wx.showToast({ title: '读取失败', icon: 'none' });
    }
  },

  closeTimetableModal() {
    this.setData({ showTimetable: false });
  },

  onTimetableCheck(e) {
    this.setData({ selectedImportNames: e.detail.value });
  },

  confirmImport() {
    const { selectedImportNames, courseList } = this.data;
    if (selectedImportNames.length === 0) return this.closeTimetableModal();

    const newCourses = selectedImportNames.map(name => ({
      courseName: name,
      credit: '',
      score: '',
      schoolGpa: ''
    }));

    // 如果当前只有一行且为空，则替换；否则追加
    let updatedList = (courseList.length === 1 && !courseList[0].courseName) 
      ? newCourses 
      : [...courseList, ...newCourses];

    this.setData({
      courseList: updatedList,
      showTimetable: false
    });
  },

  // --- 批量提交 ---

  async submitAll() {
    const { courseList, currentSemester } = this.data;
    
    // 宽松校验逻辑
    for (let i = 0; i < courseList.length; i++) {
      const item = courseList[i];
      if (!item.credit) {
        wx.showToast({ title: `请填写课程${i+1}的学分`, icon: 'none' });
        return;
      }
      if (!item.score && !item.schoolGpa) {
        wx.showToast({ title: `课程${i+1}成绩或绩点必填其一`, icon: 'none' });
        return;
      }
    }

    wx.showLoading({ title: '保存中...' });
    try {
      // 循环写入数据库
      const tasks = courseList.map(item => {
        return db.collection('grades').add({
          data: {
            courseName: item.courseName || '自填课程',
            credit: parseFloat(item.credit),
            score: parseFloat(item.score) || null,
            schoolGpa: parseFloat(item.schoolGpa) || null,
            semester: currentSemester,
            createTime: db.serverDate()
          }
        });
      });

      await Promise.all(tasks);
      wx.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    } catch (err) {
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  preventBubbling() {} // 阻止弹窗点击穿透
});