import { EAutoAdd, EBookFinishStatus, EChapterStatus, EIsCharge, EIsSimplified } from '@/types/common.interface'

export interface IChapterContent {
  mp4: string;
  m3u8: string;
  mp4720p: string;
  m3u8720p: string;
}

export interface IChapterInfo {
  chapterId: string;
  chapterIndex: number;
  chapterName: string;
  chapterUrl?: string;
  content?: IChapterContent,
  duration?: number;
  chapterStatus: EChapterStatus;
  preChapterId?: string;
  preChapterName?: string;
  nextChapterId?: string;
  nextChapterName?: string;
}

export interface IBookInfo {
  bookId: string;
  bookName: string;
  autoAdd: EAutoAdd;
  bookCover: string;
  bookFinishStatus: EBookFinishStatus,
}

export interface INetVideoSourceRes {
  bookInfo: IBookInfo;
  chapterInfo: IChapterInfo;
  isSimplified?: EIsSimplified;
  isFirstPlay?: boolean;
}

export interface ICatalogParams {
  bookId: string;
  pageNo?: number;
  pageSize?: number;
}

export interface ICatalogListItem {
  chapterId: string;
  chapterName: string;
  isCharge: EIsCharge;
  chapterIndex: number;
  chapterImg: string;
}

export interface INetCatalogListRes {
  author: string;
  bookName: string;
  coverWap: string;
  bookFinishStatus: EBookFinishStatus;
  chapterList: ICatalogListItem[];
  totalChapters: number;
}
