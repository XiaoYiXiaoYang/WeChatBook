// pages/collect/collect.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsCollect:[],
    page:1,
    dataEmpty:true,
    scrollHeight: 0,
    buyHeight: 51,
    img_src:app.globalData.img_url,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        //手机系统的相关信息
        var screenHeight = res.windowHeight;
        var scrollHeight = screenHeight - that.data.buyHeight;
        that.setData({
          scrollHeight: scrollHeight,
        });
      },
    });
  },


//获取收藏数据
  getCollectGoods: function(){
    var that = this;
    wx.request({
      url: app.globalData.domain + 'Collect/collectList',
      method:'POST',
      data:{
        openid:app.globalData.openid,
      },
      success:function(data){
  
      if(data.data.code == 200){
        console.log(data)
        that.setData({
          goodsCollect:data.data.data,
          dataEmpty:false,
        })
      }else{
        wx.showToast({
          title: data.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }
    })
  },

  //删除
  delCartGoods: function(e){
    var index = e.currentTarget.dataset.index;
    var goodsCollect = this.data.goodsCollect;
    var id =  goodsCollect[index].book_id;

    goodsCollect.splice(index, 1);
    this.setData({
      goodsCollect: goodsCollect,
    });

    wx.request({
      url: app.globalData.domain + 'Collect/delCollectGoods',
      method:'POST',
      data:{
        openid:app.globalData.openid,
        goodsId:id
      },
      success:function(data){

     if(data.code == 200){
        this.setData({
          dataEmpty:true
        });
      }else{
        wx.showToast({
          title: data.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }
    })
  },

jumpIndex:function(){
  wx.switchTab({
    url: '/pages/home/home',
  });
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getCollectGoods();
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
    wx.showToast({
      Title:'正在刷新···',
      Icon:'loading'
    });
    this.setData({
      page: 1,
      goodsCollect: []
    });
    this.getCollectGoods(1);
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getCollectGoods(++this.data.page);
    wx.showToast({
      Title: '正在加载···',
      Icon: 'loading'
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})