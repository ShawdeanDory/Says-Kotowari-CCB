// cloudfunctions/saveSchedule/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  // 关键：这个 OPENID 是微信后台根据当前登录态生成的，绝对真实，不可伪造
  const { OPENID } = cloud.getWXContext() 
  const { courses, userInfo, isPublic } = event

  try {
    // 1. 只根据微信官方提供的 OPENID 去数据库里找
    const res = await db.collection('timetables').where({
      _openid: OPENID 
    }).get()

    const dataPayload = {
      _openid: OPENID, // 确保这条数据永远打上你的身份标签
      courses: courses,
      userInfo: userInfo, // 即使你改了名，这里也会存入新名字
      isPublic: isPublic,
      updateTime: db.serverDate()
    }

    if (res.data.length > 0) {
      // 2. 找到了：说明你之前传过课表。执行覆盖。
      // 注意：这里用 doc(res.data[0]._id) 精准更新那唯一的一条记录
      await db.collection('timetables').doc(res.data[0]._id).update({
        data: dataPayload
      })
      return { success: true, msg: '覆盖成功' }
    } else {
      // 3. 没找到：说明你是新用户。执行新增。
      await db.collection('timetables').add({
        data: {
          ...dataPayload,
          createTime: db.serverDate()
        }
      })
      return { success: true, msg: '创建成功' }
    }
  } catch (e) {
    return { success: false, msg: '数据库异常', error: e }
  }
}