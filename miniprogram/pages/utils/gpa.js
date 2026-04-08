// pages/utils/gpa.js

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
 * 综合分析计算器
 * @param {Array} grades - 成绩数组
 */
const calculateMetrics = (grades) => {
  if (!grades || grades.length === 0) {
    return {
      average: '0.00',
      weightedAverage: '0.00',
      totalGpa: '0.00',
      semesterMetrics: []
    };
  }

  let totalCredit = 0;
  let weightedScoreSum = 0;
  let weightedGpaSum = 0;
  let totalGpaCredit = 0;

  grades.forEach(g => {
    const credit = parseFloat(g.credit) || 0;
    const rawScore = parseFloat(g.score) || 0;
    let currentGP = parseFloat(g.schoolGpa);

    // 确定绩点：没有绩点字段时从成绩推算
    if (isNaN(currentGP)) {
      if (rawScore <= 5 && rawScore > 0) {
        currentGP = rawScore; // 成绩本身就是绩点格式
      } else {
        currentGP = getGradePoint(rawScore);
      }
    }

    weightedScoreSum += rawScore * credit;
    totalCredit += credit;

    if (g.countInGpa !== false) {
      weightedGpaSum += currentGP * credit;
      totalGpaCredit += credit;
    }
  });

  // ★ 修复：average 直接用加权均分，去掉之前化简后仍然错误的公式
  const weightedAverage = totalCredit > 0
    ? (weightedScoreSum / totalCredit).toFixed(2)
    : '0.00';

  return {
    average: weightedAverage, // 算术意义上与加权均分相同，保留字段兼容旧逻辑
    weightedAverage: weightedAverage,
    totalGpa: totalGpaCredit > 0
      ? (weightedGpaSum / totalGpaCredit).toFixed(2)
      : '0.00',
    semesterMetrics: groupAndCalculateBySemester(grades)
  };
};

const groupAndCalculateBySemester = (grades) => {
  const map = {};
  grades.forEach(g => {
    const key = g.semester || '未知学期';
    if (!map[key]) map[key] = [];
    map[key].push(g);
  });

  const result = [];
  for (let sem in map) {
    let sumGpa = 0, sumCred = 0;
    map[sem].forEach(c => {
      const credit = parseFloat(c.credit) || 0;
      let gp = parseFloat(c.schoolGpa);
      if (isNaN(gp)) {
        const score = parseFloat(c.score) || 0;
        gp = (score <= 5 && score > 0) ? score : getGradePoint(score);
      }
      if (c.countInGpa !== false) {
        sumGpa += gp * credit;
        sumCred += credit;
      }
    });
    result.push({
      semester: sem,
      gpa: sumCred > 0 ? (sumGpa / sumCred).toFixed(2) : '0.00'
    });
  }
  return result.sort((a, b) => a.semester.localeCompare(b.semester));
};

const calculateTrend = (grades) => {
  const semesterData = groupAndCalculateBySemester(grades);
  return semesterData.map(item => ({
    semester: item.semester,
    gpa: item.gpa
  }));
};

module.exports = {
  getGradePoint,
  calculateMetrics,
  calculateTrend
};
