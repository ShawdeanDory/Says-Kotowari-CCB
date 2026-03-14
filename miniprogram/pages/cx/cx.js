// index.js
Page({
    data: {
     items:['错过是因为对美好的事物没有感知力','被你改变的那部分我，代替你陪我走下去','暧昧的代价是抓不住爱','下一次 说什么也不会轻易让你走','依赖不是爱','Love you partner','我把所有烦恼不快归结于你不在我身边','你说今天得扮鬼我说可爱鬼无需扮鬼👻','如果爱的代价是失控那我的世界愿为你疯狂','有我们的瞬间最接近永恒','你总说着未来 但我却忙着记住当下每一天','你难过却仍心系我的样子骗不了人','反复询问的意思其实是想奢求你更多的爱','Never has a person who made me so worried about how long she could stay by my side','ooooóooo','对你和猫毛都没有抵抗力呢','少了一张 是有你的冬天❄️','没有你和你们的新年算不上快乐','随心所欲','无论我长大多少在你们面前都可以是小孩❤','在我眼里我很好，但在你眼里我更好','我的眼睛有星星和你爱我的心','情人节只许和小情人过[呲牙]'],
      mergedCourses: []
    },
  
    onLoad() {
      this.initCurrentWeekday();
      this.startAutoUpdate();
      this.mergeCourses();
    },
    onLoad: function () {
        const today = new Date().getDay(); // 获取当前星期几
        if (1) { // 如果是星期四
            const items = this.data.items;
            const randomIndex = Math.floor(Math.random() * items.length);
            const randomItem = items[randomIndex];
            this.setData({
                randomItem: randomItem,
                isThursday: true
            });
        }
    },
    onUnload() {
      this.stopAutoUpdate();
    },
  
    initCurrentWeekday() {
      const date = new Date();
      const weekday = date.getDay() || 7;
      const systemWeekday = weekday <= 5 ? weekday : 1;
      this.setData({
        selectedWeekday: systemWeekday,
        originalWeekday: systemWeekday
      }, this.updateWeekdayMarker);
    },
  
    updateWeekdayMarker() {
      const weekdays = this.data.weekdays.map(item => ({
        ...item,
        isToday: item.id === this.data.originalWeekday
      }));
      this.setData({ weekdays });
    },
  
    startAutoUpdate() {
      this.updateTimer = setInterval(() => {
        this.mergeCourses();
      }, 60000);
    },
  
    stopAutoUpdate() {
      clearInterval(this.updateTimer);
    },
  
    onStudentChange(e) {
      const checkedIds = e.detail.value.map(Number);
      const students = this.data.students.map(s => ({
        ...s,
        checked: checkedIds.includes(s.id)
      }));
      this.setData({ students }, this.mergeCourses);
    },
  
    onWeekdayChange(e) {
      const weekday = e.currentTarget.dataset.weekday;
      this.setData({ selectedWeekday: weekday }, this.mergeCourses);
    },
  
    backToToday() {
      this.setData({ selectedWeekday: this.data.originalWeekday }, this.mergeCourses);
    },
  
    timeToMinutes(timeStr) {
      const [h, m] = timeStr.split(/[:：]/).map(Number);
      return h * 60 + (m || 0);
    },
  
    mergeCourses() {
      const now = new Date();
      const todayWeekday = now.getDay() || 7;
      const isTodayShowing = this.data.selectedWeekday === 
        (todayWeekday <= 5 ? todayWeekday : 1);
      const currentMinutes = isTodayShowing ? 
        now.getHours() * 60 + now.getMinutes() : -1;
  
      const merged = (this.data.timeSlots[this.data.selectedWeekday] || [])
        .map(slot => {
          const slotStart = this.timeToMinutes(slot.start);
          const slotEnd = this.timeToMinutes(slot.end);
          const isCurrentSlot = currentMinutes >= slotStart && 
                               currentMinutes < slotEnd;
  
          const courseMap = new Map();
          this.data.students
            .filter(s => s.checked)
            .forEach(student => {
              (this.data.courses[student.id]?.[this.data.selectedWeekday] || [])
                .filter(c => c.timeSlotId === slot.id)
                .forEach(course => {
                  const key = `${course.courseName}|${course.classroom}`;
                  const existing = courseMap.get(key);
                  if (existing) {
                    existing.students.push(student.name);
                    existing.colors.push(student.color);
                  } else {
                    courseMap.set(key, {
                      ...course,
                      students: [student.name],
                      colors: [student.color],
                      isCurrent: isCurrentSlot
                    });
                  }
                });
            });
  
          return {
            ...slot,
            courses: Array.from(courseMap.values()).map(course => ({
              ...course,
              backgroundStyle: this.generateBackground(course.colors),
              isCurrent: course.isCurrent
            })),
            isCurrent: isCurrentSlot
          };
        });
  
      this.setData({ mergedCourses: merged });
    },
  
    generateBackground(colors) {
      if (colors.length === 0) return "#f0f0f0";
      if (colors.length === 1) return colors[0];
      
      return `linear-gradient(90deg, ${colors.map((c, i) => 
        `${c} ${(i * 100 / colors.length)}%, ${c} ${((i + 1) * 100 / colors.length)}%`
      ).join(', ')})`;
    }
  });