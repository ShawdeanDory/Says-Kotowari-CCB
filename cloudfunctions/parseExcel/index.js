const cloud = require('wx-server-sdk');
const xlsx = require('node-xlsx');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const { fileID } = event;
  
  if (!fileID) {
    return { code: -1, msg: 'fileID is undefined' };
  }

  try {
    const res = await cloud.downloadFile({ fileID });
    const buffer = res.fileContent;

    const sheets = xlsx.parse(buffer);
    if (!sheets || sheets.length === 0) {
      return { code: -1, msg: '无法读取Excel工作表' };
    }

    const rows = sheets[0].data; 
    if (!rows || rows.length < 2) {
      return { code: -1, msg: '表格无数据内容' };
    }

    const header = rows[0].map(h => h ? String(h).trim() : "");
    
    // --- 核心修改：精准寻找索引，排除干扰项 ---
    const findIdx = (targets) => {
      // 优先找完全匹配的
      let idx = header.findIndex(h => targets.includes(h));
      // 如果找不到完全匹配的，再找包含关键字但排除掉“备注/性质/作废”的
      if (idx === -1) {
        idx = header.findIndex(h => 
          targets.some(t => h.includes(t)) && 
          !h.includes('备注') && 
          !h.includes('性质') && 
          !h.includes('作废') &&
          !h.includes('分绩点') // 排除“学分绩点”干扰“绩点”
        );
      }
      return idx;
    };

    const i = {
      name: findIdx(['课程名称', '课程名']),
      score: findIdx(['成绩', '分数', '总成绩']),
      credit: findIdx(['学分']),
      gp: findIdx(['绩点']),
      year: findIdx(['学年']),
      term: findIdx(['学期'])
    };

    // 调试用：查看抓取到的索引位置
    console.log('索引分配结果:', i);

    const result = [];
    for (let j = 1; j < rows.length; j++) {
      const row = rows[j];
      // 如果这一行连课程名都没有，直接跳过
      if (!row || i.name === -1 || !row[i.name]) continue; 

      // 提取原始成绩
      let rawScore = row[i.score];
      
      // 处理成绩：如果是空值但有绩点，则尝试用绩点
      let finalScore = (rawScore !== undefined && rawScore !== null) ? String(rawScore).trim() : "";
      
      result.push({
        courseName: String(row[i.name]).trim(),
        score: finalScore, 
        credit: parseFloat(row[i.credit]) || 0,
        schoolGpa: parseFloat(row[i.gp]) || 0,
        semester: `${row[i.year] || ''}-${row[i.term] || ''}`,
        countInGpa: finalScore !== 'P' && finalScore !== 'NP',
        createdAt: Date.now()
      });
    }

    return {
      code: 0,
      data: result,
      count: result.length
    };

  } catch (err) {
    console.error('内部执行错误：', err);
    return {
      code: -1,
      msg: '云函数内部错误',
      error: String(err)
    };
  }
};