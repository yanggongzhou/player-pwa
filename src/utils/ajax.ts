import { netHiveLog } from '@/api/clientLog'

export async function fetchGet (url: string, params?: { [key: string]: string | number }) {
  let _url = url
  if (params) {
    const paramsArray: string[] = []
    // 拼接参数
    Object.keys(params).forEach((key) => {
      paramsArray.push(`${key}=${params[key]}`)
    })
    if (_url.search(/\?/) === -1) {
      _url += '?' + paramsArray.join('&')
    } else {
      _url += '&' + paramsArray.join('&')
    }
  }
  try {
    // fetch请求
    const response = await fetch(_url, { method: 'GET' })
    if (response.ok) {
      const {
        pub,
        pri
      } = await response.json()
      if (pub && pub.status === 0) {
        netHiveLog('event_remote_success', { url: _url })
        return pri
      } else {
        netHiveLog('event_remote_err', { url: _url })
      }
    }
  } catch (e) {
    console.log(e)
    netHiveLog('event_remote_err', { url: _url })
  }
}
