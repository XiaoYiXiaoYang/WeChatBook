// pages/publish_book/input_book/input_book.js
var app =getApp();
Page({

/**
* 页面的初始数据
*/
data: {
isbn:'9787111128069',
multiArray: [['公路学院', '汽车学院','机械学院','经管学院','电控学院','信息学院','地测学院','资源学院','建工学院','环工学院',
'建筑学院','材料学院','马克思学院','文传学院','理学院','外国语学院','国际教育学院','体育系','公共管理学院'],
 ['小说', '文学', '计算机', '建筑', '工业技术','自然科学','考研','四六级','教师资格证','计算机二级','其他']],
array: ['上门取货', '送货上门', '皆可满足'],
  imn: 0,
multiIndex: [0, 0],
book:{
  type1:'',
  type2:'',
  name:'',
  author:'',
  ori_price:'',
  pre_price:'',
  pics: [],   //http
  imgs:[],    //220190518/..
  description:'', 
  means: 0,
}
},
getISBN:function(e){
this.setData({ isbn: e.detail.value });
},

get_book_name:function(e){
this.setData({ 'book.name': e.detail.value });
},
get_book_author:function(e){
this.setData({ 'book.author': e.detail.value });
},
get_ori_price:function(e){
this.setData({ 'book.ori_price': e.detail.value });
},
get_pre_price:function(e){
this.setData({ 'book.pre_price': e.detail.value });
},
get_description:function(e){
this.setData({ 'book.description': e.detail.value });
},
pickChange: function (e) {
  this.setData({
    'book.means': e.detail.value
  });
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
  var str=res.data;
  str=str.trim();
    that.setData({
      'book.imgs':that.data.book.imgs.concat(str)
    });
    that.getbook();
  }
}) 
},
chooseImage: function (e) {
    var that = this;
    let maxLength=2;
    wx.chooseImage({
        count:2,  //最多上传两张照片
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            if (that.data.book.pics.length>=maxLength){
              wx.showModal({
              content: '最多能上传'+maxLength+'张图片',
              showCancel:false,
              success:function(res){
                if(res.confirm){
                }
              }
            })
          }else{
            const tempFilePaths = res.tempFilePaths
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            console.log(res)
            that.setData({
                'book.pics': that.data.book.pics.concat(res.tempFilePaths)
            });
              var le = res.tempFilePaths.length;
            for(let i=0;i<res.tempFilePaths.length;i++){
             wx.uploadFile({
                url: app.globalData.domain+'Goods/upload', // 仅为示例，非真实的接口地址
                filePath: tempFilePaths[i],
                name: 'pic',
               
                success:function(res) {
                    console.log(res)
                   var str = res.data;
                   str =str.trim();
                    that.setData({
                      'book.imgs':that.data.book.imgs.concat(str),
                      imn: Number(that.data.book.imgs.length) + le,
                    });
                }
              })
          }
          }
        
        }
    })
},
previewImage: function(e){
    wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.book.pics    // 需要预览的图片http链接列表
    })
},
bindMultiPickerChange(e) {
var that =this;
that.setData({
  multiIndex: e.detail.value,
  'book.type1':e.detail.value[0]+1,
  'book.type2':e.detail.value[1]+20,
})
},
bindMultiPickerColumnChange(e) {
const data = {
  multiArray: this.data.multiArray,
  multiIndex: this.data.multiIndex
}
},
dimage: function (e) {
  var that = this;
  var images = that.data.book.pics;
  var imn = that.data.imn;
  wx.showModal({
    title: '提示',
    content: '确认删除图片吗',
    success: function (res) {
      if (res.confirm) {
        images.splice(e.currentTarget.dataset.in, 1);
        that.setData({
          'book.pics': images,
          'book.imgs': images,
          imn: imn - 1,
        })
      } else if (res.cancel) { }
    }
  });
},
getType:function(){
    wx.request({
    url: app.globalData.domain+'Goods/getType',
    method:'POST',
    data:{
      openid:app.globalData.openid,
    },
    success:function(res){
      console.log(res.data)
    }
    })
},
post_book:function(){
console.log(this.data.book)
wx.request({
url: app.globalData.domain+'Goods/post_book',
method:'POST',
data:{
  openid:app.globalData.openid,
  type1:this.data.book.type1,
  type2:this.data.book.type2,
  name:this.data.book.name,
  author:this.data.book.author,
  ori_price:this.data.book.ori_price,
  pre_price:this.data.book.pre_price,
  imgs:this.data.book.imgs,    
  description:this.data.book.description,
  means: this.data.book.means,
},
success:function(res){
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