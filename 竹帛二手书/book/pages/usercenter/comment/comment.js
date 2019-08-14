var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp();
Page({
  data: {
    asks: [],
    pageask: 1,
    image_url: app.globalData.img_url,
  },
onLoad: function () {
  var that = this;
  that.getaskbook();
},
  getaskbook: function () {
    var that = this;
    console.log(that.data)
    wx.request({
      url: app.globalData.domain + 'Goods/getAskByuserid',
      method: 'POST',
      data: {
        openid: app.globalData.openid,
        pageask: that.data.pageask,
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == 200) {
          var asklist = res.data.data.data
          var asks = that.data.asks;
          for (var i in asklist) {
            asks.push(asklist[i])
          }
          var pageask = that.data.pageask;
          that.setData({
            asks: asks,
            pageask: pageask + 1,
            empty: false,
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

  show_ask_info: function (e) {
    console.log(e)
    var that = this;
    var index = e.currentTarget.dataset.index;
    var id = that.data.asks[index].ask_id;
    console.log(id)
    wx.navigateTo({
      url: '../../home/comment/comment?id=' + id,
    })
  },
  /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
  onPullDownRefresh: function () {
    wx.showToast({
      title: '正在刷新数据...',
      icon: 'loading'
    });
    this.setData({ books: [], page: 1 });
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showToast({
      title: '正在加载数据...',
      icon: 'loading'
    });
    this.loadAllbook();
  },


  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
});