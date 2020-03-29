// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const { OPENID } = wxContext;

  const db = cloud.database();

  const { citys } = event;

  if(!citys) throw new Error('no citys!');

 const result = await db.collection('collectCity').where({
    openid: OPENID
  }).update({
    data:{
      citys
    }
  })

  console.log(result)

  return result
}