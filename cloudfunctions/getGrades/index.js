const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  try {
    // 云函数最高支持单次 1000 条，彻底解决 20 条限制
    const res = await db.collection('grades')
      .where({
        _openid: OPENID 
      })
      .orderBy('createdAt', 'desc')
      .limit(1000) 
      .get()
    
    return {
      code: 0,
      data: res.data
    }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}