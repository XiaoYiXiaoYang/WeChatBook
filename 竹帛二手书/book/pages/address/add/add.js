const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    phone:'',
    address:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  getname:function(e){
    this.setData({name: e.detail.value});
  },

  getphone: function (e) {
    this.setData({ phone: e.detail.value });
  },

  getaddress: function (e) {
    this.setData({ address: e.detail.value });
  },

  submit: function () {
    wx.request({
      url: app.globalData.domain + 'Address/addAddress',
      method:'POST',
      data:{
        openid: app.globalData.openid,
        name:this.data.name,
        phone:this.data.phone,
        address:this.data.address,
      },
      success:function(res){
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'success'
          });
          wx.navigateTo({
            url: '../list/list',
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'success'
          })
        }
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