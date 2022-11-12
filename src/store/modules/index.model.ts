import { IBookInfo, ICatalogListItem, IChapterInfo, INetVideoSourceRes } from '@/types/player.interface'
/** app */
export interface IAppState {
  bookInfo: IBookInfo;
  swipeList: IChapterInfo[];
  swipeIndex: number;
  isShowEndPage: boolean;
  recommendData: INetVideoSourceRes;
}

/** Device */
export interface IDeviceState {
  isOnline: boolean;
  headerData: {[key: string]: any}
  readingStartTime: number;
  readChapterList: string[];
  isRetain: boolean;
  isShowUnlockTip: boolean;
  isShowOperationTip: boolean; // 是否显示新手引导提示
  isNeedReload: boolean;
}

/** Chapters */
export interface IChaptersState {
  tabIndex: number;
  totalChapters: number;
  chapterAllList: ICatalogListItem[];
  isShowDrama: boolean;
  isPayVisible: boolean;
}
