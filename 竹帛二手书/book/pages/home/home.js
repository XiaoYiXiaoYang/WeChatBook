var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app=getApp();
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    tabs: ["推荐", "全部"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    empty:true,
    page:1,
    books:[],
    asks:[],
    pageask:1,
    image_url:app.globalData.img_url,

    recommends:[],
  },
 tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  goSearch:function(e){
  
    wx.navigateTo({
      url: '../function/search/search?key='+e.detail.value,
    })
  },

  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    that.loadAllbook();
    that.getLatestPost();
    that.getaskbook();
  },
getaskbook:function(){
    var that = this;
    console.log(that.data)
    wx.request({
      url: app.globalData.domain + 'Goods/getAllAskFor',
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
loadAllbook:function(){
  var that=this;
  console.log(that.data)
  wx.request({
    url: app.globalData.domain+'Goods/getAll',
    method:'POST',
    data:{
      openid:app.globalData.openid,
      page:that.data.page,
    },
    success:function(res){
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
  console.log(e)
  var that = this;
  console.log(that.data.books)
  var index=e.currentTarget.dataset.index;
  var id = that.data.books[index].post_id;
  console.log(id)
  wx.navigateTo({
    url: '../publish_book/book_info/book_info?id='+id,
  })
},

show_ask_info:function(e){
  console.log(e)
  var that = this;
  var index = e.currentTarget.dataset.index;
  var id = that.data.asks[index].ask_id;
  console.log(id)
  wx.navigateTo({
    url: 'comment/comment?id=' + id,
  })
},

 getLatestPost(){
  var that = this;
    wx.request({
      url: app.globalData.domain+'Goods/getLatestPost',
      method:'POST',
      data:{
        openid:app.globalData.openid,
      },
      success:function(res){
        if (res.data.status == 200) {
          var recommendslist = res.data.data.data
          var recommends = that.data.recommends;
          for(var i in recommendslist){
            recommends.push(recommendslist[i])
          }
          that.setData({
            recommends:recommends
          });
            console.log("推荐")
            console.log(that.data.recommends)
        } else {
          wx.showToast({
            title: "获取数据失败",
            icon: 'success'
          })
        }
      }
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
    this.setData({ books:[], page:1 });
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