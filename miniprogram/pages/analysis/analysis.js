// 注意：这里的路径要指向你 ec-canvas 文件夹里的 echarts.js
// 如果你的目录结构是 components/ec-canvas/echarts.js，则如下：
import * as echarts from '../../components/ec-canvas/echarts';


const { calculateTrend } = require('../utils/gpa.js');
const db = wx.cloud.database();

Page({
  data: {
    trendData: [],
    ec: { lazyLoad: true } // 延迟加载，等数据回来再画图
  },

  onShow() {
    this.loadTrendData();
  },

  async loadTrendData() {
    const res = await db.collection('grades').limit(1000).get();
    const trend = calculateTrend(res.data);
    
    this.setData({ trendData: trend });
    this.initChart(trend); // 拿到数据后初始化图表
  },

  // 这里的配置就是 ECharts 标准配置，你可以随意修改样式（颜色、粗细、动画等）
  initChart(trend) {
    this.selectComponent('#mychart-dom-line').init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, { width, height, devicePixelRatio: dpr });
      
      const option = {
        xAxis: {
          type: 'category',
          data: trend.map(item => item.semester.split('-').slice(1).join('-')), // 简化显示：2025-秋
        },
        yAxis: { type: 'value', min: 0, max: 4.0 },
        series: [{
          data: trend.map(item => item.gpa),
          type: 'line',
          smooth: true, // 平滑曲线
          color: '#0052D9',
          areaStyle: { opacity: 0.1 } // 阴影面积
        }]
      };
      
      chart.setOption(option);
      return chart;
    });
  }
});