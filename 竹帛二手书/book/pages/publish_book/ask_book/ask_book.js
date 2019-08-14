// pages/publish_book/ask_book/ask_book.js

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    immax:7,
    min:3,
    index:'',
    max:300,
    imn: 0,
    currentWordNumber:0,
    ask: {
      ask_title: '',
      ask_desc: '',
      pics: [],   //http
      imgs: [],    //220190518/..
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  get_title:function(e){
    this.setData({
      'ask.ask_title': e.detail.value
    })
  },
  inp: function (e) {
    var _this = this;
    var value = e.detail.value;
    _this.setData({
      value: value,
    })
    var len = parseInt(value.length);

    if (len <= this.data.min)
      this.setData({
        texts: "加油，3个字不是很多"
      })
    else if (len > this.data.min)
      this.setData({
        'ask.ask_desc': e.detail.value
      })
    if (len > this.data.max) return;
    this.setData({
      currentWordNumber: len //当前字数  
    });
  },
  chooseImage: function (e) {
    var that = this;
    let maxLength = 7;
    wx.chooseImage({
      count: 7,  //最多上传两张照片
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        if (that.data.ask.pics.length >= maxLength) {
          wx.showModal({
            content: '最多能上传' + maxLength + '张图片',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
              }
            }
          })
        } else {
          const tempFilePaths = res.tempFilePaths
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          console.log(res)
          that.setData({
            'ask.pics': that.data.ask.pics.concat(res.tempFilePaths)
          });
          var le = Number(res.tempFilePaths.length);
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            wx.uploadFile({
              url: app.globalData.domain + 'Goods/upload', // 仅为示例，非真实的接口地址
              filePath: tempFilePaths[i],
              name: 'pic',
              success: function (res) {
                console.log(res)
                var str = res.data;
                str = str.trim();
                that.setData({
                  'ask.imgs': that.data.ask.imgs.concat(str),
                  imn: Number(that.data.ask.imgs.length) + le,
                });
              }
            })
          }
        }

      }
    })
  },
  dimage: function (e) {
    var that = this;
    var images = that.data.ask.pics;
    var imn = that.data.imn;
    wx.showModal({
      title: '提示',
      content: '确认删除图片吗',
      success: function (res) {
        if (res.confirm) {
          images.splice(e.currentTarget.dataset.in, 1);
          that.setData({
            'ask.pics': images,
            'ask.imgs':images,
            imn: imn - 1,
          })
        } else if (res.cancel) { }
      }
    });
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.ask.pics    // 需要预览的图片http链接列表
    })
  },
  publish:function(){
    wx.request({
      url: app.globalData.domain + 'Goods/ask_book',
      method: 'POST',
      data: {
        openid: app.globalData.openid,
        ask_title: this.data.ask.ask_title,
        ask_desc: this.data.ask.ask_desc,
        imgs: this.data.ask.imgs,
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
          });
          wx.switchTab({
            url: '/pages/home/home',
          });
        } else {
          wx.showToast({
            title: "提交失败",
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