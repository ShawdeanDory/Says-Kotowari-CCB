const cloud = require('wx-server-sdk')
const axios = require('axios')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const rawText = event.token || '';
  const match = rawText.match(/[a-f0-9]{32}/);
  if (!match) return { success: false, msg: '未检测到32位口令，请检查复制内容' }
  const validKey = match[0];

  try {
    // 1. 模拟请求 WakeUp 接口
    const res = await axios.get('https://api.wakeup.fun/share_schedule/get', {
      params: {
        key: validKey,
        ZYBUSS: '15tPKeBl9gyx_25uBN3EO9a1x1WAf9Ro8q9kjjL86ZKP6e-QcxSyxnB2Klg0pSSW',
        t: '1770278332', 
        device: 'iPhone%2013',
        os: 'ios', 
        app_pn: 'com.wakeup.schedule',
        sign: 'c0d4719af1217ff5c6569f14428d9348'
      },
      headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) wakeup/6.1.13 Mobile/15E148 Safari/604.1' }
    });

    // 2. 强力正则提取所有数组
    let rawString = typeof res.data.data === 'string' ? res.data.data : JSON.stringify(res.data.data || {});
    let allParts = [];
    const arrayMatches = rawString.match(/\[[\s\S]*?\]/g);
    if (arrayMatches) {
        allParts = arrayMatches.map(str => { try { return JSON.parse(str) } catch(e) { return [] } });
    }

    // 3. 识别“名单”与“时间”
    let courseMap = {}; 
    let scheduleList = []; 

    if (Array.isArray(allParts)) {
        for (const part of allParts) {
            if (!Array.isArray(part) || part.length === 0) continue;
            const sample = part[0];
            // 特征A: 名单表 (有 courseName, 无 startNode)
            if (sample.courseName && sample.id !== undefined && sample.startNode === undefined) {
                part.forEach(c => { if (c.id !== undefined) courseMap[c.id] = c; });
            }
            // 特征B: 时间表 (有 day, startNode, id)
            else if (sample.day !== undefined && sample.startNode !== undefined && sample.id !== undefined) {
                scheduleList = part;
            }
        }
    }

    // 4. 莫兰迪色盘 (Morandi Colors)
    const morandiColors = [
        '#779d8d', '#8d99ae', '#d4a5a5', '#e29578', '#ffcdb2', 
        '#b5838d', '#6d6875', '#83c5be', '#006d77', '#cb997e'
    ];

    // 5. 缝合数据
    let finalCourses = [];
    if (scheduleList.length > 0) {
        finalCourses = scheduleList.map((item, index) => {
            const detail = courseMap[item.id] || {};
            // 随机分配一个莫兰迪色
            const colorIndex = (item.id || index) % morandiColors.length;
            
            return {
                name: detail.courseName || item.courseName || '未知课程',
                room: item.room || detail.room || '',
                teacher: item.teacher || detail.teacher || '',
                day: parseInt(item.day || 1),
                start: parseInt(item.startNode || 1), 
                step: parseInt(item.step || 2),
                weeks: item.startWeek && item.endWeek ? `${item.startWeek}-${item.endWeek}周` : '',
                color: morandiColors[colorIndex] // 强制使用新配色
            };
        });
        return { success: true, data: finalCourses };
    }

    return { 
        success: false, 
        msg: '解析失败，未找到课程数据，可能口令已失效。',
        raw: rawString.substring(0, 200) 
    };

  } catch (e) { return { success: false, msg: '云端请求异常: ' + e.message } }
}