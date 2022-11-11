import { ICatalogParams, INetCatalogListRes, INetVideoSourceRes } from '@/types/player.interface'
import { EAutoAdd, EChapterStatus, IWebAndLogParam } from '@/types/common.interface'
import { ChaptersModule } from '@/store/modules/chapters'
import { DeviceModule } from '@/store/modules/device'
import { debounce } from 'throttle-debounce'
import Service, { BASEURL } from '@/utils/request'

const WebApi = window.bookSotre

// export const BASEURL = process.env.NODE_ENV === "production" ? BaseUrlEnvironment.staging : BaseUrlEnvironment.test
console.log('-----------BASEURL----------->', BASEURL)

/**
 * 初始化接口 / 快速打开接口
 * @param book_id
 * @param chapter_id
 */
export const netVideoSource = async (book_id = '41000000003', chapter_id = ''): Promise<INetVideoSourceRes | void> => {
  console.log('-----------初始化接口 / 快速打开接口----------->')
  const { book } = await Service.post('/call/244.do', { book_id, chapter_id })
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
      chapterStatus: EChapterStatus.免费
    }
  }
}

/**
 * WebAndPre 章节预加载 236
 * @param bookId
 * @param chapterId
 */
export const netVideoPre = debounce(200, async (book_id: string, chapter_id: string) => {
  console.log('-----------章节预加载-----------', chapter_id)
  return await netVideoSource(book_id, chapter_id)
})
/**
 * 获取客户端请求头
 */
export const netWebAndHeader = () => {
  if (JSON.stringify(DeviceModule.headerData) === '{}' || Object.keys(DeviceModule.headerData).length === 0) {
    console.log('-----------WebAndHeader 获取客户端请求头-----------')
    const headData = WebApi && WebApi.WebAndHeader ? JSON.parse(WebApi.WebAndHeader()) : {};
    DeviceModule.SetHeaderData(headData)
    return headData
  }
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
 * WebAndSelect 章节选择
 * @param bookId
 * @param chapterId
 */
export const netWebAndSelect = (bookId: string, chapterId: string) => {
  console.log('-----------WebAndSelect 章节选择-----------', chapterId)
  if (WebApi && WebApi.WebAndSelect) {
    WebApi.WebAndSelect(JSON.stringify({ bookId, chapterId }))
  }
}

/**
 * WebAndEnd H5选择推荐剧集
 * @param bookId
 * @param chapterId
 */
export const netWebAndEnd = (bookId: string, chapterId: string) => {
  console.log('-----------WebAndEnd H5选择推荐剧集-----------', bookId, chapterId)
  if (WebApi && WebApi.WebAndEnd) {
    WebApi.WebAndEnd(JSON.stringify({ bookId, chapterId }))
  }
}

/**
 * 加入书架
 * @param bookId 书籍id
 */
export const netDrama = (bookId: string) => {
  console.log('-----------WebAndDrama 加入书架-----------')
  if (WebApi && WebApi.WebAndDrama) {
    WebApi.WebAndDrama(JSON.stringify({ bookId }))
  }
}

/**
 * 打点
 * @param data
 */
export const netWebAndLog = (data: IWebAndLogParam) => {
  console.log('-----------WebAndLog 打点-----------', data.type)
  if (WebApi && WebApi.WebAndLog) {
    WebApi.WebAndLog(JSON.stringify(data))
  }
}

/**
 * 关闭客户端播放器页面
 */
export const netLeave = () => {
  console.log('-----------closePage 关闭客户端播放器页面-----------')
  if (WebApi && WebApi.closePage) {
    WebApi.closePage()
  }
}

/**
 * 唤起付费弹框
 */
export const netWebAndPay = (bookId: string, chapterId: string) => {
  console.log('-----------WebAndPay 唤起付费弹框-----------', chapterId)
  if (WebApi && WebApi.WebAndPay && !ChaptersModule.isPayVisible) {
    WebApi.WebAndPay(JSON.stringify({ bookId, chapterId }))
    ChaptersModule.SetIsPayVisible(true)
  }
}

/**
 * 推荐书籍
 * @param bookId
 */
export const netRecommendBook = async (bookId: string): Promise<INetVideoSourceRes> => {
  console.log('-----------S 推荐书籍-----------')
  return await Service.post('/call/413.do', { bookId })
}
