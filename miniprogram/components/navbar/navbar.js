// components/navbar/navbar.js
const app = getApp()
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  /**
   * 组件的属性列表
   */
  properties: {
    backgroundColor: {
      type: String,
      value: 'rgba(0,0,0,0)'
    },

    showBack:{
      type:Boolean,
      value:true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /** 
   * ready
   */
  ready(){
    let {
      statusBarHeight,
      navBarHeight
    } = app.globalData;

    this.setData({
      statusBarHeight,
      navBarHeight
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    back(){
      wx.navigateBack({
        delta:1
      })
    }
  }
})
