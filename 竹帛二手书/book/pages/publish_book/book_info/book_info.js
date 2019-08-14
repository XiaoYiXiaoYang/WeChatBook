// pages/publish_book/books_info/book_info.js
const app = getApp();
Page({
  data:{
    typearray1: ['公路学院', '汽车学院', '机械学院', '经管学院', '电控学院', '信息学院', '地测学院', '资源学院', '建工学院', '环工学院',
      '建筑学院', '材料学院', '马克思学院', '文传学院', '理学院', '外国语学院', '国际教育学院', '体育系', '公共管理学院'],

    typearray2: ['小说', '文学', '计算机', '建筑', '工业技术', '自然科学', '考研', '四六级', '教师资格证', '计算机二级', '其他'],
    book_id:'',
    img_url:app.globalData.img_url,
    book:{
      images:[],
      title:'',
      author:'',
      type1:'',
      type2:'',
      price:'',
      prePrice:'',
      detail:'',
      transMethod:'',
      if_love:true,
      if_sale:true,
      means:'',
      user_id:'',
    },
    tabClass: [],
    status: ['all', 'waitpay', 'waitsent', 'waitreceive', 'finish'],
    deafultStatus: 'all',
  },

  /**
   * 生命周期函数--监听页面加载
   */
 onLoad: function (options) {
    var that = this;
    that.setData({
      book_id:options.id
    });
    that.get_collect_status();
    that.get_book_by_id();
  },

get_book_by_id:function(){
  var that=this;
  wx.request({
    url: app.globalData.domain+'Goods/getBookById',
    method:'POST',
    data:{
      openid:app.globalData.openid,
      book_id:that.data.book_id,
    },
    success:function(res){
      console.log(res.data)
      
    if (res.data.status == 200) {
        that.setData({
          book_id:res.data.book_info.post_id,
          'book.title':res.data.book_info.book_name,
          'book.author':res.data.book_info.book_author,
          'book.price':res.data.book_info.ori_price,
          'book.prePrice':res.data.book_info.pre_price,
          'book.detail':res.data.book_info.book_desc,
          'book.type1':(res.data.type_info[0].type_id - 1),
          'book.type2':(res.data.type_info[1].type_id - 20),
          'book.if_sale': res.data.book_info.is_sale,
          'book.means': res.data.book_info.means,
          'book.user_id': res.data.book_info.user_id,
        })

        var imglist = res.data.pic_info;
        var images = that.data.images;
         for(var i in imglist){
         that.setData({
          'book.images':that.data.book.images.concat(imglist[i].img_src),
         })
        }
        
    }else{
      wx.showToast({
      title: "获取书籍信息失败",
      icon: 'success'
    })
    }
    }
  })
},
get_collect_status:function(){
  var that = this;
  wx.request({
    url: app.globalData.domain +'Collect/getOnestatus',
    method:'POST',
    data:{
      book_id:that.data.book_id,
    },
    success:function(res){
      console.log(res.data.data)
      if (res.data.data==-1){
        that.setData({
          if_love: false,
        })
      }
      console.log(that.data.book.if_love)
    }

  })
},
addToCollect:function(){
  var that = this;
  wx.request({
    url: app.globalData.domain +'Collect/addToCollect',
    method:'POST',
    data:{
      book_id:that.data.book_id,
      openid :app.globalData.openid,
    },
    success:function(res){
      console.log(res)
      if(res.data.status ==200){
        wx.navigateTo({
          url: '../../collect/collect',
        })
      }else{
        console.log("加入失败")
      }
    }
  })
},
delCollect:function(){
  wx.request({
    url: app.globalData.domain+'Collect/delCollectGoods',
    method:'POST',
    data:{
      book_id:that.data.book_id,
    },
    success:function(res){
      console.log(res)
      // that.setData({
      //   collect_status:res.data.status,
      // })
    }
  })
},
addToOrder:function(){
  var that = this;
  wx.request({
    url: app.globalData.domain + 'Order/addToOrder',
    method:'POST',
    data:{
      book_id:that.data.book_id,
      user_id:that.data.book.user_id,
      openid:app.globalData.openid,//买家
      total_price:that.data.book.prePrice,
      means:that.data.book.means,
    },
    success:function(res){
      console.log(res)
      var index = 0;
      var navClass = ['normal', 'normal', 'normal', 'normal', 'normal'];
      navClass[index] = 'selected';
      var status = that.data.status;
      var deafultStatus = status[index];
      var flag = true;
    if(res.data.status==200){
      wx.navigateTo({
        url: '../../order/list/list?tabClass=' + JSON.stringify(navClass) + '&deafultStatus=' + deafultStatus + '&flag=' + flag,
      })
    }else{
      console.log("失败")
    }
    }
  })
},

/**打开评论界面 */
openChat:function(){

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