// pages/4_8/4_8.js
Page({

  data: {
poster:'/images/sddl.png',
name:'sddl',
author:'sddl',
src:'/audios/阿米寓说的道理.wav'
  },
  audioPlay:function(){
      this.audioCtx.play()
  },
  audioPause:function(){
        this.audioCtx.pause()
  },
  audio14:function(){
      this.audioCtx.seek(1)
  },
  audioStart:function(){
      this.audioCtx.seek(0)
  },
  onLoad:function(options){
      this.audioCtx=wx.createAudioContext('myaudio')
  }
})