/**
 * 标准 4.0 GPA 映射算法
 */
const getGradePoint = (score) => {
  if (score >= 90) return 4.0;
  if (score >= 85) return 3.7;
  if (score >= 82) return 3.3;
  if (score >= 78) return 3.0;
  if (score >= 75) return 2.7;
  if (score >= 72) return 2.3;
  if (score >= 68) return 2.0;
  if (score >= 64) return 1.5;
  if (score >= 60) return 1.0;
  return 0;
};

/**
 * 综合分析计算器 - 增强版（兼容手动录入与导入数据）
 * @param {Array} grades - 成绩数组
 */const calculateMetrics = (grades) => {
  if (!grades || grades.length === 0) {
    return { average: '0.00', weightedAverage: '0.00', totalGpa: '0.00', semesterMetrics: [] };
  }

  let totalCredit = 0;
  let weightedScoreSum = 0;
  let weightedGpaSum = 0;
  let totalGpaCredit = 0;

  grades.forEach(g => {
    const credit = parseFloat(g.credit) || 0;
    const rawScore = parseFloat(g.score) || 0;
    let currentGP = parseFloat(g.schoolGpa);

    // --- 核心逻辑：确定绩点 ---
    if (isNaN(currentGP)) {
      // 如果没有绩点字段，判断分数是否像绩点(<=5)
      if (rawScore <= 5 && rawScore > 0) {
        currentGP = rawScore; 
      } else {
        currentGP = getGradePoint(rawScore); 
      }
    }

    // --- 核心逻辑：确定加权均分（分数） ---
    // 无论 rawScore 是 90 还是 4.0，都让它参与求和，保证界面不显示 0
    weightedScoreSum += rawScore * credit;
    totalCredit += credit;

    // --- 核心逻辑：确定总 GPA ---
    if (g.countInGpa !== false) {
      weightedGpaSum += currentGP * credit;
      totalGpaCredit += credit;
    }
  });

  return {
    // 这里的 average 和 weightedAverage 现在会直接反映你 score 字段里的数值
    average: totalCredit > 0 ? (weightedScoreSum / (totalCredit / grades.length * grades.length || 1)).toFixed(2) : "0.00",
    weightedAverage: totalCredit > 0 ? (weightedScoreSum / totalCredit).toFixed(2) : "0.00",
    totalGpa: totalGpaCredit > 0 ? (weightedGpaSum / totalGpaCredit).toFixed(2) : "0.00",
    semesterMetrics: groupAndCalculateBySemester(grades)
  };
};

// 同时也建议更新一下这个函数，确保学期分组计算也不会出错
const groupAndCalculateBySemester = (grades) => {
  const map = {};
  grades.forEach(g => {
    if (!map[g.semester]) map[g.semester] = [];
    map[g.semester].push(g);
  });
  
  const result = [];
  for (let sem in map) {
    let sumGpa = 0, sumCred = 0;
    map[sem].forEach(c => {
      const credit = parseFloat(c.credit) || 0;
      let gp = parseFloat(c.schoolGpa);
      if (isNaN(gp)) {
        gp = parseFloat(c.score) <= 5 ? parseFloat(c.score) : getGradePoint(parseFloat(c.score));
      }
      
      if (c.countInGpa !== false) {
        sumGpa += gp * credit;
        sumCred += credit;
      }
    });
    result.push({
      semester: sem,
      gpa: sumCred > 0 ? (sumGpa / sumCred).toFixed(2) : "0.00"
    });
  }
  return result.sort((a, b) => a.semester.localeCompare(b.semester));
};
// 在 utils/gpa.js 中追加这个导出函数
const calculateTrend = (grades) => {
  // 直接复用你那个带“学分加权”和“分值转换”逻辑的函数
  const semesterData = groupAndCalculateBySemester(grades);
  
  // 将结果映射为 ECharts 需要的格式
  return semesterData.map(item => ({
    semester: item.semester,
    gpa: item.gpa // 这里的 gpa 已经是加权后的了
  }));
};

module.exports = {
  getGradePoint,
  calculateMetrics,
  calculateTrend // 确保这一行在这里！
};