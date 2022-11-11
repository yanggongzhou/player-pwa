import Service from '@/utils/request'

/**
 * 书城接口
 */
export const netTheater = async (): Promise<any> => {
  console.log('-----------s 剧集列表-----------')
  return await Service.post('/call/258.do', {
    "key_sign": "c8ddf89de6fa20c1c1c41155c0fe8db8",
    "type": "1",
    "channel_id": "88",
    "readpref": "0"
  })
}

