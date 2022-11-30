import Service from '@/utils/request'
import { INetLoginRes } from '@/types/self.interface'

/**
 * 书城接口
 */
export const netLogin = async (): Promise<INetLoginRes> => {
  console.log('-----------s 剧集列表-----------')
  return await Service.post('/api/quick/app/user/login', {
    "undid": "yarrD1C_10gI9yQwwn3swNzyqZQF-J8m8Ocvhssg",
    "openid": "kgXxR5D5s1uPgNvWy9BBKt2A9ENSDKBvatHg1TnJKLnJwFaf3Gvt80hnvvc6mBQv",
    "gzh_id": "xiaomi",
    "request_id": "",
    "put_link_id": "",
    "ad_id": "",
    "callback": ""
  })
}
