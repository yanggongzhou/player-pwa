import Service from '@/utils/request'
import { INetAppletRes, INetClassRes } from '@/types/theater.interface'

/**
 * 书城接口
 */
// export const netTheater = async (): Promise<any> => {
//   return await Service.post('/asg/portal/call/258.do', {
//     "key_sign": "c8ddf89de6fa20c1c1c41155c0fe8db8",
//     "type": "1",
//     "channel_id": "88",
//     "readpref": "0"
//   })
// }

export const netApplet = async (): Promise<INetAppletRes> => {
  return await Service.get('/api/applet/config')
}
export const netClass = async (class_ids: string): Promise<INetClassRes> => {
  return await Service.post('/api/parent/class/index', { class_ids })
}
