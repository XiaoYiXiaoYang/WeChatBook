//index.js
const util = require('../../utils/util.js');
//获取应用实例
const app = getApp()
Page({
  data: {
    login: false
  },
  login: function (e) {
    var that = this;
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: app.globalData.domain + 'User/getuser',
            method:'POST',
            data:{
              openid: app.globalData.openid,
            },
            success:function(res){
              if (res.data.status == 200) {
                app.globalData.userInfo = res.data.data;
                app.globalData.login = true;
                that.setData({ login: true });
                wx.showToast({
                  title: '登录成功！',
                  icon: 'success',
                  duration: 2000
                })
              } else {
                app.globalData.login = false;
                wx.showToast({
                  title: res.data.msg,
                  icon: none,
                  duration: 2000
                })
              }
            }
          })
        } else {
          console.log('error');
        }
      }
    })
  },
 navToCollect: function () {
    
  },
  navToAddress: function () {
    wx.navigateTo({
      url: '../address/list/list'
    })
  },
  navToOrderList: function () {
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  }
})