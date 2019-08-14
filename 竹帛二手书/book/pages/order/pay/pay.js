const util = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //app.globalData.order.push(order);
    this.setData({
      order:JSON.parse(options.order),
    });
    var orderId = this.data.order.order_id;
    var openid = app.globalData.openid;
    var url = app.globalData.domain + 'Order/getWxpayData';
    var params = { orderId: orderId, openid: openid};
    util.wxRequest(url, params, data => {
      if (data.code == 200) {
        app.globalData.wxData = data.data.wxData
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'none'
        })
      }
    }, data => { }, data => { });
  },
  //发起微信支付
  wxpay: function () {
    var order = this.data.order;
    var orderId = this.data.order.order_id;
    console.log(orderId)
    var wxData = app.globalData.wxData;
    var timeStamp = wxData.timeStamp + '';
    var nonceStr = wxData.nonceStr + '';
    var wxpackage = wxData.package + '';
    var paySign = wxData.paySign + '';
    wx.requestPayment({
      'timeStamp': timeStamp,
      'nonceStr': nonceStr,
      'package': wxpackage,
      'signType': 'MD5',
      'paySign': paySign,
      'success': function (res) {
        wx.navigateTo({
          url: '../result/result?status=1&orderId=' + orderId,
        })
      },
      'fail': function (res) {
        wx.navigateTo({
          url: '../result/result?status=0&orderId=' + orderId,
        })
      }
    })
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