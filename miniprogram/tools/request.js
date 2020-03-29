function get(req){
  let { url,data } = req
  return new Promise((resolve,reject) => {
    wx.request({
      url,
      data,
      timeout:5000,
      method:'GET',
      success:resolve,
      fail:reject
    })
  })
}

function post(req){
  let { url, data } = req
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data,
      timeout: 5000,
      method: 'POST',
      success: resolve(res),
      fail: reject(e)
    })
  })
}

module.exports.get = get;
module.exports.post = post;