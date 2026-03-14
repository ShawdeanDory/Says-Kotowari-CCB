// pages/5_1/5_1.js
function createRandomIndex(){
    return Math.floor(Math.random()*10)
}
Page({

  data: {
    index:0,
    imgArr:[
        '/images/01.jpg',
        '/images/02.jpg',
        '/images/sddl.png'
    ],
  },
  changeFace:function(){
      this.setData({
          index:createRandomIndex()
      })
  },
  onShow:function(){
      var that=this;
      wx.onAccelerometerChange(function(res){
        if(res.x>0.5||res.y>0.5||res.z>0.5){
            wx.showToast({
              title: '摇一摇成功',
              icon:'success',
              duration:2000
            })
            that.changeFace()
        }

      })
    }
})