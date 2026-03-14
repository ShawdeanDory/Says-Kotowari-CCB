// index.js
Page({
    data: {
        copyText1: "https://oauth.shu.edu.cn/login/eyJ0aW1lc3RhbXAiOjE3Mjg3MDgyNzkyODA3NDc1MzIsInJlc3BvbnNlVHlwZSI6ImNvZGUiLCJjbGllbnRJZCI6IkU0MjJPQmsyNjExWTRiVUVPMjFnbTFPRjFSeGtGTFE2Iiwic2NvcGUiOiIxIiwicmVkaXJlY3RVcmkiOiJodHRwczovL2p3eGsuc2h1LmVkdS5jbi94c3hrL29hdXRoL2NhbGxiYWNrIiwic3RhdGUiOiIifQ==",
        copyText2: "https://learning.shu.edu.cn/portal",
        copyText3: "http://www.phylab.shu.edu.cn/openexp/index.php/Public/login",
        copyText4: "https://jw.shu.edu.cn/",
        copyText5: "https://cj.shu.edu.cn/StudentPortal/ScoreQuery",
        copyText6: "https://www.crazygames.com/"
    },
    copyText1() {
        wx.setClipboardData({
            data: this.data.copyText1,
            success: () => {
                wx.showModal({
                    title: '复制成功',
                    content: '不用开VPN',
                    complete: (res) => {
                        if (res.cancel) {}
                        if (res.confirm) {
                        }
                    }
                })
            }
        })
    },
    copyText2() {
        wx.setClipboardData({
            data: this.data.copyText2,
            success: () => {
                wx.showModal({
                    title: '复制成功',
                    content: '不用开VPN',
                    complete: (res) => {
                        if (res.cancel) {}
                        if (res.confirm) {}
                    }
                })
            }
        })
    },
    copyText3() {
        wx.setClipboardData({
            data: this.data.copyText3,
            success: () => {
                wx.showModal({
                    title: '复制成功',
                    content: '记得开VPN',
                    complete: (res) => {
                        if (res.cancel) {}
                        if (res.confirm) {}
                    }
                })
            }
        })
    },
    copyText4() {
        wx.setClipboardData({
            data: this.data.copyText4,
            success: () => {
                wx.showModal({
                    title: '复制成功',
                    content: '记得开VPN',
                    complete: (res) => {
                        if (res.cancel) {}
                        if (res.confirm) {}
                    }
                })
            }
        })
    },
    copyText5() {
        wx.setClipboardData({
            data: this.data.copyText5,
            success: () => {
                wx.showModal({
                    title: '复制成功',
                    content: '不用开VPN',
                    complete: (res) => {
                        if (res.cancel) {}
                        if (res.confirm) {}
                    }
                })
            }
        })
    },
    copyText6() {
        wx.setClipboardData({
            data: this.data.copyText6,
            success: () => {
                wx.showModal({
                    title: '复制成功',
                    content: '记得开VPN',
                    complete: (res) => {
                        if (res.cancel) {}
                        if (res.confirm) {}
                    }
                })
            }
        })
    },
    copyText7() {
        wx.setClipboardData({
            data: this.data.copyText7,
            success: () => {
                wx.showModal({
                    // title: '复制成功',
                    // content: '记得开VPN',
                    complete: (res) => {
                        if (res.cancel) {}
                        if (res.confirm) {}
                    }
                })
            }
        })
    },
    copyText8() {
        wx.setClipboardData({
            data: this.data.copyText8,
            success: () => {
                wx.showModal({
                    // title: '复制成功',
                    // content: '记得开VPN',
                    complete: (res) => {
                        if (res.cancel) {}
                        if (res.confirm) {}
                    }
                })
            }
        })
    },
})