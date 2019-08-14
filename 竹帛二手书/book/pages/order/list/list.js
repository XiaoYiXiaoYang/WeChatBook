const util = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabClass: [],
    status: ['all', 'waitpay', 'waitsent', 'waitreceive', 'finish'],
    deafultStatus: 'all',
    page: 1,
    orders: [],
    img_src: app.globalData.img_url,
    flag:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options){
      this.setData({
        tabClass: JSON.parse(options.tabClass),
        deafultStatus: options.deafultStatus,
        orders: []
      });
      this.getOrderList(this.data.deafultStatus, 1);
      this.data.flag = true;
    }else{}
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
    if (this.data.flag == false){
      this.setData({
        tabClass: ['selected', 'normal', 'normal', 'normal', 'normal']
      });
      this.getOrderList(this.data.deafultStatus, 1);
    }else{
      
    }
  },

  tabClick: function (e) {
    var index = e.currentTarget.dataset.index;
    var navClass = ['normal', 'normal', 'normal', 'normal', 'normal'];
    navClass[index] = 'selected';
    var status = this.data.status;
    this.setData({
      tabClass: navClass,
      deafultStatus: status[index],
      orders: []
    });
    this.getOrderList(this.data.deafultStatus, 1);
  },

  getOrderList: function (status, page) {
    var status = status;
    var page = page;
    var openid = app.globalData.openid;
    //var token = app.globalData.userInfo.token;
    var url = app.globalData.domain + 'Order/getOrderList';
    var params = { status: status, page: page, openid: openid};
    util.wxRequest(url, params, data =>{
      if (data.code == 200) {
        console.log(data.data)
        var goods = data.data.data;
        var orders = this.data.orders;
        for (var i in goods) {
          orders.push(goods[i])
        }
        this.setData({
          orders: orders
        });
        wx.stopPullDownRefresh();
        //console.log(data);
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'success'
        })
      }
    }, data => { }, data => { });
  },

  orderCancel: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定取消该订单？',
      success: function (res) {
        if (res.confirm) {
          var openid = app.globalData.openid;
          var url = app.globalData.domain + 'Order/orderCancel';
          var params = { id: id, openid: openid};
          util.wxRequest(url, params, data => {
            if (data.code == 200) {
              that.setData({ orders: [] });
              that.getOrderList(that.data.deafultStatus, 1);
            } else {
              wx.showToast({
                title: data.msg,
                icon: 'none'
              })
            }
          }, data => { }, data => { });
        }
      }
    })
  },

  orderConfirm: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认收货？',
      success: function (res) {
        if (res.confirm) {
          var openid = app.globalData.openid;
          var url = app.globalData.domain + 'Order/orderConfirm';
          var params = { id: id, openid: openid};
          util.wxRequest(url, params, data => {
            if (data.code == 200) {
              that.setData({ orders: [] });
              that.getOrderList(that.data.deafultStatus, 1);
            } else {
              wx.showToast({
                title: data.msg,
                icon: 'none'
              })
            }
          }, data => { }, data => { });
        }
      }
    })
  },

  paynow: function (e) {
    var index = e.currentTarget.dataset.index;
    var order = [];
    order[index]=this.data.orders[index];
    wx.navigateTo({
      url: '../pay/pay?order=' + JSON.stringify(order),
    })
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
    this.setData({ orders: [] });
    this.getOrderList(this.data.deafultStatus, 1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getOrderList(this.data.deafultStatus, ++this.data.page);
    wx.showToast({
      title: '加载中···',
      icon: 'loading'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})