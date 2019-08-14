
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    name:'',
    phone:'',
    address:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({id:options.id});
    that.getAddress(options.id);
    
  },
  getshr: function (e) {
    this.setData({ name: e.detail.value });
  },

  getmobile: function (e) {
    this.setData({ phone: e.detail.value });
  },

  getaddress: function (e) {
    this.setData({ address: e.detail.value });
  },
  getAddress: function (id){
    var that = this;
    wx.request({
      url: app.globalData.domain + 'Address/getOneAddress',
      method:'POST',
      data:{
        openid:app.globalData.openid,
        id:id,
      },
      success:function(res){
        if (res.data.code == 200) {
        that.setData({
          name:res.data.data.user_name,
          phone:res.data.data.phone,
          address:res.data.data.address
        });
        wx.showToast({
          title: res.data.msg,
          icon: 'success'
        });
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'success'
        })
      }
      }
    })
  },

  submit: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + 'Address/updateAddress',
      method:'POST',
      data:{
        openid:app.globalData.openid,
        name:that.data.name,
        phone:that.data.phone,
        address:that.data.address,
        id:that.data.id
      },
      success:function(res){
        if (res.data.code == 200) {
        wx.showToast({
          title: res.data.msg,
          icon: 'success'
        });
        wx.navigateTo({
           url: '../list/list',
        });
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