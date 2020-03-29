// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const { OPENID } = wxContext;

  const db = cloud.database();

  const result = await db.collection('collectCity').where({
    openid: OPENID
  }).get()

  if (!result.data.length) {
    await db.collection('collectCity').add({
      data: {
        openid:OPENID,
        citys: []
      }
    })

    return []
  }else{
    if(result.data[0].citys){
      return result.data[0].citys;
    }
  }
}