//comment.js
var app = getApp();
Page({

  data: {
    ask: {
      images: [],
      title: '',
      desc: '',
      ask_id: '',
    },
    comment:[],
    showDialog: false,
    collect: [],
    isCollected: false,
    collectByMp3IdAndUId: [],
    img_url: app.globalData.img_url,
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      'ask.ask_id': options.id
    });
    this.showask();
    this.showAllComment();
    //this.getCollectByMp3IdAndUId(app.requestDetailid, app.globalData.openid);
  },

  //打开评论弹出层
  toggleDialogHandle: function () {
    this.showDialog = !this.showDialog;
    this.setData({
      showDialog: this.showDialog
    })
  },

  // 把用户输入的评论保存到变量里
  bindNewComment: function (e) {
    this.data.newComment = e.detail.value; // 不更新 input，提高效率
  },
  //提交评论
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
  addComment() {
    var that = this;
    wx.request({
      url: app.globalData.domain + 'Goods/addComment',
      method: 'POST',
      data: {
        userName: app.globalData.userInfo.nickName,
        //userImage: app.globalData.userInfo.avatarUrl,
        content: that.data.newComment,
        commitTime: time,
        ask_id: that.data.ask.ask_id
      },

      success: res => {
        wx.showToast({
          title: '评论成功',
        })
        this.setData({
          newComment: ''
        })

        wx.navigateTo({
          url: '../comment/comment',
        })
      },
      fail: err => {
        wx.showToast({
          title: '评论失败',
        })
      }
    })

  },
  //查询所有评论
  showAllComment() {
    var that = this;
    wx.request({
      url: app.globalData.domain + 'Goods/getAllCommenter',
      method: 'POST',
      data: {
        ask_id: that.data.ask.ask_id,
      },
      success: function (res) {
        if (res.data.status == 200) {
          /*var commentlist = res.data.data
          var comment = that.data.comment;
          for (var i in commentlist) {
            comment.push(commentlist[i])
          }*/
          that.setData({
            comment: res.data.data,
          })
          console.log(that.data.comment.content)
        } else {
          wx.showToast({
            title: "获取评论失败",
            icon: 'success'
          })
        }
      }
    })
  },
  //显示求购信息
showask() {
    var that = this;
    wx.request({
      url: app.globalData.domain + 'Goods/getAskById',
      method: 'POST',
      data: {
        ask_id: that.data.ask.ask_id,
      },
      success: function (res) {
        if (res.data.status == 200) {
          that.setData({
            'ask.title': res.data.data.ask_title,
            'ask.desc': res.data.data.ask_desc,
          })
          var imglist = res.data.picres;
          for (var i in imglist) {
            that.setData({
              'ask.images': that.data.ask.images.concat(imglist[i].img),
            })
          }
        } else {
          wx.showToast({
            title: "获取书籍信息失败",
            icon: 'success'
          })
        }
      }
    })
  },
  //分享转发
  onShareAppMessage: function () {
    let that = this;
    return {
      title: that.data.ask.title,
      Img: that.data.ask.images,
      success: function (res) {
        // 转发成功
        console.log('转发成功！')
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败!')
      }
    }
  },
  //收藏与未收藏之间的转换
  onCollectTap() {
    var isCollected = this.data.isCollected;
    if (isCollected) {
      //取消收藏
      var videoId = getApp().requestDetailid;
      var user_oppenId = app.globalData.openid;//此为当前用户的oppenId
      console.log('-----测试-------' + user_oppenId);
      this.removeCollect(videoId, user_oppenId);
      // 设置setData值，前端界面才能读取到isCollect的值，以下同理
      this.setData({
        isCollected: false
      })
    } else {
      //收藏
      this.addCollect();
      this.setData({
        isCollected: true
      })
    }

  },
  _onCollectTap() {
    var isCollect = this.data.isCollect;
    if (isCollect) {
      //收藏
      this.addCollect();
      this.setData({
        isCollected: false
      })
    } else {
      //取消收藏
      var videoId = getApp().requestDetailid;
      var user_oppenId = app.globalData.openid;//此为当前用户的oppenId
      this.removeCollect(videoId, user_oppenId);
      // 设置setData值，前端界面才能读取到isCollect
      this.setData({
        isCollected: true
      })
    }
  },
  //收藏
  addCollect() {
    let that = this;
    const db = wx.cloud.database() //打开数据库连接
    var videoId = getApp().requestDetailid; //获取当前videoId
    db.collection("collects").add({
      data: {
        title: this.data.video[0].title,
        author: this.data.video[0].author,
        tempFileURL: that.data.video[0].tempFileURL,
        videoImg: that.data.video[0].videoImg,
        videoId: videoId,
      },
      success: res => {
        wx.showToast({
          title: "收藏成功",
          icon: 'success',
          duration: 1000,
          make: true
        });
      },
      fail: err => {
        wx.showToast({
          title: "服务器维护中,收藏失败",
          duration: 1000,
          icon: "sucess",
          make: true
        })
      }

    })



  },
  //删除收藏信息,根据视频id和用户id指定唯一的收藏信息
  removeCollect: function (videoId, user_openid) {
    const db = wx.cloud.database();
    db.collection("collects").where({
      videoId: videoId,
      _openid: user_openid
    }).get({
      success: res => {
        db.collection("collects").doc(res.data[0]._id).remove({
          success: res => {
            wx.showToast({
              title: '已取消收藏',
            })
          }, fail: err => {
            wx.showToast({
              title: '取消失败',
            })
          }
        })
      },
      fail: err => {
        wx.showToast({
          icon: "none",
          title: '查询记录失败',
        })
      }
    })
  },

  //根据视频id和用户openId获取收藏信息
  getCollectByMp3IdAndUId: function (videoId, user_openid) {
    var user_openid = app.globalData.openid;
    var videoId = getApp().requestDetailid;
    const db = wx.cloud.database()
    db.collection("collects").where({
      videoId: videoId,
      _openid: user_openid,
    }).get({
      success: res => {
        var that = this
        that.setData({
          collectByMp3IdAndUId: res.data,
        })
          , console.log('---------->>>' + res.data)
        console.log('---------->>>' + app.globalData.openid)
      },
      fail: err => {
        wx.showToast({
          icon: "none",
          title: '服务器维护中',
        })
      }
    })
  },
  add_ask_comment: function (e) {
    var that = this;
    var id = that.data.ask.ask_id;
    console.log(id)
    wx.navigateTo({
      url: '../comment-more/comment?id=' + id,
    })
  },

})
