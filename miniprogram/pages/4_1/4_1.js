// pages/4_1/4_1.js
var C;
Page({
calc:function(e){
C=parseInt(e.detail.value.cels);
this.setData({
  M:(C/7.2800).toFixed(4),
  Y:(C/9.09).toFixed(4),
  G:(C/0.94).toFixed(4),
  O:(C/7.5600).toFixed(4),
  H:(C/0.0050).toFixed(4),
  R:(C/0.0480).toFixed(4)
})
},
reset:function(){
    this.setData({
        M:'',
        Y:'',
        G:'',
        O:'',
        R:'',
        H:''
    })
}
  
})