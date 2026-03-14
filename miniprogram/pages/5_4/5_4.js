// pages/5_4/5_4.js
Page({
onLoad:function(){
    this.ctx=wx.createCanvasContext('myCanvas', this);
},
drawCircle:function(e){
    var x=e.detail.value.x
    var y=e.detail.value.y
    var radius=e.detail.value.radius
    this.ctx.arc(x,y,radius,0.001*Math.PI)
    this.ctx.stroke();
    this.ctx.draw(true)
},
clear:function(){
    this.ctx.draw()
}
})