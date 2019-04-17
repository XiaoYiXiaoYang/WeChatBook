// pages/publish_book/input_book/input_book.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isbn:'9787111128069',
    book:{
      name:'',
      author:'',
            
    }
  },
getISBN:function(e){
  this.setData({ isbn: e.detail.value });
},
getbook:function(){
  var that= this;
 wx.request({
   url: 'https://api.douban.com/v2/book/isbn/:9787111128069',
   header: {
          'Content-type': 'application/json'
    },
  // method:'GET',
   success:function(res){
    console.log(res.data)
   }
 })
},

getScanisbn:function(){
  var that = this;
    wx.scanCode({
      success(res) {
        that.setData({
          isbn:res.data.result
        });
        that.getbook();
      }
    }) 
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