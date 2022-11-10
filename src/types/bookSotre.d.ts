interface IWebApi {
  WebAndInit: () => string; // 初始化接口
  WebAndHeader: () => string; // 获取客户端请求头
  WebAndPre: (param: string) => void; // 章节预加载
  WebAndDrama: (param: string) => void; // 加入书架
  WebAndPay: (param: string) => string; // 唤起付费弹框
  WebAndLog: (param: string) => void; // 打点
  closePage: () => void; // 关闭客户端播放器页面
  WebAndSelect: (param: string) => void; // 选择章节数据
  WebAndEnd: (param: string) => void; // H5选择推荐剧集
}
declare interface Window {
  bookSotre: IWebApi;
  AndWebSelect: (param: { [key: string]: never }) => void; // 选择章节数据
  AndWebPre: (param: { [key: string]: never }) => void; // 章节预加载
  AndWebPay: (param: { [key: string]: never }) => void; // 关闭付费窗口
  AndWebQuit: () => void; // 安卓手势返回 & 手机底部按钮返回
  onResume: (param: { [key: string]: never }) => void;
}
