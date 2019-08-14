// compontents/homeHot/homeHot.js
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
      image: "/pages/imgs/renshenghaihai.jpg",
      title: "人生海海",
      prePrice: "55.00",
      price: "42.30",
      author: "卖家",
      type:"未知"
    }, {
      image: "/pages/imgs/manweizhifu.jpg",
      title: "漫威之父",
      prePrice: "75.00",
      price: "56.20",
      author: "鲍勃",
      type:"人物"
    }, {
      image: "/pages/imgs/daoshangshudian.jpg",
      title: "岛上书店",
      prePrice: "35.00",
      price: "27.70",
      author: "加·泽文",
      type:"小说"
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
      onLoad: function () {
      console.log("求购信息");
      this.getAskFor();
    },
  getAskFor(){
    wx.request({
      url: app.globalData.domain+'Goods/getAllAskFor',
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
