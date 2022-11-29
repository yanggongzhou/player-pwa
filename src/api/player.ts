import { ICatalogParams, INetCatalogListRes, INetVideoSourceRes } from '@/types/player.interface'
import { EAutoAdd, EChapterStatus } from '@/types/common.interface'
import { DeviceModule } from '@/store/modules/device'
import Service, { BASEURL } from '@/utils/request'

// export const BASEURL = process.env.NODE_ENV === "production" ? BaseUrlEnvironment.staging : BaseUrlEnvironment.test
console.log('-----------BASEURL----------->', BASEURL)

/**
 * 初始化接口 / 快速打开接口
 * @param book_id
 * @param chapter_id
 */
export const netVideoSource = async (book_id = '', chapter_id = ''): Promise<INetVideoSourceRes | void> => {
  console.log('-----------初始化接口 / 快速打开接口----------->', book_id)
  const { book, chapter_list = [] } = await Service.post('/call/244.do', { book_id, chapter_id })
  const chapterItem = chapter_list.find((chapter: any) => {
    return chapter.chapter_id === book.content_list[0].chapter_id
  })
  const _chapterStatus = chapterItem && chapterItem.is_charge === '1' ? EChapterStatus.未付费 : EChapterStatus.免费
  const { videoInfo, chapter_img } = book.content_list[0]
  return {
    bookInfo: {
      bookId: book.book_id,
      bookName: book.book_name,
      autoAdd: EAutoAdd.否,
      bookCover: book.cover_url,
      bookFinishStatus: book.market_status,
    },
    chapterInfo: {
      chapterId: book.content_list[0].chapter_id,
      chapterIndex: 1,
      chapterName: '',
      chapterUrl: chapter_img,
      content: videoInfo,
      duration: videoInfo.duration,
      chapterStatus: _chapterStatus
    }
  }
}

/**
 * WebAndPre 章节预加载 236
 * @param book_id
 * @param chapter_id
 */
export const netVideoPre = async (book_id: string, chapter_id: string): Promise<INetVideoSourceRes | void> => {
  console.log('-----------章节预加载-----------', chapter_id)
  return await netVideoSource(book_id, chapter_id)
}
/**
 * 获取客户端请求头
 */
export const netWebAndHeader = () => {
  // if (JSON.stringify(DeviceModule.headerData) === '{}' || Object.keys(DeviceModule.headerData).length === 0) {
  //   console.log('-----------WebAndHeader 获取客户端请求头-----------')
  //   DeviceModule.SetHeaderData(headData)
  //   return headData
  // }
  return DeviceModule.headerData
}

/**
 * 剧集列表
 * @param params ICatalogParams
 */
export const netCatalogList = async (params: ICatalogParams): Promise<INetCatalogListRes> => {
  console.log('-----------s 剧集列表-----------')
  return await Service.post('/call/412.do', { pageSize: 30, ...params })
}

/**
 * 加入书架
 * @param bookId 书籍id
 */
export const netDrama = (bookId: string) => {
  console.log('-----------WebAndDrama 加入书架-----------')

}

/**
 * 唤起付费弹框
 */
export const netWebAndPay = (bookId: string, chapterId: string) => {
  console.log('-----------WebAndPay 唤起付费弹框-----------', chapterId)
  // if (WebApi && WebApi.WebAndPay && !ChaptersModule.isPayVisible) {
  //   WebApi.WebAndPay(JSON.stringify({ bookId, chapterId }))
  //   ChaptersModule.SetIsPayVisible(true)
  // }
}

/**
 * 推荐书籍
 * @param bookId
 */
export const netRecommendBook = async (bookId: string): Promise<INetVideoSourceRes> => {
  console.log('-----------S 推荐书籍-----------')
  return await Service.post('/call/413.do', { bookId })
}
