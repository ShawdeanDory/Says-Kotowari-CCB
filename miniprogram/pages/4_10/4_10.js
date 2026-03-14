// pages/4_10/4_10.js
Page({
  data: {
    getEmail:'',
    getPwd:'',
    getPwdConfirm:''
  },
  formSubmit:function(e){
      if(e.detail.value.password.length ==0 || e.detail.value.email.length==0){
        this.setData({
            showMsg01:'邮箱或密码不能为空！'
        })
      }
      else if(e.detail.value.password!=e.detail.value.confirm){
        this.setData({
            showMsg02:'两次输入不一致！',
            getPwd:'',
            getPwdConfirm:''
        })       
      }
      else{
          wx.navigateTo({
            url: '../detail/detail',
          })
      }
  },
  inputemail:function(e){
    var email=d.detail.value
    var checkedNum=this.checkEmail(email)
  },
  checkEmail:function(email){
      let str=/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
      if(str.test(email)){
          return true
      }else{
          wx.showToast({
            title: '邮箱格式错误',
            icon:'loading'
          })
          this.setData({
              getEmail:''
          })
          return false
      }
  }
})