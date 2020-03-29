// miniprogram/pages/my/my.js
const api = require('../../api/api.js');
const app = getApp()
const {
  findCityByLocation,
} = api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,
    action:'新增',
    userCollection:[],
    deleteColection:[],
    selected:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success:res => {
        if (res.authSetting['scope.userInfo']) {
          this.setData({
            isLogin:true
          })

          wx.cloud.callFunction({
            name: 'getUserCollection',
            data: {}
          }).then(res => {
            this.setData({
              userCollection:res.result
            })
          })

        } else if (!res.authSetting['scope.userInfo']){
          this.setData({
            isLogin:false
          })
        }
      },

      fail:() => {
        this.setData({
          isLogin: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      search: this.search.bind(this)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getUserInfo:function (e) {
    wx.cloud.callFunction({
      name: 'getUserCollection',
      data: {}
    }).then(res => {
      this.setData({
        isLogin: true,
        userCollection: res.result
      })
    })
  },

  toggleAction:function (e) {
    const {action} = e.target.dataset
    this.setData({
      action
    })
  },

  search: function (value) {
    if (!value) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    return findCityByLocation(value).then(res => res.data.HeWeather6[0].basic.map(ele => ({
      text: `${ele.location},${ele.parent_city},${ele.admin_area}`,
      value: ele.location
    })))
  },

  bindselectresult:function(e){
    const value = e.detail.item.value
    const userCollection = this.data.userCollection

    if(userCollection.length >= 5){
      wx.showToast({
        title:'最多只能收藏5个城市',
        icon:'none'
      })

      return 
    }

    wx.showLoading({
      title: '处理中',
    })
    userCollection.push(value)
    wx.cloud.callFunction({
      name:'addCity',
      data:{
        citys: userCollection
      }
    }).then((res) => {
      console.log(res)
      wx.cloud.callFunction({
        name: 'getUserCollection',
        data: {}
      }).then(_res => {
        wx.hideLoading();
        this.setData({
          userCollection: _res.result
        })
      })
    })
  },

  onDeleteTap:function(){
    if (!this.data.deleteColection.length){
      wx.showToast({
        title:'请选择要删除的城市',
        icon:'none'
      })
    }else{
      wx.showLoading({
        title: '处理中',
      })
      const result = this.data.userCollection.filter(ele => this.data.deleteColection.indexOf(ele) === -1);

      wx.cloud.callFunction({
        name: 'addCity',
        data: {
          citys: result
        }
      }).then((res) => {
        wx.cloud.callFunction({
          name: 'getUserCollection',
          data: {}
        }).then(_res => {
          wx.hideLoading();
          wx.showToast({
            title: '编辑成功',
          })
          this.setData({
            userCollection: _res.result
          })
        })
      })

    }
  },

  deleteCitySelect:function(e){
    const { city } = e.target.dataset
    
    if(this.data.deleteColection.indexOf(city) === -1){
      this.setData({
        deleteColection: [...this.data.deleteColection, city]
      })
    }else{
      this.setData({
        deleteColection: this.data.deleteColection.filter(ele => ele !== city)
      })
    }
  },

  changeSelectCity:function(e){
    const { city } = e.target.dataset
    app.globalData.selectedCity = city
    wx.switchTab({
      url:'../index/index'
    })
  }
})