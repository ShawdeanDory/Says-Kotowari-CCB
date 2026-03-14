// index.js
const STORAGE_KEY = 'USER_FOOD_LIST'; 

Page({
  data: {
    presets: [], 
    list: [],
    wheelGradient: '',
    rotateDeg: 0,
    isSpinning: false,
    duration: 4, 
    inputValue: ''
  },

  onLoad() {
    // 启动时读取缓存，若无缓存则初始化默认数据
    const localData = wx.getStorageSync(STORAGE_KEY);
    const defaultPresets = [
      { name: '麦当劳', selected: false },

      { name: 'KFC', selected: false },

      { name: '必胜客', selected: false },

      { name: '达美乐', selected: false },

      { name: '小鱼', selected: false },

      { name: '烤鱼', selected: false },

      { name: '纽约堡', selected: false },

      { name: '食其家', selected: false },

      { name: '喜旺', selected: false },

      { name: '小杨', selected: false },

      { name: '呷哺', selected: false },

      { name: '张亮', selected: false },

      { name: '杨国福', selected: false },

      { name: '烤鸭', selected: false },

      { name: '烧烤', selected: false },

      { name: '肉夹馍', selected: false },

      { name: '永和', selected: false }
    ];
    this.setData({ presets: localData || defaultPresets });
    this.updateWheel();
  },

  // 统一保存并刷新转盘
  saveAndRefresh() {
    wx.setStorageSync(STORAGE_KEY, this.data.presets);
    this.updateWheel();
  },

  // 核心：生成彩虹色转盘
  updateWheel() {
    const selected = this.data.presets.filter(p => p.selected);
    const count = selected.length;
    
    if (count === 0) {
      this.setData({ list: [], wheelGradient: 'none' });
      return;
    }

    const sectorSize = 360 / count;
    let gradientParts = [];
    
    const listWithAngle = selected.map((item, index) => {
      const start = index * sectorSize;
      const end = (index + 1) * sectorSize;
      
      // HSL彩虹色计算：根据总数平分360度色相
      const hue = Math.floor(index * (360 / count));
      const color = `hsl(${hue}, 80%, 75%)`; // 饱和度80%, 亮度75% 较美观

      gradientParts.push(`${color} ${start}deg ${end}deg`);
      return {
        ...item,
        color: color,
        angle: start + sectorSize / 2
      };
    });

    this.setData({
      list: listWithAngle,
      wheelGradient: `conic-gradient(${gradientParts.join(', ')})`
    });
  },

  // 全选
  selectAll() {
    if (this.data.isSpinning) return;
    const newPresets = this.data.presets.map(item => ({ ...item, selected: true }));
    this.setData({ presets: newPresets });
    this.saveAndRefresh();
  },

  // 清除
  clearSelection() {
    if (this.data.isSpinning) return;
    const newPresets = this.data.presets.map(item => ({ ...item, selected: false }));
    this.setData({ presets: newPresets });
    this.saveAndRefresh();
  },

  // 切换选中
  togglePreset(e) {
    if (this.data.isSpinning) return;
    const index = e.currentTarget.dataset.index;
    const key = `presets[${index}].selected`;
    this.setData({ [key]: !this.data.presets[index].selected });
    this.saveAndRefresh();
  },

  // 删除功能
  deleteItem(e) {
    if (this.data.isSpinning) return;
    const index = e.currentTarget.dataset.index;
    const name = this.data.presets[index].name;
    wx.showModal({
      title: '确认删除',
      content: `确定要移除“${name}”吗？`,
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          const newPresets = [...this.data.presets];
          newPresets.splice(index, 1);
          this.setData({ presets: newPresets });
          this.saveAndRefresh();
        }
      }
    });
  },

  // 添加自定义
  addItem() {
    const val = this.data.inputValue.trim();
    if (!val) return;
    const newPresets = [...this.data.presets];
    newPresets.unshift({ name: val, selected: true });
    this.setData({ presets: newPresets, inputValue: '' });
    this.saveAndRefresh();
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  startSpin() {
    if (this.data.isSpinning || this.data.list.length === 0) return;
    this.setData({ isSpinning: true });
    const randomAngle = Math.floor(Math.random() * 360);
    const targetDeg = this.data.rotateDeg + (360 * 5) + (360 - (this.data.rotateDeg % 360)) + randomAngle;
    this.setData({ rotateDeg: targetDeg });
    setTimeout(() => { this.calculateResult(randomAngle); }, this.data.duration * 1000);
  },

  calculateResult(angle) {
    const normalizedAngle = angle % 360;
    const index = Math.floor(normalizedAngle / (360 / this.data.list.length));
    const resultItem = this.data.list[index];
    wx.showModal({
      title: '决定了！',
      content: `今天吃：【${resultItem.name}】`,
      showCancel: false,
      success: () => { this.setData({ isSpinning: false }); }
    });
  }
});