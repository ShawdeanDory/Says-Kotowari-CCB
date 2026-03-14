// index.js
Page({
    data:{
        dlsb:1,
        sr:1,
        userInfo: null ,// 用户信息
        username: '', // 用户名
      password: '', // 密码
      isRegister: false, // 是否显示注册表单
      message: '' // 提示信息
    },
    onLoad: function (options) {
        console.log('--index.js--onLoad--页面加载')
    },
    onReady: function () {
        console.log('--index.js--onReady--页面初次渲染完成')
    },
    onShow: function () {
        console.log('--index.js--onShow--页面显示')
    },
    onHide: function () {
        console.log('--index.js--onHide--页面隐藏')
    },
    onUnload: function () {
        console.log('--index.js--onUnload--页面卸载')
    },
    data: {
        name: '',
        password: ''
    },
    nameinput: function (e) {
        this.setData({
            name: e.detail.value
        })
    },
    passwordinput: function (e) {
        this.setData({
            password: e.detail.value
        })
    },
    createcolor: function () {
        var color = []
        var letters = '0123456789ABCDEF'
        for (var i = 0; i < 5; i++) {
            var c = '#'
            for (var j = 0; j < 6; j++) {
                c += letters[Math.floor(Math.random() * 16)]
            }
            color.push(c)
        }
        console.log(color)
        this.setData({
            c1: color[0],
            c2: color[1],
            c3: color[2],
            c4: color[3],
            c5: color[4]
        })
    },
    onLoad: function (e) {
        this.createcolor();
        setInterval(() => {
            this.createcolor()
        }, 100)
    },
    changecolor: function (e) {
        this.createcolor()
    },
    sddl: function () {
        let audio = wx.createInnerAudioContext()
        audio.src = "/audios/阿米寓说的道理.wav"
        audio.play()
    },
    lzt: function () {
        let audio = wx.createInnerAudioContext()
        audio.src = "/audios/鬼叫  otto_爱给网_aigei_com.mp3"
        if (this.data.name == '' || this.data.password == '') {
            setTimeout(() => {
                audio.play()
            }, 3000);
        }
        // setTimeout(() => {wx.navigateTo({
        //     url: '/pages/cx/cx'
        //   })
        // }, 3000);
    },
    denglu: function () {
        if (this.data.name == '' || this.data.password == '') {
            this.setData({
                dlsb: true,
                sr: false
            })
        } else if(this.data.name == '' || this.data.password == ''){

        }
        else {
            this.setData({
                dlsb: false,
                sr: true
            })
        }
    },
    bindUsernameInput: function(e) {
        this.setData({
          username: e.detail.value
        });
      },
    
      // 监听密码输入
      bindPasswordInput: function(e) {
        this.setData({
          password: e.detail.value
        });
      },
    
      // 切换登录/注册表单
      toggleRegister: function() {
        this.setData({
          isRegister: !this.data.isRegister,
          message: '' // 清空提示信息
        });
      },
    
      // 处理登录
      handleLogin: function() {
        const { username, password } = this.data;
    
        if (!username || !password) {
          this.setData({
            message: '用户名和密码不能为空'
          });
          return;
        }
    
        // 调用登录接口
       
      },
    xcx:function(){
        wx.navigateTo({
          url: '/pages/xcx/xcx'
        })
    },
      // 处理注册
      handleRegister: function() {
        const { username, password } = this.data;
    
        if (!username || !password) {
          this.setData({
            message: '用户名和密码不能为空'
          });
          return;
        }
    
        // 调用注册接口
        wx.request({
          url: 'https://your-backend-api.com/register ', // 替换为你的注册接口地址
          method: 'POST',
          data: {
            username: username,
            password: password
          },
          success: (res) => {
            if (res.data.success) {
              wx.showToast({
                title: '注册成功',
                icon: 'success'
              });
              // 注册成功后切换到登录表单
              this.setData({
                isRegister: false,
                message: ''
              });
            } else {
              this.setData({
                message: res.data.message || '注册失败'
              });
            }
          },
          fail: () => {
            this.setData({
              message: '网络请求失败'
            });
          }
        });
      }
})