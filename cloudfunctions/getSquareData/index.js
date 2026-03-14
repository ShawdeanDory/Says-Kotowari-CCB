// cloudfunctions/getSquareData/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  return await db.collection('timetables')
    .where({ isPublic: true })
    // 关键：按更新时间倒序 (最新的在最上面)
    .orderBy('updateTime', 'desc') 
    .field({
      userInfo: true,
      updateTime: true,
      _openid: true
    })
    .get()
}