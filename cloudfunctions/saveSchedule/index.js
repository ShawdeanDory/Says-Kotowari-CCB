// cloudfunctions/saveSchedule/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID
  const { courses, isPublic, userInfo } = event
  
  // 使用服务器时间，保证排序绝对准确
  const payload = { 
    _openid: openid, 
    courses, 
    isPublic, 
    userInfo, 
    updateTime: db.serverDate() // 关键修改
  }
  
  try {
    const checkUser = await db.collection('timetables').where({ _openid: openid }).get()
    
    if (checkUser.data.length > 0) {
      return await db.collection('timetables').doc(checkUser.data[0]._id).update({ data: payload })
    } else {
      return await db.collection('timetables').add({ data: payload })
    }
  } catch (e) { return e }
}