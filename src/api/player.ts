import { ICatalogParams, INetCatalogListRes, INetVideoSourceRes } from '@/types/player.interface'
import { fetchGet } from '@/utils/ajax'
import { IWebAndLogParam } from '@/types/common.interface'
import { ChaptersModule } from '@/store/modules/chapters'
import { netHiveLog } from '@/api/clientLog'
import { DeviceModule } from '@/store/modules/device'
import { debounce } from 'throttle-debounce'

const WebApi = window.bookSotre
// 测试 http://192.168.1.70:89/
// 预发布 https://yfb-player-feat.klynf.com/
// 线上: https://player-feat.klynf.com/

enum EBaseUrlEnvironment {
  test = 'http://192.168.0.241:4080',
  staging = 'http://yfb.klynf.com',
  production = 'https://api.klynf.com',
}

const BaseUrlEnvironment = () => {
  if (location.host === 'player-feat.klynf.com') {
    return EBaseUrlEnvironment.production
  }
  if (location.host === 'yfb-player-feat.klynf.com') {
    return EBaseUrlEnvironment.staging
  }
  if (location.host === '192.168.1.70:89' || location.host === 'localhost:8000' || location.host === '192.168.1.9:8000') {
    return EBaseUrlEnvironment.test
  }
  return EBaseUrlEnvironment.production
}

export const BASEURL = BaseUrlEnvironment();
// export const BASEURL = process.env.NODE_ENV === "production" ? BaseUrlEnvironment.staging : BaseUrlEnvironment.test
console.log('-----------BASEURL----------->', BASEURL)

/**
 * 初始化接口
 */
export const netVideoSource = (): INetVideoSourceRes | void => {
  if (WebApi && WebApi.WebAndInit) {
    netHiveLog('WebAndInit', {})
    const data = JSON.parse(WebApi.WebAndInit())
    console.log('-----------WebAndInit 初始化接口数据----------->', data)
    return data
  }
}

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
  return await fetchGet(BASEURL + '/asg/portal.do', {
    call: 412,
    json: JSON.stringify({
      pri: { pageSize: 30, ...params },
      pub: netWebAndHeader()
    })
  })
}
/**
 * WebAndPre 章节预加载
 * @param bookId
 * @param chapterId
 */
export const netVideoPre = debounce(200, (bookId: string, chapterId: string) => {
  console.log('-----------WebAndPre 章节预加载-----------', chapterId)
  if (WebApi && WebApi.WebAndPre) {
    netHiveLog('WebAndPre', { bookId, chapterId })
    WebApi.WebAndPre(JSON.stringify({ bookId, chapterId }))
  }
})

/**
 * WebAndSelect 章节选择
 * @param bookId
 * @param chapterId
 */
export const netWebAndSelect = (bookId: string, chapterId: string) => {
  console.log('-----------WebAndSelect 章节选择-----------', chapterId)
  if (WebApi && WebApi.WebAndSelect) {
    netHiveLog('WebAndSelect', { bookId, chapterId })
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
    netHiveLog('WebAndEnd', { bookId, chapterId })
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
    netHiveLog('WebAndDrama', { bookId })
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
    netHiveLog('WebAndLog', { ...data })
  }
}

/**
 * 关闭客户端播放器页面
 */
export const netLeave = () => {
  console.log('-----------closePage 关闭客户端播放器页面-----------')
  if (WebApi && WebApi.closePage) {
    netHiveLog('closePage')
    WebApi.closePage()
  }
}

/**
 * 唤起付费弹框
 */
export const netWebAndPay = (bookId: string, chapterId: string) => {
  console.log('-----------WebAndPay 唤起付费弹框-----------', chapterId)
  if (WebApi && WebApi.WebAndPay && !ChaptersModule.isPayVisible) {
    netHiveLog('WebAndPay', { bookId, chapterId })
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
  return await fetchGet(BASEURL + '/asg/portal.do', {
    call: 413,
    json: JSON.stringify({
      pri: { bookId },
      pub: netWebAndHeader()
    })
  })
}
