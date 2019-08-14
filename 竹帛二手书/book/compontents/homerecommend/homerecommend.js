// compontents/homerecommend.js

const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
      books: [{
      image:"/pages/imgs/renshenghaihai.jpg",
      title:"人生海海",
      prePrice:"55.00",
      price:"42.30",
      author:"卖家",
      introduction:"新经典"
    }, {
        image:"/pages/imgs/manweizhifu.jpg",
        title:"漫威之父",
        prePrice:"75.00",
        price:"56.20",
        author:"鲍勃",
        introduction:"漫威之父斯坦李"
      }, {
        image: "/pages/imgs/daoshangshudian.jpg",
        title:"岛上书店",
        prePrice:"35.00",
        price:"27.70",
        author:"加·泽文",
          introduction:"每个人的生命中，都有无比艰难的那一年，将人生变得美好而辽阔。加·泽文感动全球千万读者的治愈小说！"
      }]
  },

  /**
   * 组件的方法列表
   */
  onLoad: function () {
      console.log("最新发布");
  },

  methods: {
  
  getLatestPost(){
    wx.request({
      url: app.globalData.domain+'Goods/getLatestPost',
      method:'POST',
      data:{
        openid:app.globalData.openid,
      },
      success:function(res){
        console.log(res.data)
      }
    })
  },

  
  }
})
