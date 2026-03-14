// index.js
Page({
    data: {
      currentIndex: 0,
      steps: [
        { x: 60,  content: "内容 1", color: '#FF6B6B' }, // 新增 color 属性
        { x: 180, content: "内容 2", color: '#4D96FF' },
        { x: 300, content: "内容 3", color: '#6BCB77' }
      ],
      dotRadius: 8,
      activeRadius: 12
    },
  
    onReady() {
      this.ctx = wx.createCanvasContext('myCanvas')
      this.drawDots()
    },
  
    drawDots() {
      const { currentIndex, steps, dotRadius, activeRadius } = this.data
      
      // 清空画布
      this.ctx.clearRect(0, 0, 3000, 80) // 横向布局需要更大的宽度
  
      // 绘制连接线
      steps.forEach((step, index) => {
        if(index > 0) {
          const prevStep = steps[index-1]
          // 动态计算线宽防止覆盖圆点
          this.ctx.beginPath()
          this.ctx.moveTo(prevStep.x + this.getStepRadius(index-1), 40)
          this.ctx.lineTo(step.x - this.getStepRadius(index), 40)
          this.ctx.setStrokeStyle('#ddd')
          this.ctx.setLineWidth(2)
          this.ctx.stroke()
        }
      })
  
      // 绘制圆点
      steps.forEach((step, index) => {
        const radius = index === currentIndex ? activeRadius : dotRadius
        
        // 圆点主体
        this.ctx.beginPath()
        this.ctx.arc(step.x, 40, radius, 0, Math.PI * 2)
        this.ctx.setFillStyle(step.color)
        this.ctx.fill()
  
        // 白边特效
        this.ctx.beginPath()
        this.ctx.arc(step.x, 40, radius + 2, 0, Math.PI * 2)
        this.ctx.setStrokeStyle('#fff')
        this.ctx.setLineWidth(2)
        this.ctx.stroke()
      })
  
      this.ctx.draw()
    },
  
    // 获取指定索引的圆点半径
    getStepRadius(index) {
      return index === this.data.currentIndex 
        ? this.data.activeRadius 
        : this.data.dotRadius
    },
  
    handleTap(e) {
      const { touches } = e
      const query = wx.createSelectorQuery()
      
      query.select('#myCanvas').boundingClientRect(rect => {
        const tapX = touches[0].clientX - rect.left
        const tapY = touches[0].clientY - rect.top
        
        let clickedIndex = -1
        this.data.steps.forEach((step, index) => {
          const radius = this.getStepRadius(index)
          const distance = Math.sqrt(
            Math.pow(tapX - step.x, 2) + 
            Math.pow(tapY - 40, 2) // y 轴固定中点
          )
          if(distance <= radius * 1.5) { // 扩大 50%的点击区域
            clickedIndex = index
          }
        })
        
        if(clickedIndex > -1) {
          this.setData({ currentIndex: clickedIndex }, () => {
            this.drawDots()
            wx.vibrateShort()
          })
        }
      }).exec()
    }
  })