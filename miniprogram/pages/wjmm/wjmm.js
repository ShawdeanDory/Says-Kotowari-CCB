Page({
        sddl: function () {
            let audio = wx.createInnerAudioContext()
            audio.src = "/audios/阿米寓说的道理.wav"
            audio.play()
        },
        lzt: function () {
            let audio = wx.createInnerAudioContext()
            audio.src = "/audios/鬼叫  otto_爱给网_aigei_com.mp3"
            audio.play()
        },
        djha: function () {
            let audio = wx.createInnerAudioContext()
            audio.src = "/audios/大家好啊，我是说的道理，今天来点大家想看的东西。.wav"
            audio.play()
        },

    })