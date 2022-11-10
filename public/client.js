/** http://192.168.0.30:8090/pages/viewpage.action?pageId=14425775#id-%E5%B0%8F%E8%AF%B4%E5%A4%A7%E5%85%A8H5%E6%92%AD%E6%94%BE%E5%99%A8-1.WebAndInit%E5%88%9D%E5%A7%8B%E5%8C%96%E6%8E%A5%E5%8F%A3 */

// 临时mock数据
window.bookSotre = {
  WebAndInit: function () {
    const json = {
      bookInfo: {
        bookId: '41000000003',
        bookName: '大佬甜妻宠上天',
        autoAdd: 0,
        bookCover: 'http://qnqat.kuaikandushu.cn/cppartner/4x1/41x0/410x0/41000010050/41000010050.jpg?t=1659682758109&imageView2/0/w/200/h/267',
        bookFinishStatus: 1,
      },
      isFirstPlay: true,
      chapterInfo: {
        chapterId: '527989155',
        chapterIndex: 1,
        chapterName: '一',
        chapterUrl: 'http://dzzt-video.qcread.cn/test10/55/0x5/05x0/050x0/05001000014/527989155/527989155.mp4.jpg',
        content: {
          mp4: 'http://dzzt-video.qcread.cn/d543ed54552ddd52ac9cde1fabb6c0bf/6369c4ed/test10/69/3x0/30x0/300x0/30000000014/528616796/528616796.720p.mp4',
          m3u8: 'http://dzzt-video.qcread.cn/d543ed54552ddd52ac9cde1fabb6c0bf/6369c4ed/test10/69/3x0/30x0/300x0/30000000014/528616796/528616796.720p.mp4.m3u8',
          mp4720p: 'http://dzzt-video.qcread.cn/d543ed54552ddd52ac9cde1fabb6c0bf/6369c4ed/test10/69/3x0/30x0/300x0/30000000014/528616796/528616796.720p.mp4',
          m3u8720p: "http://dzzt-video.qcread.cn/d543ed54552ddd52ac9cde1fabb6c0bf/6369c4ed/test10/69/3x0/30x0/300x0/30000000014/528616796/528616796.720p.mp4.m3u8"
        },
        duration: 50,
        chapterStatus: 1,
        preChapterId: '',
        preChapterName: '',
        nextChapterId: '527989156',
        nextChapterName: '二',
      }
    }
    return JSON.stringify(json)
  },
  WebAndHeader: function () {
    return JSON.stringify({"clientAgent":"svnVer_2208151401","mchid":"GG2000000","mbid":"","city":"-1","screen":"1080x2400","appCode":"f002","imsi":"","deviceId":"dzb9f4b54e11354aafa0bb1ac80c37d1bf","lsw":"1","apiVersion":"9.9.9.100999","province":"-1","model":"SM-A5160","brand":"samsung","apn":"wifi","channelCode":"GG2000000","install_time":"1660723200000","dzPaySupport":"2","os":"android30","pname":"com.dz.xsdq","utdid":"45e7dae8-64b7-4537-94f6-15476b66fe8a","en":"{\"adsdk\":\"2\"}","channelFee":"GG2000000","time_zone":" 0800","userId":"24623","lpp":"{\"notifySwitch\":\"1\",\"$os_version\":\"11\",\"$manufacturer\":\"samsung\"}","adjustAdid":"044ee892556dd861321b9b0e5625a460","chid":"GG2000000","p":"66","subPline":"2","afu":"0","cmTel":"","v":"4","phone_time":"2022-08-17","imei":"","macAddr":"02:00:00:00:00:00"})
  },
  WebAndDrama: function (bookId) {
    console.log('\x1b[33m%s\x1b[0m', '加入书架', bookId)
  },
  WebAndPay: function (bookId, chapterId) {
    console.log('\x1b[33m%s\x1b[0m', '唤起付费弹框', bookId, chapterId)
  },
  WebAndLog: function (data) {
    console.log('\x1b[32m%s\x1b[0m', '打点', data)
  },
  WebAndPre: function (str) {
    console.log('\x1b[34m%s\x1b[0m', '章节预加载', str)
    window.AndWebPre({
      chapterId: "527989156",
      chapterName: "二",
      chapterIndex: 2,
      chapterUrl: "http://dzzt-video.qcread.cn/test10/65/0x5/05x0/050x0/05001000014/527989156/527989156.mp4.jpg",
      content: {
        "mp4": "https://kyyvideo.cbread.cn/b471312b833c62dd3eaadc11e0f0c473/6350dc59/test10/65/0x5/05x0/050x0/05001000014/527989156/527989156.mp4",
        "m3u8": "https://kyyvideo.cbread.cn/a1c16d14a623e2a1954a660bf0be63b4/6350dc59/test10/65/0x5/05x0/050x0/05001000014/527989156/527989156.mp4.m3u8",
        mp4720p: 'https://www.runoob.com/try/demo_source/movie.mp4',
        "m3u8720p": "https://kyyvideo.cbread.cn/7da5649faf1d7620bd53e7b0c7be1b0b/6350dc59/test10/65/0x5/05x0/050x0/05001000014/527989156/527989156.720p.mp4.m3u8"
      },
      duration: 55,
      chapterStatus: 1,
      preChapterId: '527989155',
      preChapterName: '一',
      nextChapterId: '527989157',
      nextChapterName: '三',
    })
  },
  WebAndSelect: function (str) {
    console.log('\x1b[34m%s\x1b[0m', '章节选择', str)
    const chapterInfo = {
      chapterId: "527989156",
      chapterName: "二",
      chapterIndex: 2,
      chapterUrl: "http://dzzt-video.qcread.cn/test10/65/0x5/05x0/050x0/05001000014/527989156/527989156.mp4.jpg",
      content: {
        "mp4": "https://www.runoob.com/try/demo_source/movie.mp4",
        "m3u8": "https://kyyvideo.cbread.cn/a1c16d14a623e2a1954a660bf0be63b4/6350dc59/test10/65/0x5/05x0/050x0/05001000014/527989156/527989156.mp4.m3u8",
        "mp4720p": "https://kyyvideo.cbread.cn/d3b0c03812cb195431c94f980f02bfa6/6350dc59/test10/65/0x5/05x0/050x0/05001000014/527989156/527989156.720p.mp4",
        "m3u8720p": "https://kyyvideo.cbread.cn/7da5649faf1d7620bd53e7b0c7be1b0b/6350dc59/test10/65/0x5/05x0/050x0/05001000014/527989156/527989156.720p.mp4.m3u8"
      },
      duration: 55,
      chapterStatus: 1,
      preChapterId: '527989155',
      preChapterName: '一',
      nextChapterId: '527989157',
      nextChapterName: '三',
    }
    window.AndWebSelect(chapterInfo)
  },
  closePage: function () {
    console.log('\x1b[34m%s\x1b[0m', '关闭客户端播放器页面')
  },
  WebAndPay: function () {
    console.log('\x1b[34m%s\x1b[0m', '唤起付费弹框')
    const json = {
      isPay: 1,
      chapterInfo: {
        chapterId: "527989156",
        chapterName: "二",
        chapterIndex: 3,
        chapterUrl: "http://dzzt-video.qcread.cn/test10/65/0x5/05x0/050x0/05001000014/527989156/527989156.mp4.jpg",
        content: {
          "mp4": "https://kyyvideo.cbread.cn/b471312b833c62dd3eaadc11e0f0c473/6350dc59/test10/65/0x5/05x0/050x0/05001000014/527989156/527989156.mp4",
          "m3u8": "https://kyyvideo.cbread.cn/a1c16d14a623e2a1954a660bf0be63b4/6350dc59/test10/65/0x5/05x0/050x0/05001000014/527989156/527989156.mp4.m3u8",
          "mp4720p": "https://kyyvideo.cbread.cn/d3b0c03812cb195431c94f980f02bfa6/6350dc59/test10/65/0x5/05x0/050x0/05001000014/527989156/527989156.720p.mp4",
          "m3u8720p": "https://kyyvideo.cbread.cn/7da5649faf1d7620bd53e7b0c7be1b0b/6350dc59/test10/65/0x5/05x0/050x0/05001000014/527989156/527989156.720p.mp4.m3u8"
        },
        duration: 55,
        chapterStatus: 1,
        preChapterId: '527989155',
        preChapterName: '一',
        nextChapterId: '527989157',
        nextChapterName: '三',
      }
    }
    setTimeout(() => {
      window.AndWebPay(JSON.stringify(json))
    }, 1000)

  }
}


// window.WebApi[obj.name](JSON.stringify(json))
