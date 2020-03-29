//index.js
const app = getApp()
const api = require('../../api/api.js');
const {
  findCityByLocation,
  getWeatherDataByCity
} = api;

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    location: {},
    selectedCity: '北京',
    nowWeather:{},
    dailyWeather:{},
    lifeStyle:{},
    hourlyWeather:{}
  },

  onShow:function(){
    if(app.globalData.selectedCity){
      if (this.data.ctx) {
        this.data.ctx.clearRect(0, 0, this.data.cWidth, this.data.cHeight);
      }
      this.setData({
        selectedCity: app.globalData.selectedCity,
      })
      this.getCityWeather(app.globalData.selectedCity).then(this.weatherDataRecived)
    } 
  },

  onReady: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }



    // 获取用户授权信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation']) {
          this.getLocation()
        } else {
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
              this.getLocation();
            },
            fail: () => {
              wx.showModal({
                title: '定位失败',
                content: '请允许“使用我的地理位置”，否则将默认为您展示北京市天气',
                showCancel: false,
                success: res => {
                  if (res.confirm) {
                    wx.openSetting({
                      success: (res) => {
                        if (res.authSetting['scope.userLocation']) {
                          this.getLocation()
                        } else if (!res.authSetting['scope.userLocation']) {
                          this.getCityWeather('北京')
                        }
                      }
                    })
                  }
                }
              })
            },
          })
        }
      }
    })
  },

  /* 获取用户当前城市 */
  getLocation: function() {
    wx.getLocation({
      success: (res) => {
        this.setData({
          location: res
        })
        const {
          latitude,
          longitude
        } = res;
        const location = longitude + ',' + latitude;
        findCityByLocation(location).then((cityData) => {
          const userCity = cityData.data.HeWeather6[0].basic[0].location
          this.setData({
            selectedCity:userCity
          })
          this.getCityWeather(userCity).then(this.weatherDataRecived)
        })
      },
      fail: () => {
        wx.showModal({
          title: '定位失败',
          content: '请允许“使用我的地理位置”，否则将默认为您展示北京市天气',
          showCancel: false,
          success: res => {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting['scope.userLocation']) {
                    this.getLocation()
                  } else if (!res.authSetting['scope.userLocation']) {
                    this.getCityWeather('北京')
                  }
                }
              })
            }
          }
        })
      }
    })
  },

  /* 根据城市获取天气数据 */
  getCityWeather: function(city) {
    return Promise.all([
        getWeatherDataByCity(city, 'now'),
        getWeatherDataByCity(city, 'forecast'),
        getWeatherDataByCity(city, 'lifestyle'),
      ])
  },

  weatherDataRecived: function (weatherData){
    const nowWeather = weatherData[0].data.HeWeather6[0].now;
    const dailyWeather = weatherData[1].data.HeWeather6[0].daily_forecast;
    const lifeStyle = weatherData[2].data.HeWeather6[0].lifestyle;

    // 每日高温数组
    const highTempArr = [];
    // 每日低温数组
    const lowTempArr = [];

    dailyWeather.forEach((ele) => {
      highTempArr.push(ele.tmp_max);
      lowTempArr.push(ele.tmp_min);
    })

    this.setData({
      nowWeather,
      dailyWeather,
      lifeStyle
    })

    this.drawTempLine(highTempArr, lowTempArr)
  },

  drawTempLine: function (highTempArr, lowTempArr){
    const pointCount = highTempArr.length;

    const highMax = Math.max.apply(this,highTempArr);
    const highMin = Math.min.apply(this, highTempArr);

    const lowMax = Math.max.apply(this, lowTempArr);
    const lowMin = Math.min.apply(this, lowTempArr);

    const query = wx.createSelectorQuery();
    query.select('#myCanvas').fields({ node: true, size: true })
    .exec((res) => {
      const canvas = res[0].node
      const ctx = canvas.getContext('2d')
      const width = res[0].width;
      const height = res[0].height;

      this.setData({
        ctx,
        cWidth:width,
        cHeight:height
      })

      // ctx.clearRect(0,0,width,height);

      const dpr = wx.getSystemInfoSync().pixelRatio
      canvas.width = res[0].width * dpr
      canvas.height = res[0].height * dpr

      if(!app.globalData.scaled){
        ctx.scale(dpr, dpr)
        app.globalData.scaled = true;
      }
      
      //每栏一半的宽度
      const colHalfWidth = width / (pointCount * 2); 

      //高温每像素代表的温度
      const highStep = (highMax - highMin)/50; 
      //低温每像素代表的温度
      const lowStep = (lowMax - lowMin)/50;

      ctx.save();
      ctx.strokeStyle ="#FFD633";

      for(let i in highTempArr){
        const _temp = highTempArr[i];
        const _temPText = _temp + '℃';
        ctx.fillStyle = "black";
        if(i === '0'){
          ctx.moveTo(colHalfWidth, (highMax - _temp) / highStep + 52);
          ctx.fillText(_temPText, colHalfWidth, (highMax - _temp) / highStep + 40);
        }else{
          ctx.lineTo((2 * i + 1) * colHalfWidth, (highMax - _temp) / highStep + 52);
          ctx.fillText(_temPText, (2 * i + 1) * colHalfWidth, (highMax - _temp) / highStep + 40)
          ctx.stroke();
        }

        ctx.fillStyle = "#FFD633";
        ctx.beginPath();
        ctx.arc((2 * i + 1) * colHalfWidth, (highMax - _temp) / highStep + 52, 2, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill(); 
      }
      ctx.restore();

      ctx.strokeStyle = "blue";
      ctx.fillStyle = "blue";

      for (let j in lowTempArr) {
        const _temp = lowTempArr[j]
        const _temPText = _temp + '℃';
        ctx.fillStyle = "black";
        if (j === '0') {
          ctx.moveTo(colHalfWidth, (lowMax - _temp) / lowStep + 102);
          ctx.fillText(_temPText, colHalfWidth, (lowMax - _temp) / lowStep + 90);
        } else {
          ctx.lineTo((2 * j + 1) * colHalfWidth, (lowMax - _temp) / lowStep + 102);
          ctx.fillText(_temPText, (2 * j + 1) * colHalfWidth, (lowMax - _temp) / lowStep + 90);
          ctx.stroke();
        }

        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc((2 * j + 1) * colHalfWidth, (lowMax - _temp) / lowStep + 102, 2, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    })
  },

  parseDate:function(date){
    let reg = /([^-]+)/g

    let arr = date.match(reg)

    return arr[1] + '月' + arr[2] + '日';
  },

  jumpToSelectCity:function(){

    wx.navigateTo({
      url:'../selectCity/selectCity',
      events:{
        selectNewLocation:(location) => {
          this.setData({
            selectedCity:location
          })

          if(this.data.ctx){
            this.data.ctx.clearRect(0, 0, this.data.cWidth, this.data.cHeight);
          }

          this.getCityWeather(location).then(this.weatherDataRecived)
        },

        selectMyLocation:() => {
          if (this.data.ctx) {
            this.data.ctx.clearRect(0, 0, this.data.cWidth, this.data.cHeight);
          }

          this.getLocation()
        }
      }
    })
  },
})