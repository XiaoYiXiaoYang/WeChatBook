// pages/address/list/list.js
const app = getApp();
Page({
/**
 * 页面的初始数据
 */
data: {
   address:[]
},
navToAddAddress:function(){
  wx.navigateTo({
    url: '../add/add',
  })
},
/**
 * 生命周期函数--监听页面加载
 */
onLoad: function (options) {
  this.getAddress();
},
getAddress:function(){
var that =this;
wx.request({
  url: app.globalData.domain + 'Address/getAddress',
  method:'POST',
  data:{
    openid:app.globalData.openid,
  },
  success:function(res){
    console.log(res.data)
    if (res.data.code == 200) {
      that.setData({address:res.data.data});
    } else {
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 2000
      })
    }
  }
})
},
 navToAddAddress:function(){
  wx.navigateTo({
    url: '../add/add',
  })
},

navToEditAddress: function (e) {
  var that =this;
  var index = e.currentTarget.dataset.index;
  var addressId = that.data.address[index].address_id;//获取到地址的id
  wx.navigateTo({
    url: '../edit/edit?id=' + addressId
  })
},

//设置默认地址
setDeafult:function(e){
  var that = this;
  var index = e.currentTarget.dataset.index;
  wx.request({
    url: app.globalData.domain + 'Address/setDeafult',
    method:'POST',
    data:{
      openid:app.globalData.openid,
      addressId:that.data.address[index].address_id,//获取到地址的id
    },
    success:function(res){
       if (res.data.code == 200) {
      wx.showToast({
        title: res.data.msg,
        icon: 'success'
      });
      that.getAddress();
    } else {
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      });
    }
    }
  })
},

//取消/删除收货地址记录
delAddress: function (e) {
  var that = this;
  var index = e.currentTarget.dataset.index;
  var address = that.data.address;
  var addressId = address[index].address_id;//获取到地址的id
  address.splice(index, 1);
  that.setData({
    address: address
  });
  wx.request({
    url: app.globalData.domain + 'Address/delAddress',
    method:'POST',
    data:{
      openid:app.globalData.openid,
      addressId:addressId,//获取到地址的id
    },
    success:function(res){
      if (res.data.code == 200) {
      wx.showToast({
        title: res.data.msg,
        icon: 'success'
      });
    }else{
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      });
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