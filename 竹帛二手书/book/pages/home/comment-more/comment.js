//comment-more.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ask_id:'',
    //newComment:'',
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      ask_id: options.id
    });
  },
  // 把用户输入的评论保存到变量里
  bindNewComment: function (e) {
    this.data.newComment = e.detail.value; // 不更新 input，提高效率
  },
  //提交评论并保存到云数据库中
  submitComment() {
    var that = this
    // 如果评论输入为空，则提示用户输入，不进行提交
    if (!this.data.newComment) {
      wx.showToast({
        title: '请输入评论'
      });
    } else {
      that.addComment();
    }
  },
  //添加评论
  addComment(){
    var that = this;
    wx.request({
      url: app.globalData.domain + 'Goods/addcomment',
      method: 'POST',
      data: {
          openid: app.globalData.openid,
          content: that.data.newComment,
          ask_id: that.data.ask_id
        },

        success: res => {
          wx.showToast({
            title: '评论成功',
          })
          this.setData({
            newComment: ''
          })
          wx.navigateTo({
            url: '../comment/comment?id=' + that.data.ask_id,
          })
        },
        fail: err => {
          wx.showToast({
            title: '评论失败',
          })
        }
      })
    }
})
