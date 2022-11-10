import { netWebAndHeader } from '@/api/player'
import { EnumPline } from '@/types/common.interface'

const HiveUrl = 'https://log.klynf.com/h5_stand_final_log.php'
const IpUrl = 'https://api.klynf.com/asg/remote.do'
// 大数据打点
export const netHiveLog = (eventType = '', data = {}) => {
  const logData = getLogParams(eventType, data)
  fetch(`${HiveUrl}?json=${JSON.stringify(logData)}`, { method: 'GET', keepalive: true })
}

// 获取Ip
export const netIP = async () => {
  window.localStorage.setItem('DEVICE_IP', '')
  return new Promise((resolve) => {
    fetch(IpUrl, {
      method: 'GET',
      keepalive: true
    }).then((response) => {
      response.json().then((res) => {
        const ip = res.data.toString().replace('\n', '')
        window.localStorage.setItem('DEVICE_IP', ip || '0.0.0.0')
        resolve(ip)
        netHiveLog('event_remote_success', { status: res.status, url: IpUrl })
      }).catch(() => {
        netHiveLog('event_remote_err', { url: IpUrl })
        resolve('0.0.0.0')
      })
    }).catch(() => {
      netHiveLog('event_remote_err', { url: IpUrl })
      resolve('0.0.0.0')
    })
  })
}

/**
 * 获取大数据打点参数
 */
export const getLogParams = (eventType: string, data = {}) => {
  const { channelCode = '', pname = '', utdid = '', imei = '', os, userId = '', brand } = netWebAndHeader()
  const log_id = randomString()
  return {
    pkna: pname, // 包名
    chid: channelCode,
    channelCode,
    uid: utdid,
    utdid,
    imei,
    userId,
    cts: new Date().getTime(), // 客户端时间，精确到毫秒
    pline: EnumPline.小说大全, // 产品线
    bline: 'xsdq', // 业务线
    log_id, // 日志id 随机生成，16位字符串即可
    type: 'h5_player',
    event: eventType, // 事件名称
    data: {
      ip: window.localStorage.getItem('DEVICE_IP') || '0.0.0.0',
      h5uid: utdid,
      os,
      brand,
      ua: navigator.userAgent,
      action: 3, // 1 pv | 2 按钮点击下载
      ...data
    }
  }
}

export function randomString () {
  const len = 16
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  const maxPos = $chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}
