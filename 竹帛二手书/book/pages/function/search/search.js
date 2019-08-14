// pages/function/search/search.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keywords:'',
    page:1,
    books:[],
    image_url:app.globalData.img_url
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({keywords:options.key});
    that.get_book_by_keys();
  },

get_book_by_keys:function(){
  var that=this;
  wx.request({
    url: app.globalData.domain+'Goods/getBookByKey',
    method:'POST',
    data:{
      openid:app.globalData.openid,
      keywords:that.data.keywords,
      page:that.data.page,
    },
    success:function(res){
      console.log(res.data)
    if (res.data.status == 200) {
    var booklist = res.data.data.data
    var books = that.data.books;
    for(var i in booklist){
      books.push(booklist[i])
    }
    var page = that.data.page;
    that.setData({
      books:books,
      page :page+1,
      empty:false,
    });
    wx.stopPullDownRefresh();    
  } else {
    wx.showToast({
      title: "获取数据失败",
      icon: 'success'
    })
  }
    }
  })
},
//跳转到商品详情页面
show_book_info: function(e) {
  var that = this;
  var index=e.currentTarget.dataset.index;
  var id = that.data.books[index].book_id;
  console.log(id)
  wx.navigateTo({
    url: '../../publish_book/book_info/book_info?id='+id,
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
    wx.showToast({
      title: '正在刷新数据...',
      icon: 'loading'
    });
    this.setData({ books:[], page:1 });
    wx.stopPullDownRefresh();
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