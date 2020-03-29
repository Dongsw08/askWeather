// miniprogram/pages/selectCity/selectCity.js
const api = require('../../api/api.js');
const app = getApp();
const {
  findCityByLocation,
  getWeatherDataByCity
} = api;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityInput: '',
    userCollection:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      search: this.search.bind(this)
    })

    wx.cloud.callFunction({
      name: 'getUserCollection',
      data: {}
    }).then(res => {
      this.setData({
        userCollection: res.result
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  bindCityInput: function(e) {
    this.setData({
      cityInput: e.detail.value
    })
  },

  search: function(value) {
    if(!value){
      return new Promise((resolve,reject) => {
        resolve([])
      })
    }

    return findCityByLocation(value).then(res => res.data.HeWeather6[0].basic.map(ele => ({
      text: `${ele.location},${ele.parent_city},${ele.admin_area}`,
      value:ele.location
    })))
  },

  bindselectresult:function(e){
    app.globalData.selectedCity = '';
    const value = e.detail.item.value
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit('selectNewLocation',value);
    wx.navigateBack();
  },

  selectColletion:function(e){
    app.globalData.selectedCity = '';
    const { city } = e.target.dataset;

    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit('selectNewLocation', city);
    wx.navigateBack();
  },

  selectMyLocation:function(){
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit('selectMyLocation');
    wx.navigateBack();
  }

  
})