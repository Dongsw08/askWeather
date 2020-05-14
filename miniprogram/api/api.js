const request = require('../tools/request.js')
const get = request.get;
const post = request.post;

const key = '0106aeb202664e6aa97148ea26e9fb9f';
const data = {
  key
}

/* 搜索城市api */
const searchCity = 'https://search.heweather.net/find';

/* 
   搜索城市by location
   param:location 经纬度或者地名，经度在前纬度在后
 */

const findCityByLocation = (location) => {
    data.location = location;
  data.group = "cn"
    const param = {
      url:searchCity,
      data
    }
    return get(param)
}

module.exports.findCityByLocation = findCityByLocation

/* 
  根据城市获取天气数据 - 实况
  param:city - 城市名称
 */

/* 获取天气api */
const getWeatherURL = 'https://free-api.heweather.net/s6/weather/'

const getWeatherDataByCity = (city,type) => {
  if(!city || !type){
    return;
  }
  data.location = city;
  const url = getWeatherURL + type
  const param = {
    url,
    data
  }

  return get(param)
}

module.exports.getWeatherDataByCity = getWeatherDataByCity