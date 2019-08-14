//app.js
//index.js
const util = require('utils/util.js');
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取用户信息
    wx.getSetting({
      success: res => {
       
        if (res.authSetting['scope.userInfo']) {
          console.log('success')
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res.userInfo)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })


    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          var that = this;
          //发起网络请求
          console.log(res.code)
         wx.request({
           url: that.globalData.domain+'Login/login',
           method:'POST',
           data: {
             code: res.code,
           },
           success: function (response) {
             //询问用户是否授权是wx.getUserInfo发起的
             if (response.data.openid != null && response.data.openid != undefined) {
               that.globalData.openid = response.data.openid;
               that.getUser();
             }
           },
           fail: function (error) {
             console.log('获取openid失败');
           }
         })
        } else {
          console.log('登录失败！' + res.errMsg)
        }

      }
    })
 
  },
  getUser: function () {
    var that = this;
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: that.globalData.domain + 'User/getuser',
            method:'POST',
            data:{
              code: res.code,
              openid: that.globalData.openid 
            },
            success:function(res){
              if (res.data.status == 200) {
                that.globalData.userInfo = res.data.data;
                if (res.data.data.nick_name) {
                  that.globalData.login = true;
                }
              } else if (res.data.status == 400) {
                that.register();  //注册
              } else {
                that.globalData.login = false;
                wx.showToast({
                  title: "fail",
                  duration: 2000
                })
              }
            },
            fail:function(){
              console.log('获取user失败');
            }
          })
        }
        else {
          console.log('error');
        }
      }
    })
  },
  register: function () {
    var that = this;
    wx.request({
      url: that.globalData.domain + 'User/register',
      method:'POST',
      data:{
        openid: that.globalData.openid,
        nick_name: that.globalData.userInfo.nickName,
        head_src: that.globalData.userInfo.avatarUrl
      },
      
     success:function(res){
       var that=this;
       if(res.data.status == 200){
         console.log("注册成功")
        // that.globalData.userInfo = res.data.data
       }else{
         console.log("注册失败")
       }
     }
    })
   
  },
  globalData: {
    //domain: 'http://127.0.0.1/tp5/public/index.php/api/',
    //img_url:'http://127.0.0.1/tp5/public/static/wechat/',

    domain:'https://www.yteng3456.xyz/public/index.php/api/',
    img_url:'https://www.yteng3456.xyz/public/static/wechat/',
    userInfo: null,
    openid: '',
    login: false,
    cartIds: '',
    goodsTotalPrice: 0.0,
    wxData: [],
    order: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  }
})